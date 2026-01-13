import { currencyFormatChanger } from '@/lib/utils';
import {
  ACValue,
  IncentiveType,
  IncentiveEligibility,
  RiskIncrease,
  SpecialEligibility,
  TECHNOLOGY_VALUES,
  TechnologyType,
} from '../Calculator/CalculatorForm.constants';
import type { CalculatorFormData } from '../Calculator/CalculatorForm.types';
import { extractNumericValue } from '@/lib/utils/formatters';
import {
  AC_PERCENTAGE,
  DIESEL_MULTIPLIER,
  INCENTIVE_DIESEL,
  YEARS,
  InputTypes,
  IPC,
  INICIAL_MULTIPLIER,
  PRICING_INCREMENT_RISK,
  PERCENTAGE_DIVISOR,
  DECIMAL_PLACES,
  RISK_INCREMENT_YEARS,
  YEAR_NUMBERS,
} from './ResultsSection.constants';
import type {
  BusRow,
  YearMultiplier,
  YearMultiplierWithPrice,
  YearMultiplierWithMaintenanceCost,
  YearMultiplierWithConsumptionCost,
  OpexTotalResult,
  GnvOpexTotalResult,
  ElectricOpexTotalResult,
  ChartTechnologyDataPoint,
  DieselOpexDataResult,
  GnvOpexDataResult,
  ElectricOpexDataResult,
  CalculateDieselFinexResultParams,
  CalculateFinexResultParams,
  AddPriceScenarioToMultipliersParams,
  GetAdditionalCostParams,
  CalculateDieselMaintenanceCostParams,
  CalculateGnvMaintenanceCostParams,
  CalculateElectricMaintenanceCostParams,
  CalculateDieselConsumptionCostParams,
  CalculateGnvConsumptionCostParams,
  CalculateElectricConsumptionCostParams,
  GetFinalInvestDieselParams,
  GetFinalInvestGnvParams,
  GetFinalInvestElectricParams,
  GetBusDataByTechnologyParams,
  GetCostPerKmResultParams,
  CalculateCostPerKmByYearParams,
  CombineChartDataParams,
  GetIncentiveAmountParams,
} from './ResultsSection.types';

export function createFormatValueLabel(currencyPrefix: string) {
  return (value: number) => currencyFormatChanger(value, currencyPrefix);
}

export const addIncrementRiskYear = (dieselCOPGallon: string): number => {
  switch (dieselCOPGallon) {
    case RiskIncrease.shortTerm:
      return RISK_INCREMENT_YEARS.SHORT_TERM;
    case RiskIncrease.mediumTerm:
      return RISK_INCREMENT_YEARS.MEDIUM_TERM;
    case RiskIncrease.longTerm:
      return RISK_INCREMENT_YEARS.LONG_TERM;
    case RiskIncrease.none:
    default:
      return RISK_INCREMENT_YEARS.NONE;
  }
};

export const generateYearMultipliers = (increaseRiskDieselCOPGallon: string): YearMultiplier[] => {
  const incrementRiskYear = addIncrementRiskYear(increaseRiskDieselCOPGallon);
  const multipliers: YearMultiplier[] = [];
  let currentMultiplier = INICIAL_MULTIPLIER;

  for (let year = YEAR_NUMBERS.FIRST; year <= YEARS; year++) {
    if (year === YEAR_NUMBERS.FIRST) {
      currentMultiplier = INICIAL_MULTIPLIER;
    } else if (year === YEAR_NUMBERS.SECOND) {
      currentMultiplier = currentMultiplier + IPC.SECOND_YEAR;
    } else if (year === YEAR_NUMBERS.THIRD) {
      currentMultiplier = currentMultiplier + IPC.THIRD_YEAR;
    } else {
      currentMultiplier = currentMultiplier + IPC.ALL_YEARS;
    }

    if (year === incrementRiskYear && incrementRiskYear > RISK_INCREMENT_YEARS.NONE) {
      currentMultiplier = currentMultiplier + PRICING_INCREMENT_RISK;
    }

    multipliers.push({
      year,
      multiplier: +currentMultiplier.toFixed(DECIMAL_PLACES),
    });
  }

  return multipliers;
};

