export const DIESEL_MULTIPLIER = 1.19;
export const INCENTIVE_DIESEL = 0;

export const AC_PERCENTAGE = {
  YES: 0.8,
  NO: 1,
};

export const YEARS = 15;

export enum ResultsColumnIds {
  cost = 'cost',
  consumption = 'consumption',
  maintenance = 'maintenance',
  savings = 'savings',
  category = 'category',
}

export enum FormTypes {
  capex = 'capex',
  opex = 'opex',
  finex = 'finex',
}

export enum ResultsCategoryIds {
  total = 'total',
  additionalExpenses = 'additional-expenses',
  totalOverhead = 'total-overhead',
  tco = 'tco',
  operationalSavings = 'operational-savings',
  tcoPerKm = 'tco-per-km',
  savingsPerKm = 'savings-per-km',
}

export enum InputTypes {
  form = 'form',
  dataBase = 'data-base',
}

export const HARDCODED_INPUT_TYPE: InputTypes = InputTypes.form;
