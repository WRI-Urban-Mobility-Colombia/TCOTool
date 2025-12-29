import { BusRow } from '@/lib/utils/csvReader';
import {
  IncentiveType,
  RiskIncrease,
  SpecialEligibility,
  TECHNOLOGY_VALUES,
  TechnologyType,
} from '../Calculator/CalculatorForm.constants';
import type { CalculatorFormData } from '../Calculator/CalculatorForm.types';
import { extractNumericValue } from '@/lib/utils/formatters';
import { DIESEL_MULTIPLIER, INCENTIVE_DIESEL, YEARS } from './ResultsSection.constants';

export const IPC = {
  SECOND_YEAR: 0.07,
  THIRD_YEAR: 0.05,
  ALL_YEARS: 0.03,
} as const;

export const INICIAL_MULTIPLIER = 1;

export const PRICING_INCREMENT_RISK = 0.25;

export type YearMultiplier = {
  year: number;
  multiplier: number;
};

export type YearMultiplierWithPrice = {
  year: number;
  multiplier: number;
  priceScenario: number;
};

export type YearMultiplierWithMaintenanceCost = {
  year: number;
  multiplier: number;
  priceScenario: number;
  maintenanceCost: number;
};

export type YearMultiplierWithConsumptionCost = {
  year: number;
  multiplier: number;
  priceScenario: number;
  maintenanceCost: number;
  consumptionCost: number;
};

export type YearFinex = {
  year: number;
  invest: number;
  interest: number;
};

export type OpexTotalResult = {
  totalDieselMaintenance: number;
  totalDieselConsumption: number;
  dieselOpex: number;
};

export type GnvOpexTotalResult = {
  totalGnvMaintenance: number;
  totalGnvConsumption: number;
  gnvOpex: number;
};

export type ElectricOpexTotalResult = {
  totalElectricMaintenance: number;
  totalElectricConsumption: number;
  electricOpex: number;
};

export type TechnologyTypeForChart = TechnologyType;

export type ChartTechnologyDataPoint = {
  [key in TechnologyTypeForChart]?: number;
};

export const addIncrementRiskYear = (dieselCOPGallon: string): number => {
  switch (dieselCOPGallon) {
    case RiskIncrease.shortTerm:
      return 3;
    case RiskIncrease.mediumTerm:
      return 7;
    case RiskIncrease.longTerm:
      return 10;
    case RiskIncrease.none:
    default:
      return 0;
  }
};

export const generateYearMultipliers = (increaseRiskDieselCOPGallon: string): YearMultiplier[] => {
  const incrementRiskYear = addIncrementRiskYear(increaseRiskDieselCOPGallon);
  const multipliers: YearMultiplier[] = [];
  let currentMultiplier = INICIAL_MULTIPLIER;

  for (let year = 1; year <= YEARS; year++) {
    if (year === 1) {
      currentMultiplier = INICIAL_MULTIPLIER;
    } else if (year === 2) {
      currentMultiplier = currentMultiplier + IPC.SECOND_YEAR;
    } else if (year === 3) {
      currentMultiplier = currentMultiplier + IPC.THIRD_YEAR;
    } else {
      currentMultiplier = currentMultiplier + IPC.ALL_YEARS;
    }

    if (year === incrementRiskYear && incrementRiskYear > 0) {
      currentMultiplier = currentMultiplier + PRICING_INCREMENT_RISK;
    }

    multipliers.push({
      year,
      multiplier: +currentMultiplier.toFixed(2),
    });
  }

  return multipliers;
};

export const calculateDieselFinexResult = (finalInvestDiesel: number, interestRate: number): number => {
  const capital = finalInvestDiesel / YEARS;
  let currentInvest = finalInvestDiesel;
  let finexTotal = 0;

  for (let year = 1; year <= YEARS; year++) {
    const invest = currentInvest - capital;
    const interest = invest * interestRate;

    finexTotal += interest;
    currentInvest = invest;
  }

  return finexTotal;
};