export const calculateDieselFinexResult = ({
  finalInvestDiesel,
  interestRate,
}: CalculateDieselFinexResultParams): number => {
  const capital = finalInvestDiesel / YEARS;
  let currentInvest = finalInvestDiesel;
  let finexTotal = 0;

  for (let year = YEAR_NUMBERS.FIRST; year <= YEARS; year++) {
    const invest = currentInvest - capital;
    const interest = invest * interestRate;

    finexTotal += interest;
    currentInvest = invest;
  }

  return finexTotal;
};

export const calculateFinexResult = ({ results, finalInvest, technologyType }: CalculateFinexResultParams): number => {
  const capital = finalInvest / YEARS;
  let currentInvest = finalInvest;
  let finexTotal = 0;

  const { specialEligibility, specialRateEA, interestEA } = results;

  let interestRate: number;
  const shouldUseSpecialRate =
    (technologyType === TechnologyType.electric &&
      (specialEligibility === SpecialEligibility.electric ||
        specialEligibility === SpecialEligibility.gnvAndElectric)) ||
    (technologyType === TechnologyType.gnv && specialEligibility === SpecialEligibility.gnvAndElectric);

  if (shouldUseSpecialRate) {
    interestRate = +specialRateEA / PERCENTAGE_DIVISOR;
  } else {
    interestRate = +interestEA / PERCENTAGE_DIVISOR;
  }

  for (let year = YEAR_NUMBERS.FIRST; year <= YEARS; year++) {
    const invest = currentInvest - capital;
    const interest = invest * interestRate;

    finexTotal += interest;
    currentInvest = invest;
  }

  return finexTotal;
};

export const addPriceScenarioToMultipliers = ({
  yearMultipliers,
  initialPrice,
}: AddPriceScenarioToMultipliersParams): YearMultiplierWithPrice[] => {
  return yearMultipliers.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: +(initialPrice * item.multiplier).toFixed(DECIMAL_PLACES),
  }));
};

export const getAdditionalCost = ({
  additionalOperatingExpenses,
  opex,
  additionalYearMultipliers,
}: GetAdditionalCostParams): number => {
  const { type, quantity } = additionalOperatingExpenses;

  switch (type) {
    case 'annual-cost-per-bus': {
      const total = additionalYearMultipliers.reduce((sum, item) => {
        const priceScenario = +quantity * item.multiplier;
        return sum + priceScenario;
      }, 0);
      return Math.round(total);
    }
    case 'percentage': {
      const percentage = +quantity / PERCENTAGE_DIVISOR;
      return Math.round(opex * percentage);
    }
    case 'none':
    default:
      return 0;
  }
};

export const calculateDieselMaintenanceCost = ({
  results,
  dieselYearMultipliersWithPrice,
}: CalculateDieselMaintenanceCostParams): YearMultiplierWithMaintenanceCost[] => {
  const { technology, annualKilometers, busesNumber } = results;
  const { validationMaintenancePerKilometer } = technology;
  const dieselCOPKm = +validationMaintenancePerKilometer.dieselCOPKm;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return dieselYearMultipliersWithPrice.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: item.priceScenario,
    maintenanceCost: +(dieselCOPKm * item.multiplier * annualKm * buses).toFixed(DECIMAL_PLACES),
  }));
};

export const calculateGnvMaintenanceCost = ({
  results,
  gnvYearMultipliersWithPrice,
}: CalculateGnvMaintenanceCostParams): YearMultiplierWithMaintenanceCost[] => {
  const { technology, annualKilometers, busesNumber } = results;
  const { validationMaintenancePerKilometer } = technology;
  const gasCOPKm = +validationMaintenancePerKilometer.gasCOPKm;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return gnvYearMultipliersWithPrice.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: item.priceScenario,
    maintenanceCost: +(gasCOPKm * item.multiplier * annualKm * buses).toFixed(DECIMAL_PLACES),
  }));
};

