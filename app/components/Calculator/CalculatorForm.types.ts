import { TechnologyType } from './CalculatorForm.constants';

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
