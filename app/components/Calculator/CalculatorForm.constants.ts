import type { CalculatorFormData, AcquisitionCostsType } from './CalculatorForm.types';

export const DEFAULT_EMPTY_ACQUISITION_COSTS: AcquisitionCostsType = {
  busetonCost: {
    diesel: '',
    gnv: '',
    electric: '',
  },
  infrastructure: {
    diesel: '',
    gnv: '',
    electric: '',
  },
  battery: {
    diesel: '',
    gnv: '',
    electric: '',
  },
} as const;

export const DEFAULT_ACQUISITION_COSTS: AcquisitionCostsType = {
  busetonCost: {
    diesel: '',
    gnv: '',
    electric: '239000',
  },
  infrastructure: {
    diesel: '12000',
    gnv: '7000',
    electric: '27500',
  },
  battery: {
    diesel: '',
    gnv: '',
    electric: '32500',
  },
} as const;

export const DEFAULT_VALUES: CalculatorFormData = {
  typology: 'buseton',
  busesNumber: '1',
  chargersPerBus: '0.1',
  trm: '4200',
  incentiveType: 'none',
  eligibility: 'gnv-electric',
  incentivePercentage: '90',
  incentiveAmountCOP: '15000',
  acquisitionCosts: DEFAULT_EMPTY_ACQUISITION_COSTS,
  interestEA: '12',
  specialEligibility: 'electric',
  specialRateEA: '10',
  annualKilometers: '65000',
  ac: 'yes',
  consumptionUnitKm: {
    consumptionValidationKmUnitAc: {
      dieselKmGallon: '9.10',
      gasKmM3: '1.82',
      electricityKmKwh: '0.91',
    },
  },
  technology: {
    validationMaintenancePerKilometer: {
      dieselCOPKm: '750',
      gasCOPKm: '610',
      electricityCOPKm: '330',
    },
  },
  fuel: {
    price: {
      dieselCOPGallon: '12300',
      gasCOPM3: '2200',
      electricityCOPKwh: '897',
    },
    increaseRisk: {
      dieselCOPGallon: 'short-term',
      gasCOPM3: 'medium-term',
      electricityCOPKwh: 'long-term',
    },
  },
  additionalOperatingExpenses: {
    type: 'annual-cost-per-bus',
    quantity: '90',
  },
} as const;

export enum TechnologyType {
  diesel = 'diesel',
  gnv = 'gnv',
  electric = 'electric',
}

export const TECHNOLOGY_LABELS = {
  [TechnologyType.diesel]: 'Diésel',
  [TechnologyType.gnv]: 'GNV',
  [TechnologyType.electric]: 'Eléctrico',
} as const;

export const TECHNOLOGY_VALUES = {
  [TechnologyType.diesel]: 'Diesel',
  [TechnologyType.gnv]: 'GNV',
  [TechnologyType.electric]: 'Electrico',
} as const;

export enum Typology {
  buseton = 'buseton',
  padron = 'padron',
}

export const TYPLOGY_LABELS = {
  [Typology.buseton]: 'Busetón',
  [Typology.padron]: 'Padrón',
} as const;

export const TYPOLOGY_VALUES = {
  [Typology.buseton]: 'Buseton',
  [Typology.padron]: 'Padron',
} as const;

export enum RiskIncrease {
  shortTerm = 'short-term',
  mediumTerm = 'medium-term',
  longTerm = 'long-term',
  none = 'none',
}

export const RISK_INCREASE_LABELS = {
  [RiskIncrease.shortTerm]: 'Corto Plazo',
  [RiskIncrease.mediumTerm]: 'Mediano Plazo',
  [RiskIncrease.longTerm]: 'Largo Plazo',
  [RiskIncrease.none]: 'N/A',
} as const;

export enum IncentiveType {
  percentage = 'percentage',
  amountOfMoney = 'amount-of-money',
  none = 'none',
}

export const INCENTIVE_TYPE_LABELS = {
  [IncentiveType.percentage]: 'Porcentaje',
  [IncentiveType.amountOfMoney]: 'Cantidad de Dinero',
  [IncentiveType.none]: 'Ninguno',
} as const;

export enum IncentiveEligibility {
  electric = 'electric',
  gnvAndElectric = 'gnv-electric',
}

export const INCENTIVE_ELIGIBILITY_LABELS = {
  [IncentiveEligibility.electric]: 'Eléctrico',
  [IncentiveEligibility.gnvAndElectric]: 'GNV y Eléctrico',
} as const;

export enum SpecialEligibility {
  electric = 'electric',
  gnvAndElectric = 'gnv-electric',
  none = 'none',
}

export const SPECIAL_ELIGIBILITY_LABELS = {
  [SpecialEligibility.electric]: 'Eléctrico',
  [SpecialEligibility.gnvAndElectric]: 'GNV y Eléctrico',
  [SpecialEligibility.none]: 'Ninguna',
} as const;

export enum InputType {
  adjustable = 'adjustable',
  default = 'default',
  adjustableWithoutAC = 'adjustable-without-ac',
}

