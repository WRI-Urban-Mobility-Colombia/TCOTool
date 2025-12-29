import type { SelectOption, CalculatorFormData, AcquisitionCostsType } from './CalculatorForm.types';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import type { RequiredFieldsByStep } from './hooks/useEBusFormValidation.types';
import { percentageToDecimal, extractNumericValue } from '@/lib/utils';
import {
  SCROLL_ANIMATION_DURATION_MS,
  SCROLL_OFFSET_PX,
  SCROLL_PROGRESS_COMPLETE,
  SCROLL_EASING_MULTIPLIER,
  BASE_REQUIRED_FIELDS,
  STEP,
  IncentiveType,
  AdditionalOperatingExpensesType,
  SpecialEligibility,
  TECHNOLOGY_IDS,
  ROWS,
  DEFAULT_VALUES,
  TechnologyType,
  TECHNOLOGY_VALUES,
} from './CalculatorForm.constants';
import type { BusRow } from '@/lib/utils/csvReader';

export function createSelectOptionsFromEnum<T extends string | number>(
  enumObject: Record<string, T>,
  labels: Record<T, string>
): SelectOption[] {
  return Object.values(enumObject)
    .filter((value) => typeof value === 'string' || typeof value === 'number')
    .map((value) => ({
      value: String(value),
      label: labels[value as T] ?? String(value),
    }));
}

export function setFormPercentageValue(form: UseFormReturn<CalculatorFormData>, field: string, value: string): void {
  const decimalValue = percentageToDecimal(value);
  form.setValue(field as keyof CalculatorFormData, decimalValue);
}

export function handleNormalizedInputChange(
  form: UseFormReturn<CalculatorFormData>,
  field: string,
  event: React.ChangeEvent<HTMLInputElement>
): void {
  const normalizedValue = extractNumericValue(event.target.value);
  form.setValue(field as keyof CalculatorFormData, normalizedValue);
}

export function setNestedFormValue<T extends Record<string, Record<string, string>>>(
  form: UseFormReturn<CalculatorFormData>,
  basePath: keyof CalculatorFormData,
  column: keyof T,
  row: string,
  value: string,
  extractNumeric = true
): void {
  const currentValue = form.values[basePath];
  if (!isNestedRecord(currentValue)) {
    return;
  }

  const columnValue = currentValue[column as string];
  if (!isNestedRecord(columnValue)) {
    return;
  }

  const processedValue = extractNumeric ? value.replace(/[^\d.]/g, '') : value;

  form.setValue(basePath, {
    ...currentValue,
    [column]: {
      ...columnValue,
      [row]: processedValue,
    },
  });
}

