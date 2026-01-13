import React from 'react';
import { Input } from 'vizonomy';
import {
  TechnologyType,
  TableInputVariant,
  FormInputVariant,
  ButtonVariant,
  ButtonWidthVariant,
  AcquisitionCostsColumnIds,
} from './CalculatorForm.constants';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import type { BusRow } from '../Results/ResultsSection.types';

export interface ConsumptionValidationKmUnitAcProps {
  dieselKmGallon: string;
  gasKmM3: string;
  electricityKmKwh: string;
}

export interface ValidationMaintenancePerKilometerProps {
  dieselCOPKm: string;
  gasCOPKm: string;
  electricityCOPKm: string;
}

export interface TechnologyTypeProps {
  [TechnologyType.diesel]: string;
  [TechnologyType.gnv]: string;
  [TechnologyType.electric]: string;
}

export interface AcquisitionCostsType {
  busetonCost: TechnologyTypeProps;
  infrastructure: TechnologyTypeProps;
  battery: TechnologyTypeProps;
}

export interface CalculatorFormData extends Record<string, unknown> {
  typology: string;
  busesNumber: string;
  chargersPerBus: string;
  trm: string;
  incentiveType: string;
  eligibility: string;
  incentivePercentage: string;
  incentiveAmountCOP: string;
  acquisitionCosts: AcquisitionCostsType;
  interestEA: string;
  specialEligibility: string;
  specialRateEA: string;
  annualKilometers: string;
  ac: string;
  consumptionUnitKm: {
    consumptionValidationKmUnitAc: ConsumptionValidationKmUnitAcProps;
  };
  technology: {
    validationMaintenancePerKilometer: ValidationMaintenancePerKilometerProps;
  };
  fuel: {
    price: {
      dieselCOPGallon: string;
      gasCOPM3: string;
      electricityCOPKwh: string;
    };
    increaseRisk: {
      dieselCOPGallon: string;
      gasCOPM3: string;
      electricityCOPKwh: string;
    };
  };
  additionalOperatingExpenses: {
    type: string;
    quantity: string;
  };
}

export interface InsumoTableRow {
  id: string;
  technology: string;
  busetonCost: string;
  infrastructure: string;
  battery: string;
}

export interface ValidacionTableRow {
  id: string;
  technology: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ConsumoTableRow {
  id: string;
  consumption: string;
}

export interface TecnologiaTableRow {
  id: string;
  technology: string;
}

export interface CombustibleTableRow {
  id: string;
  fuel: string;
}

export interface CalculatorProps {
  onResultsChange?: (results: CalculatorFormData) => void;
}

export interface UseCalculatorFormProps {
  onResultsChange?: (results: CalculatorFormData) => void;
  initialValues: CalculatorFormData;
}

export interface TaxesButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export interface BaseFormProps {
  form: UseFormReturn<CalculatorFormData>;
  handleContinue: () => void;
  submitAttempted: boolean;
}

export interface CapexFormProps extends BaseFormProps {
  insertDefaultValues: boolean;
  handleAcquisitionCostsToggle: (value: boolean) => void;
}

export interface FinexFormProps extends BaseFormProps {
  onBack?: () => void;
}
export interface OpexFormProps extends BaseFormProps {
  onBack?: () => void;
  busesData: BusRow[];
}

export interface ReferenceFormProps extends BaseFormProps {
  onBack?: () => void;
}

export interface CalculatorHookReturn {
  currentStep: number;
  formContainerRef: React.RefObject<HTMLDivElement | null>;
  setCurrentStep: (step: number) => void;
  componentToRender: React.ReactNode;
}

export interface FormButtonProps {
  variant: ButtonVariant;
  buttonLabel: string;
  onClick: () => void;
  widthVariant?: ButtonWidthVariant;
}

export interface TableInputProps extends Omit<React.ComponentProps<typeof Input>, 'className'> {
  variant?: TableInputVariant;
}

export interface FormInputProps extends Omit<React.ComponentProps<typeof Input>, 'className'> {
  variant?: FormInputVariant;
}

export interface CalculatorContainerProps {
  children: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
}

export interface InputFormLabelProps {
  children: React.ReactNode;
  disableTooltip?: boolean;
  tooltipText?: string | React.ReactNode;
}

export interface ConsumoColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  consumptionUnitKm: {
    consumptionValidationKmUnitAc: ConsumptionValidationKmUnitAcProps;
  };
  handleConsumoInputChange: (
    column: 'consumptionValidationKmUnitAc',
    row: 'dieselKmGallon' | 'gasKmM3' | 'electricityKmKwh',
    value: string
  ) => void;
  submitAttempted?: boolean;
  fuelCostToggle: boolean;
  defaultValues: {
    dieselKmGallon: string;
    gasKmM3: string;
    electricityKmKwh: string;
  };
}

export interface TecnologiaColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  technology: {
    validationMaintenancePerKilometer: ValidationMaintenancePerKilometerProps;
  };
  handleTecnologiaInputChange: (
    column: 'validationMaintenancePerKilometer',
    row: 'dieselCOPKm' | 'gasCOPKm' | 'electricityCOPKm',
    value: string
  ) => void;
  submitAttempted?: boolean;
  maintenanceToggle: boolean;
  defaultValues: ValidationMaintenancePerKilometerProps;
}

export interface CombustibleColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  fuel: {
    price: {
      dieselCOPGallon: string;
      gasCOPM3: string;
      electricityCOPKwh: string;
    };
    increaseRisk: {
      dieselCOPGallon: string;
      gasCOPM3: string;
      electricityCOPKwh: string;
    };
  };
  handleCombustibleInputChange: (
    column: 'price' | 'increaseRisk',
    row: 'dieselCOPGallon' | 'gasCOPM3' | 'electricityCOPKwh',
    value: string
  ) => void;
  submitAttempted?: boolean;
}

export interface InsumoColumnsProps {
  insumoValues: Record<string, { busetonCost: string; infrastructure: string; battery: string }>;
  handleInsumoInputChange: (rowId: string, field: AcquisitionCostsColumnIds, value: string) => void;
}

export interface ValidacionColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  acquisitionCosts: AcquisitionCostsType;
  handleValidacionInputChange: (column: AcquisitionCostsColumnIds, row: TechnologyType, value: string) => void;
  currencyPrefix: string;
  submitAttempted?: boolean;
}