export const calculateElectricMaintenanceCost = ({
  results,
  electricYearMultipliersWithPrice,
}: CalculateElectricMaintenanceCostParams): YearMultiplierWithMaintenanceCost[] => {
  const { technology, annualKilometers, busesNumber } = results;
  const { validationMaintenancePerKilometer } = technology;
  const electricityCOPKm = +validationMaintenancePerKilometer.electricityCOPKm;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return electricYearMultipliersWithPrice.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: item.priceScenario,
    maintenanceCost: +(electricityCOPKm * item.multiplier * annualKm * buses).toFixed(DECIMAL_PLACES),
  }));
};

export const calculateDieselConsumptionCost = ({
  results,
  dieselMaintenanceCosts,
  finalDieselTechnologyConsumption,
}: CalculateDieselConsumptionCostParams): YearMultiplierWithConsumptionCost[] => {
  const { annualKilometers, busesNumber } = results;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return dieselMaintenanceCosts.map((item) => {
    const consumptionCost =
      finalDieselTechnologyConsumption > 0
        ? (item.priceScenario / finalDieselTechnologyConsumption) * annualKm * buses
        : 0;

    return {
      year: item.year,
      multiplier: item.multiplier,
      priceScenario: item.priceScenario,
      maintenanceCost: item.maintenanceCost,
      consumptionCost: +consumptionCost.toFixed(DECIMAL_PLACES),
    };
  });
};

export const calculateDieselOpexTotal = (
  dieselConsumptionCosts: YearMultiplierWithConsumptionCost[]
): OpexTotalResult => {
  const totalDieselMaintenance = dieselConsumptionCosts.reduce((accumulator, item) => {
    return accumulator + item.maintenanceCost;
  }, 0);

  const totalDieselConsumption = dieselConsumptionCosts.reduce((accumulator, item) => {
    return accumulator + item.consumptionCost;
  }, 0);

  const dieselOpex = +(totalDieselMaintenance + totalDieselConsumption).toFixed(DECIMAL_PLACES);

  return {
    totalDieselMaintenance,
    totalDieselConsumption,
    dieselOpex,
  };
};

export const getDieselOpexData = (results: CalculatorFormData): DieselOpexDataResult => {
  const { fuel, ac } = results;
  const { increaseRisk, price } = fuel;
  const percentageByAC = ac === ACValue.yes ? AC_PERCENTAGE.YES : AC_PERCENTAGE.NO;

  const dieselYearMultipliers = generateYearMultipliers(increaseRisk.dieselCOPGallon);
  const dieselYearMultipliersWithPrice = addPriceScenarioToMultipliers({
    yearMultipliers: dieselYearMultipliers,
    initialPrice: +price.dieselCOPGallon,
  });
  const dieselMaintenanceCosts = calculateDieselMaintenanceCost({
    results,
    dieselYearMultipliersWithPrice,
  });
  const dieselTechnologyConsumption = +results.consumptionUnitKm.consumptionValidationKmUnitAc.dieselKmGallon || 0;
  const finalDieselTechnologyConsumption = dieselTechnologyConsumption * percentageByAC;
  const dieselConsumptionCosts = calculateDieselConsumptionCost({
    results,
    dieselMaintenanceCosts,
    finalDieselTechnologyConsumption,
  });
  const { totalDieselMaintenance, totalDieselConsumption, dieselOpex } =
    calculateDieselOpexTotal(dieselConsumptionCosts);

  return {
    dieselConsumptionCosts,
    totalDieselMaintenance,
    totalDieselConsumption,
    dieselOpex,
  };
};

