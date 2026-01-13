import type { ValidacionTableRow, CapexFormProps } from '../CalculatorForm.types';
import {
  Typology,
  TYPLOGY_LABELS,
  IncentiveType,
  INCENTIVE_TYPE_LABELS,
  IncentiveEligibility,
  INCENTIVE_ELIGIBILITY_LABELS,
  Currency,
  CURRENCY_LABELS,
  FieldTablesId,
  AcquisitionCostsColumnIds,
  TechnologyType,
} from '../CalculatorForm.constants';
import { createSelectOptionsFromEnum, setNestedFormValue, createTableData } from '../CalculatorForm.utils';
import { createValidacionColumns } from '../CalculatorFormColumns';
import { useCurrency } from '../CurrencyContext';

export function useCapexForm(props: CapexFormProps) {
  const { form, handleContinue, submitAttempted, insertDefaultValues, handleAcquisitionCostsToggle } = props;
  const { currency, setCurrency, getCurrencyPrefix } = useCurrency();

  const validacionTableData = createTableData<ValidacionTableRow>(FieldTablesId.validation, FieldTablesId.technology);

  const typologySelectOptions = createSelectOptionsFromEnum(Typology, TYPLOGY_LABELS);
  const incentiveTypeSelectOptions = createSelectOptionsFromEnum(IncentiveType, INCENTIVE_TYPE_LABELS);
  const incentiveEligibilitySelectOptions = createSelectOptionsFromEnum(
    IncentiveEligibility,
    INCENTIVE_ELIGIBILITY_LABELS
  );
  const currencySelectOptions = createSelectOptionsFromEnum(Currency, CURRENCY_LABELS);

  const handleValidacionInputChange = (column: AcquisitionCostsColumnIds, row: TechnologyType, value: string) => {
    setNestedFormValue(form, 'acquisitionCosts', column, row, value, true);
  };

  const validacionColumns = createValidacionColumns({
    form,
    acquisitionCosts: form.values.acquisitionCosts,
    handleValidacionInputChange,
    currencyPrefix: getCurrencyPrefix(),
    submitAttempted,
  });

  return {
    form,
    handleContinue,
    submitAttempted,
    insertDefaultValues,
    handleAcquisitionCostsToggle,
    currency,
    setCurrency,
    getCurrencyPrefix,
    validacionTableData,
    validacionColumns,
    typologySelectOptions,
    incentiveTypeSelectOptions,
    incentiveEligibilitySelectOptions,
    currencySelectOptions,
  };
}