export const calculateFinexResult = (
  results: CalculatorFormData,
  finalInvest: number,
  technologyType: TechnologyType
): number => {
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
    interestRate = +specialRateEA / 100;
  } else {
    interestRate = +interestEA / 100;
  }

  for (let year = 1; year <= YEARS; year++) {
    const invest = currentInvest - capital;
    const interest = invest * interestRate;

    finexTotal += interest;
    currentInvest = invest;
  }

  return finexTotal;
};

export const addPriceScenarioToMultipliers = (
  yearMultipliers: YearMultiplier[],
  initialPrice: number
): YearMultiplierWithPrice[] => {
  return yearMultipliers.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: +(initialPrice * item.multiplier).toFixed(2),
  }));
};

export const getAdditionalCost = (
  additionalOperatingExpenses: { type: string; quantity: string },
  opex: number,
  additionalYearMultipliers: YearMultiplier[]
): number => {
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
      const percentage = +quantity / 100;
      return Math.round(opex * percentage);
    }
    case 'none':
    default:
      return 0;
  }
};

export const calculateDieselMaintenanceCost = (
  results: CalculatorFormData,
  dieselYearMultipliersWithPrice: YearMultiplierWithPrice[]
): YearMultiplierWithMaintenanceCost[] => {
  const { technology, annualKilometers, busesNumber } = results;
  const { validationMaintenancePerKilometer } = technology;
  const dieselCOPKm = +validationMaintenancePerKilometer.dieselCOPKm;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return dieselYearMultipliersWithPrice.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: item.priceScenario,
    maintenanceCost: +(dieselCOPKm * item.multiplier * annualKm * buses).toFixed(2),
  }));
};

export const calculateGnvMaintenanceCost = (
  results: CalculatorFormData,
  gnvYearMultipliersWithPrice: YearMultiplierWithPrice[]
): YearMultiplierWithMaintenanceCost[] => {
  const { technology, annualKilometers, busesNumber } = results;
  const { validationMaintenancePerKilometer } = technology;
  const gasCOPKm = +validationMaintenancePerKilometer.gasCOPKm;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return gnvYearMultipliersWithPrice.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: item.priceScenario,
    maintenanceCost: +(gasCOPKm * item.multiplier * annualKm * buses).toFixed(2),
  }));
};

export const calculateElectricMaintenanceCost = (
  results: CalculatorFormData,
  electricYearMultipliersWithPrice: YearMultiplierWithPrice[]
): YearMultiplierWithMaintenanceCost[] => {
  const { technology, annualKilometers, busesNumber } = results;
  const { validationMaintenancePerKilometer } = technology;
  const electricityCOPKm = +validationMaintenancePerKilometer.electricityCOPKm;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return electricYearMultipliersWithPrice.map((item) => ({
    year: item.year,
    multiplier: item.multiplier,
    priceScenario: item.priceScenario,
    maintenanceCost: +(electricityCOPKm * item.multiplier * annualKm * buses).toFixed(2),
  }));
};