export const calculateGnvConsumptionCost = ({
  results,
  gnvMaintenanceCosts,
  finalGnvTechnologyConsumption,
}: CalculateGnvConsumptionCostParams): YearMultiplierWithConsumptionCost[] => {
  const { annualKilometers, busesNumber } = results;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return gnvMaintenanceCosts.map((item) => {
    const consumptionCost =
      finalGnvTechnologyConsumption > 0 ? (item.priceScenario / finalGnvTechnologyConsumption) * annualKm * buses : 0;

    return {
      year: item.year,
      multiplier: item.multiplier,
      priceScenario: item.priceScenario,
      maintenanceCost: item.maintenanceCost,
      consumptionCost: +consumptionCost.toFixed(DECIMAL_PLACES),
    };
  });
};

export const calculateGnvOpexTotal = (gnvConsumptionCosts: YearMultiplierWithConsumptionCost[]): GnvOpexTotalResult => {
  const totalGnvMaintenance = gnvConsumptionCosts.reduce((accumulator, item) => {
    return accumulator + item.maintenanceCost;
  }, 0);

  const totalGnvConsumption = gnvConsumptionCosts.reduce((accumulator, item) => {
    return accumulator + item.consumptionCost;
  }, 0);

  const gnvOpex = +(totalGnvMaintenance + totalGnvConsumption).toFixed(DECIMAL_PLACES);

  return {
    totalGnvMaintenance,
    totalGnvConsumption,
    gnvOpex,
  };
};

export const getGnvOpexData = (results: CalculatorFormData): GnvOpexDataResult => {
  const { fuel, ac } = results;
  const { increaseRisk, price } = fuel;
  const percentageByAC = ac === ACValue.yes ? AC_PERCENTAGE.YES : AC_PERCENTAGE.NO;

  const gnvYearMultipliers = generateYearMultipliers(increaseRisk.gasCOPM3);
  const gnvYearMultipliersWithPrice = addPriceScenarioToMultipliers({
    yearMultipliers: gnvYearMultipliers,
    initialPrice: +price.gasCOPM3,
  });
  const gnvMaintenanceCosts = calculateGnvMaintenanceCost({ results, gnvYearMultipliersWithPrice });
  const gnvTechnologyConsumption = +results.consumptionUnitKm.consumptionValidationKmUnitAc.gasKmM3 || 0;
  const finalGnvTechnologyConsumption = gnvTechnologyConsumption * percentageByAC;
  const gnvConsumptionCosts = calculateGnvConsumptionCost({
    results,
    gnvMaintenanceCosts,
    finalGnvTechnologyConsumption,
  });
  const { totalGnvMaintenance, totalGnvConsumption, gnvOpex } = calculateGnvOpexTotal(gnvConsumptionCosts);

  return {
    gnvConsumptionCosts,
    totalGnvMaintenance,
    totalGnvConsumption,
    gnvOpex,
  };
};

export const calculateElectricConsumptionCost = ({
  results,
  electricMaintenanceCosts,
  finalElectricTechnologyConsumption,
}: CalculateElectricConsumptionCostParams): YearMultiplierWithConsumptionCost[] => {
  const { annualKilometers, busesNumber } = results;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return electricMaintenanceCosts.map((item) => {
    const consumptionCost =
      finalElectricTechnologyConsumption > 0
        ? (item.priceScenario / finalElectricTechnologyConsumption) * annualKm * buses
        : 0;

    return {
      year: item.year,
      multiplier: item.multiplier,
      priceScenario: item.priceScenario,
      maintenanceCost: item.maintenanceCost,
      consumptionCost: +consumptionCost.toFixed(DECIMAL_PLACES),
    };
  });
};

export const calculateElectricOpexTotal = (
  electricConsumptionCosts: YearMultiplierWithConsumptionCost[]
): ElectricOpexTotalResult => {
  const totalElectricMaintenance = electricConsumptionCosts.reduce((accumulator, item) => {
    return accumulator + item.maintenanceCost;
  }, 0);

  const totalElectricConsumption = electricConsumptionCosts.reduce((accumulator, item) => {
    return accumulator + item.consumptionCost;
  }, 0);

  const electricOpex = +(totalElectricMaintenance + totalElectricConsumption).toFixed(DECIMAL_PLACES);

  return {
    totalElectricMaintenance,
    totalElectricConsumption,
    electricOpex,
  };
};