export const INPUT_TYPE_LABELS = {
  [InputType.adjustable]: 'Ajustable',
  [InputType.default]: 'Predeterminado',
  [InputType.adjustableWithoutAC]: 'Ajustable sin A/C',
} as const;

export enum ACValue {
  yes = 'yes',
  no = 'no',
}

export const AC_VALUE_LABELS = {
  [ACValue.yes]: 'Si',
  [ACValue.no]: 'No',
} as const;

export enum AdditionalOperatingExpensesType {
  none = 'none',
  percentage = 'percentage',
  annualCostPerBus = 'annual-cost-per-bus',
}

export const ADDITIONAL_OPERATING_EXPENSES_TYPE_LABELS = {
  [AdditionalOperatingExpensesType.none]: 'Ninguno',
  [AdditionalOperatingExpensesType.percentage]: 'Porcentaje',
  [AdditionalOperatingExpensesType.annualCostPerBus]: 'Costo anual por bus',
} as const;

export enum Currency {
  colombianPesos = 'colombian-pesos',
  dolars = 'dolars',
}

export const CURRENCY_LABELS = {
  [Currency.colombianPesos]: 'Pesos Colombianos',
  [Currency.dolars]: 'Dólares',
} as const;

export const TABLE_COLUMNS_LABELS = {
  technology: 'Tecnologia',
  busetonCost: 'Costo Buseton',
  infrastructure: 'Infraestructura',
  battery: 'Bateria',
} as const;

export const SCROLL_ANIMATION_DURATION_MS = 600;
export const SCROLL_OFFSET_PX = 20;
export const SCROLL_PROGRESS_COMPLETE = 1;
export const SCROLL_EASING_MULTIPLIER = 2;

export const STEP = {
  CAPEX_FORM: 1,
  FINEX_FORM: 2,
  OPEX_FORM: 3,
  REFERENCE_FORM: 4,
  INCREMENT: 1,
  INITIAL: 1,
  MAX: 4,
} as const;

export const BASE_REQUIRED_FIELDS = {
  [STEP.CAPEX_FORM]: [
    'typology',
    'busesNumber',
    'chargersPerBus',
    'trm',
    'incentiveType',
    'acquisitionCosts.busetonCost.diesel',
    'acquisitionCosts.busetonCost.gnv',
    'acquisitionCosts.busetonCost.electric',
    'acquisitionCosts.infrastructure.gnv',
    'acquisitionCosts.infrastructure.electric',
    'acquisitionCosts.battery.electric',
  ],
  [STEP.FINEX_FORM]: ['interestEA', 'specialEligibility'],
  [STEP.OPEX_FORM]: [
    'annualKilometers',
    'ac',
    'consumptionUnitKm.consumptionValidationKmUnitAc.dieselKmGallon',
    'consumptionUnitKm.consumptionValidationKmUnitAc.gasKmM3',
    'consumptionUnitKm.consumptionValidationKmUnitAc.electricityKmKwh',
    'technology.validationMaintenancePerKilometer.dieselCOPKm',
    'technology.validationMaintenancePerKilometer.gasCOPKm',
    'technology.validationMaintenancePerKilometer.electricityCOPKm',
    'fuel.price.dieselCOPGallon',
    'fuel.price.gasCOPM3',
    'fuel.price.electricityCOPKwh',
    'fuel.increaseRisk.dieselCOPGallon',
    'fuel.increaseRisk.gasCOPM3',
    'fuel.increaseRisk.electricityCOPKwh',
  ],
  [STEP.REFERENCE_FORM]: ['additionalOperatingExpenses.type'],
};

export const TECHNOLOGY_IDS = [TechnologyType.diesel, TechnologyType.gnv, TechnologyType.electric] as const;

export enum FieldTablesId {
  consumption = 'consumption',
  technology = 'technology',
  fuel = 'fuel',
  validation = 'validation',
}

export const ROWS = {
  LABELS: {
    [FieldTablesId.consumption]: {
      [TechnologyType.diesel]: 'Diésel (KM/Galón)',
      [TechnologyType.gnv]: 'Gas (KM/m3)',
      [TechnologyType.electric]: 'Electricidad (KM/kWh)',
    },
    [FieldTablesId.technology]: {
      [TechnologyType.diesel]: 'Diésel (COP/KM)',
      [TechnologyType.gnv]: 'Gas (COP/KM)',
      [TechnologyType.electric]: 'Eléctrico (COP/KM)',
    },
    [FieldTablesId.fuel]: {
      [TechnologyType.diesel]: 'Diésel (COP/Galón)',
      [TechnologyType.gnv]: 'Gas (COP/m3)',
      [TechnologyType.electric]: 'Electricidad (COP/kWh)',
    },
    [FieldTablesId.validation]: {
      [TechnologyType.diesel]: 'Diésel',
      [TechnologyType.gnv]: 'Gas',
      [TechnologyType.electric]: 'Eléctrico',
    },
  },
};

export enum AcquisitionCostsColumnIds {
  busetonCost = 'busetonCost',
  infrastructure = 'infrastructure',
  battery = 'battery',
}

export enum FuelCostsColumnIds {
  price = 'price',
  increaseRisk = 'increaseRisk',
}