export const calculateDieselConsumptionCost = (
  results: CalculatorFormData,
  dieselMaintenanceCosts: YearMultiplierWithMaintenanceCost[],
  finalDieselTechnologyConsumption: number
): YearMultiplierWithConsumptionCost[] => {
  const { annualKilometers, busesNumber } = results;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return dieselMaintenanceCosts.map((item) => {
    const consumptionCost =
      finalDieselTechnologyConsumption > 0
        ? +(item.priceScenario / finalDieselTechnologyConsumption) * annualKm * buses
        : 0;

    return {
      year: item.year,
      multiplier: item.multiplier,
      priceScenario: item.priceScenario,
      maintenanceCost: item.maintenanceCost,
      consumptionCost: +consumptionCost.toFixed(2),
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

  const dieselOpex = +(totalDieselMaintenance + totalDieselConsumption).toFixed(2);

  return {
    totalDieselMaintenance,
    totalDieselConsumption,
    dieselOpex,
  };
};

export const calculateGnvConsumptionCost = (
  results: CalculatorFormData,
  gnvMaintenanceCosts: YearMultiplierWithMaintenanceCost[],
  finalGnvTechnologyConsumption: number
): YearMultiplierWithConsumptionCost[] => {
  const { annualKilometers, busesNumber } = results;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return gnvMaintenanceCosts.map((item) => {
    const consumptionCost =
      finalGnvTechnologyConsumption > 0 ? +(item.priceScenario / finalGnvTechnologyConsumption) * annualKm * buses : 0;

    return {
      year: item.year,
      multiplier: item.multiplier,
      priceScenario: item.priceScenario,
      maintenanceCost: item.maintenanceCost,
      consumptionCost: +consumptionCost.toFixed(2),
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

  const gnvOpex = +(totalGnvMaintenance + totalGnvConsumption).toFixed(2);

  return {
    totalGnvMaintenance,
    totalGnvConsumption,
    gnvOpex,
  };
};

export const calculateElectricConsumptionCost = (
  results: CalculatorFormData,
  electricMaintenanceCosts: YearMultiplierWithMaintenanceCost[],
  finalElectricTechnologyConsumption: number
): YearMultiplierWithConsumptionCost[] => {
  const { annualKilometers, busesNumber } = results;
  const annualKm = +annualKilometers;
  const buses = +busesNumber;

  return electricMaintenanceCosts.map((item) => {
    const consumptionCost =
      finalElectricTechnologyConsumption > 0
        ? +(item.priceScenario / finalElectricTechnologyConsumption) * annualKm * buses
        : 0;

    return {
      year: item.year,
      multiplier: item.multiplier,
      priceScenario: item.priceScenario,
      maintenanceCost: item.maintenanceCost,
      consumptionCost: +consumptionCost.toFixed(2),
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

  const electricOpex = +(totalElectricMaintenance + totalElectricConsumption).toFixed(2);

  return {
    totalElectricMaintenance,
    totalElectricConsumption,
    electricOpex,
  };
};

export const getFinalInvestDiesel = (
  dieselBusData: BusRow | null,
  trm: string,
  inputType: string,
  busetonCostDiesel: string,
  busesNumber: string
) => {
  const dieselBusCost = dieselBusData ? +extractNumericValue(dieselBusData.busCostUSD) : 0;
  const dieselSelectedBusCost = inputType === 'data-base' ? dieselBusCost : +busetonCostDiesel;
  const busCost = dieselSelectedBusCost * +trm;
  const capexResultDiesel = busCost * DIESEL_MULTIPLIER;
  const finalInvestDiesel = (capexResultDiesel - INCENTIVE_DIESEL) * +busesNumber;
  return finalInvestDiesel;
};

export function getBusDataByTechnology(busesData: BusRow[], technology: TechnologyType): BusRow | null {
  const technologyValue = TECHNOLOGY_VALUES[technology];
  const bus = busesData.find((bus) => bus.technology === technologyValue);
  if (!bus) {
    return null;
  }
  return bus;
}

export const getCostPerKmResult = (invest: number, annualKilometers: string, busesNumber: string): number => {
  return invest / (YEARS * +annualKilometers * +busesNumber);
};

export const calculateCostPerKmByYear = (
  consumptionCosts: YearMultiplierWithConsumptionCost[],
  annualKilometers: string,
  technologyType: TechnologyTypeForChart
): ChartTechnologyDataPoint[] => {
  const annualKm = +annualKilometers;

  return consumptionCosts.map((item) => {
    const costPerKm = (item.maintenanceCost + item.consumptionCost) / annualKm;
    return {
      [technologyType]: +costPerKm.toFixed(2),
    } as ChartTechnologyDataPoint;
  });
};

export const combineChartData = (
  years: number[],
  dieselData: ChartTechnologyDataPoint[],
  gnvData: ChartTechnologyDataPoint[],
  electricData: ChartTechnologyDataPoint[]
): Array<{ year: number; diesel: number; gnv: number; electric: number }> => {
  return years.map((year, index) => ({
    year,
    diesel: dieselData[index]?.diesel ?? 0,
    gnv: gnvData[index]?.gnv ?? 0,
    electric: electricData[index]?.electric ?? 0,
  }));
};

export const getIncentiveAmount = (
  incentiveType: string,
  capexPercentage: number,
  incentiveAmountCOP?: string
): number => {
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