export const getElectricOpexData = (results: CalculatorFormData): ElectricOpexDataResult => {
  const { fuel, ac } = results;
  const { increaseRisk, price } = fuel;
  const percentageByAC = ac === ACValue.yes ? AC_PERCENTAGE.YES : AC_PERCENTAGE.NO;

  const electricYearMultipliers = generateYearMultipliers(increaseRisk.electricityCOPKwh);
  const electricYearMultipliersWithPrice = addPriceScenarioToMultipliers({
    yearMultipliers: electricYearMultipliers,
    initialPrice: +price.electricityCOPKwh,
  });
  const electricMaintenanceCosts = calculateElectricMaintenanceCost({
    results,
    electricYearMultipliersWithPrice,
  });
  const electricTechnologyConsumption = +results.consumptionUnitKm.consumptionValidationKmUnitAc.electricityKmKwh || 0;
  const finalElectricTechnologyConsumption = electricTechnologyConsumption * percentageByAC;
  const electricConsumptionCosts = calculateElectricConsumptionCost({
    results,
    electricMaintenanceCosts,
    finalElectricTechnologyConsumption,
  });
  const { totalElectricMaintenance, totalElectricConsumption, electricOpex } =
    calculateElectricOpexTotal(electricConsumptionCosts);

  return {
    electricConsumptionCosts,
    totalElectricMaintenance,
    totalElectricConsumption,
    electricOpex,
  };
};

export const getFinalInvestDiesel = ({ busesData, results, inputType }: GetFinalInvestDieselParams): number => {
  const { trm, acquisitionCosts, busesNumber } = results;
  const { busetonCost } = acquisitionCosts;
  const dieselBusData = getBusDataByTechnology({ busesData, technology: TechnologyType.diesel });
  const dieselBusCost = dieselBusData ? +extractNumericValue(dieselBusData.busCostUSD) : 0;
  const dieselSelectedBusCost = inputType === InputTypes.dataBase ? dieselBusCost : +busetonCost.diesel;
  const busCost = dieselSelectedBusCost * +trm;
  const capexResultDiesel = busCost * DIESEL_MULTIPLIER;
  const finalInvestDiesel = (capexResultDiesel - INCENTIVE_DIESEL) * +busesNumber;
  return finalInvestDiesel;
};

export const getFinalInvestGnv = ({ busesData, results, inputType }: GetFinalInvestGnvParams): number => {
  const { trm, acquisitionCosts, busesNumber, eligibility, incentivePercentage, incentiveType, incentiveAmountCOP } =
    results;
  const { busetonCost, infrastructure } = acquisitionCosts;
  const gnvBusData = getBusDataByTechnology({ busesData, technology: TechnologyType.gnv });
  const gnvBusCost = gnvBusData ? +extractNumericValue(gnvBusData.busCostUSD) : 0;
  const gnvSelectedBusCost = inputType === InputTypes.dataBase ? gnvBusCost : +busetonCost.gnv;
  const busCostGnv = gnvSelectedBusCost * +trm;
  const gnvInfrastructureCost = gnvBusData ? +extractNumericValue(gnvBusData.infrastructureUSD) : 0;
  const gnvSelectedInfrastructureCost = inputType === InputTypes.dataBase ? gnvInfrastructureCost : +infrastructure.gnv;
  const infrastructureCostGnv = gnvSelectedInfrastructureCost * +trm;
  const capexResultGnv = busCostGnv + infrastructureCostGnv;
  const eligibilityGnv = eligibility === IncentiveEligibility.electric ? 0 : 1;
  const gnvCapexPercentage = (+incentivePercentage / PERCENTAGE_DIVISOR) * capexResultGnv;
  const gnvCurrentIncentive = getIncentiveAmount({
    incentiveType,
    capexPercentage: gnvCapexPercentage,
    incentiveAmountCOP,
  });
  const gnvIncentive = eligibilityGnv * gnvCurrentIncentive;
  const finalInvestGnv = (capexResultGnv - gnvIncentive) * +busesNumber;
  return finalInvestGnv;
};