function createScrollStep(startPosition: number, distance: number, startTime: number): (timestamp: number) => void {
  const step = (timestamp: number) => {
    const progress = Math.min((timestamp - startTime) / SCROLL_ANIMATION_DURATION_MS, SCROLL_PROGRESS_COMPLETE);

    const ease = progress * (SCROLL_EASING_MULTIPLIER - progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (progress < SCROLL_PROGRESS_COMPLETE) {
      requestAnimationFrame(step);
    }
  };

  return step;
}

export function smoothScrollToTop(element: HTMLElement): void {
  const targetPosition = element.offsetTop - SCROLL_OFFSET_PX;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;

  requestAnimationFrame((timestamp: number) => {
    const step = createScrollStep(startPosition, distance, timestamp);
    step(timestamp);
  });
}

type NestedValue = string | { [key: string]: NestedValue };

function isNestedRecord(value: unknown): value is { [key: string]: NestedValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getNestedValue(obj: { [key: string]: unknown }, path: string): string {
  const keys = path.split('.');

  const result = keys.reduce((current: unknown, key: string) => {
    if (isNestedRecord(current) && key in current) {
      return current[key];
    }
    return null;
  }, obj);

  return typeof result === 'string' ? result : '';
}

function deepCloneRecord(obj: { [key: string]: NestedValue }): { [key: string]: NestedValue } {
  return Object.keys(obj).reduce((cloned: { [key: string]: NestedValue }, key: string) => {
    const value = obj[key];
    if (isNestedRecord(value)) {
      cloned[key] = deepCloneRecord(value);
    } else {
      cloned[key] = value;
    }
    return cloned;
  }, {});
}

function setNestedFormValueByPath(form: UseFormReturn<CalculatorFormData>, path: string, value: string): void {
  const keys = path.split('.');

  if (keys.length === 1) {
    const key = keys[0];
    if (key in form.values) {
      form.setValue(key as keyof CalculatorFormData, value);
    }
    return;
  }

  const [firstKey, ...restKeys] = keys;
  if (!(firstKey in form.values)) {
    return;
  }

  const baseKey = firstKey as keyof CalculatorFormData;
  const current = form.values[baseKey];

  if (!isNestedRecord(current)) {
    return;
  }

  const cloned = deepCloneRecord(current);

  const navigationKeys = restKeys.slice(0, -1);
  const finalKey = restKeys[restKeys.length - 1];

  const targetNested = navigationKeys.reduce((nested: { [key: string]: NestedValue } | null, key: string) => {
    if (!nested) {
      return null;
    }
    const next = nested[key];
    return isNestedRecord(next) ? next : null;
  }, cloned);

  if (!targetNested) {
    return;
  }

  targetNested[finalKey] = value;
  form.setValue(baseKey, cloned);
}

export function createDefaultValueFocusHandler(
  form: UseFormReturn<CalculatorFormData>,
  field: string
): {
  onFocus: (_e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (_e: React.FocusEvent<HTMLInputElement>) => void;
} {
  const currentValue = getNestedValue(form.values, field);
  const defaultValue = getNestedValue(DEFAULT_VALUES, field);

  return {
    onFocus: (_e: React.FocusEvent<HTMLInputElement>) => {
      const normalizedCurrent = currentValue.trim().replace(/[^\d.]/g, '');
      const normalizedDefault = defaultValue.trim().replace(/[^\d.]/g, '');

      if (normalizedCurrent === normalizedDefault && normalizedCurrent !== '') {
        setNestedFormValueByPath(form, field, '');
      }
    },
    onBlur: (_e: React.FocusEvent<HTMLInputElement>) => {
      const inputValue = _e.target.value.trim().replace(/[^\d.]/g, '');
      const normalizedDefault = defaultValue.trim().replace(/[^\d.]/g, '');

      if ((inputValue === '' || inputValue === normalizedDefault) && normalizedDefault !== '') {
        setNestedFormValueByPath(form, field, defaultValue);
      }
    },
  };
}

export function getRequiredFields(currentStep: number, formValues: CalculatorFormData): RequiredFieldsByStep {
  const { incentiveType, additionalOperatingExpenses, specialEligibility } = formValues;
  const fields = { ...BASE_REQUIRED_FIELDS };

  if (currentStep === STEP.CAPEX_FORM && incentiveType) {
    const capexFields = [...fields[STEP.CAPEX_FORM]];
    if (incentiveType === IncentiveType.percentage || incentiveType === IncentiveType.amountOfMoney) {
      capexFields.push('eligibility');
    }
    if (incentiveType === IncentiveType.percentage) {
      capexFields.push('incentivePercentage');
    }
    if (incentiveType === IncentiveType.amountOfMoney) {
      capexFields.push('incentiveAmountCOP');
    }
    fields[STEP.CAPEX_FORM] = capexFields;
  }

  if (currentStep === STEP.FINEX_FORM && specialEligibility && specialEligibility !== SpecialEligibility.none) {
    const finexFields = [...fields[STEP.FINEX_FORM]];
    finexFields.push('specialRateEA');
    fields[STEP.FINEX_FORM] = finexFields;
  }

  if (
    currentStep === STEP.REFERENCE_FORM &&
    additionalOperatingExpenses?.type &&
    additionalOperatingExpenses.type !== AdditionalOperatingExpensesType.none
  ) {
    fields[STEP.REFERENCE_FORM] = [...fields[STEP.REFERENCE_FORM], 'additionalOperatingExpenses.quantity'];
  }

  return fields;
}

export function createTableData<T extends { id: string } = { id: string }>(labelKey: string, fieldName?: string): T[] {
  const currentFieldName = fieldName ?? labelKey;
  return TECHNOLOGY_IDS.map(
    (id) =>
      ({
        id,
        [currentFieldName]: ROWS.LABELS[labelKey as keyof typeof ROWS.LABELS][id],
      }) as T
  );
}

export function convertBusesDataToAcquisitionCosts(busesData: BusRow[]): AcquisitionCostsType {
  const getBusByTechnology = (technology: TechnologyType): BusRow | null => {
    const technologyValue = TECHNOLOGY_VALUES[technology];
    const bus = busesData.find((bus) => bus.technology === technologyValue);
    return bus || null;
  };

  const parseUSDValue = (value: string): string => {
    if (!value || value.trim() === '') return '';
    return extractNumericValue(value);
  };

  const dieselBus = getBusByTechnology(TechnologyType.diesel);
  const gnvBus = getBusByTechnology(TechnologyType.gnv);
  const electricBus = getBusByTechnology(TechnologyType.electric);

  return {
    busetonCost: {
      [TechnologyType.diesel]: parseUSDValue(dieselBus?.busCostUSD || ''),
      [TechnologyType.gnv]: parseUSDValue(gnvBus?.busCostUSD || ''),
      [TechnologyType.electric]: parseUSDValue(electricBus?.busCostUSD || ''),
    },
    infrastructure: {
      [TechnologyType.diesel]: parseUSDValue(dieselBus?.infrastructureUSD || ''),
      [TechnologyType.gnv]: parseUSDValue(gnvBus?.infrastructureUSD || ''),
      [TechnologyType.electric]: parseUSDValue(electricBus?.infrastructureUSD || ''),
    },
    battery: {
      [TechnologyType.diesel]: parseUSDValue(dieselBus?.batteryUSD || ''),
      [TechnologyType.gnv]: parseUSDValue(gnvBus?.batteryUSD || ''),
      [TechnologyType.electric]: parseUSDValue(electricBus?.batteryUSD || ''),
    },
  };
}