export const getFinalInvestElectric = ({ busesData, results, inputType }: GetFinalInvestElectricParams): number => {
  const { trm, acquisitionCosts, busesNumber, chargersPerBus, incentivePercentage, incentiveType, incentiveAmountCOP } =
    results;
  const { busetonCost, infrastructure, battery } = acquisitionCosts;
  const electricBusData = getBusDataByTechnology({ busesData, technology: TechnologyType.electric });
  const electricBusCost = electricBusData ? +extractNumericValue(electricBusData.busCostUSD) : 0;
  const electricSelectedBusCost = inputType === InputTypes.dataBase ? electricBusCost : +busetonCost.electric;
  const busCostElectric = electricSelectedBusCost * +trm;
  const electricInfrastructureCost = electricBusData ? +extractNumericValue(electricBusData.infrastructureUSD) : 0;
  const electricSelectedInfrastructureCost =
    inputType === InputTypes.dataBase ? electricInfrastructureCost : +infrastructure.electric;
  const infrastructureCostElectric = electricSelectedInfrastructureCost * +trm * +chargersPerBus;
  const electricBatteryCost = electricBusData ? +extractNumericValue(electricBusData.batteryUSD) : 0;
  const electricSelectedBatteryCost = inputType === InputTypes.dataBase ? electricBatteryCost : +battery.electric;
  const batteryCostElectric = electricSelectedBatteryCost * +trm;
  const capexResultElectric = busCostElectric + infrastructureCostElectric + batteryCostElectric;
  const electricCapexPercentage = (+incentivePercentage / PERCENTAGE_DIVISOR) * capexResultElectric;
  const electricCurrentIncentive = getIncentiveAmount({
    incentiveType,
    capexPercentage: electricCapexPercentage,
    incentiveAmountCOP,
  });
  const finalInvestElectric = (capexResultElectric - electricCurrentIncentive) * +busesNumber;
  return finalInvestElectric;
};

export function getBusDataByTechnology({ busesData, technology }: GetBusDataByTechnologyParams): BusRow | null {
  const technologyValue = TECHNOLOGY_VALUES[technology];
  const bus = busesData.find((bus) => bus.technology === technologyValue);
  if (!bus) {
    return null;
  }
  return bus;
}

export const getCostPerKmResult = ({ invest, annualKilometers, busesNumber }: GetCostPerKmResultParams): number => {
  return invest / (YEARS * +annualKilometers * +busesNumber);
};

export const calculateCostPerKmByYear = ({
  consumptionCosts,
  annualKilometers,
  technologyType,
}: CalculateCostPerKmByYearParams): ChartTechnologyDataPoint[] => {
  const annualKm = +annualKilometers;

  return consumptionCosts.map((item) => {
    const costPerKm = (item.maintenanceCost + item.consumptionCost) / annualKm;
    const result: ChartTechnologyDataPoint = {};
    result[technologyType] = +costPerKm.toFixed(DECIMAL_PLACES);
    return result;
  });
};

export const combineChartData = ({
  years,
  dieselData,
  gnvData,
  electricData,
}: CombineChartDataParams): Array<{ year: number; diesel: number; gnv: number; electric: number }> => {
  return years.map((year, index) => ({
    year,
    diesel: dieselData[index]?.diesel ?? 0,
    gnv: gnvData[index]?.gnv ?? 0,
    electric: electricData[index]?.electric ?? 0,
  }));
};

export const getIncentiveAmount = ({
  incentiveType,
  capexPercentage,
  incentiveAmountCOP,
}: GetIncentiveAmountParams): number => {
  switch (incentiveType) {
    case IncentiveType.percentage:
      return capexPercentage;
    case IncentiveType.amountOfMoney:
      return +(incentiveAmountCOP ?? 0);
    case IncentiveType.none:
    default:
      return 0;
  }
};
