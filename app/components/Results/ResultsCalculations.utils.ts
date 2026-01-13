import { RiskIncrease } from '../Calculator/CalculatorForm.constants';
import {
  getFinalInvestDiesel,
  getFinalInvestGnv,
  getFinalInvestElectric,
  getDieselOpexData,
  getGnvOpexData,
  getElectricOpexData,
  calculateDieselFinexResult,
  calculateFinexResult,
  generateYearMultipliers,
  getAdditionalCost,
} from './ResultsSection.utils';
import {
  FormTypes,
  ResultsCategoryIds,
  HARDCODED_INPUT_TYPE,
  YEARS,
  PERCENTAGE_DIVISOR,
} from './ResultsSection.constants';
import type {
  CostTotalRow,
  CostPerKkmRow,
  AnnualOperationComparisonRow,
  GetTotalCostPropertyDataParams,
  GetCostPerKilometerDataParams,
  GetComparisonOperationAnnualDataParams,
  ResultsData,
  BusRow,
} from './ResultsSection.types';
import type { StackedBarChartDataPoint } from '@/lib/BarChart';
import { TECHNOLOGY_LABELS, TechnologyType } from '../Calculator/CalculatorForm.constants';
import { getCostPerKmResult, calculateCostPerKmByYear, combineChartData } from './ResultsSection.utils';
import type { CalculatorFormData } from '../Calculator/CalculatorForm.types';

export function getTotalCostPropertyData({ busesData, results }: GetTotalCostPropertyDataParams) {
  const finalInvestDiesel = getFinalInvestDiesel({ busesData, results, inputType: HARDCODED_INPUT_TYPE });
  const finalInvestGnv = getFinalInvestGnv({ busesData, results, inputType: HARDCODED_INPUT_TYPE });
  const finalInvestElectric = getFinalInvestElectric({ busesData, results, inputType: HARDCODED_INPUT_TYPE });

  const { dieselConsumptionCosts, totalDieselMaintenance, totalDieselConsumption, dieselOpex } =
    getDieselOpexData(results);
  const { gnvConsumptionCosts, totalGnvMaintenance, totalGnvConsumption, gnvOpex } = getGnvOpexData(results);
  const { electricConsumptionCosts, totalElectricMaintenance, totalElectricConsumption, electricOpex } =
    getElectricOpexData(results);

  const dieselFinex = calculateDieselFinexResult({
    finalInvestDiesel,
    interestRate: +results.interestEA / PERCENTAGE_DIVISOR,
  });
  const gnvFinex = calculateFinexResult({ results, finalInvest: finalInvestGnv, technologyType: TechnologyType.gnv });
  const electricFinex = calculateFinexResult({
    results,
    finalInvest: finalInvestElectric,
    technologyType: TechnologyType.electric,
  });

  const totalDiesel = Math.round(finalInvestDiesel + dieselOpex + dieselFinex);
  const totalGnv = Math.round(finalInvestGnv + gnvOpex + gnvFinex);
  const totalElectrics = Math.round(finalInvestElectric + electricOpex + electricFinex);

  const additionalYearMultipliers = generateYearMultipliers(RiskIncrease.none);

  const dieselAdditionalCost = getAdditionalCost({
    additionalOperatingExpenses: results.additionalOperatingExpenses,
    opex: dieselOpex,
    additionalYearMultipliers,
  });
  const gnvAdditionalCost = getAdditionalCost({
    additionalOperatingExpenses: results.additionalOperatingExpenses,
    opex: gnvOpex,
    additionalYearMultipliers,
  });
  const electricAdditionalCost = getAdditionalCost({
    additionalOperatingExpenses: results.additionalOperatingExpenses,
    opex: electricOpex,
    additionalYearMultipliers,
  });

  const dieselTotalCost = totalDiesel + dieselAdditionalCost;
  const gnvTotalCost = totalGnv + gnvAdditionalCost;
  const electricTotalCost = totalElectrics + electricAdditionalCost;

  const totalCostPropertyData: CostTotalRow[] = [
    {
      id: FormTypes.capex,
      category: 'CAPEX',
      diesel: Math.round(finalInvestDiesel),
      gnv: Math.round(finalInvestGnv),
      electric: Math.round(finalInvestElectric),
    },
    {
      id: FormTypes.opex,
      category: 'OPEX',
      diesel: Math.round(dieselOpex),
      gnv: Math.round(gnvOpex),
      electric: Math.round(electricOpex),
    },
    {
      id: FormTypes.finex,
      category: 'FINEX',
      diesel: Math.round(dieselFinex),
      gnv: Math.round(gnvFinex),
      electric: Math.round(electricFinex),
    },
    {
      id: ResultsCategoryIds.total,
      category: 'Total',
      diesel: totalDiesel,
      gnv: totalGnv,
      electric: totalElectrics,
    },
    {
      id: ResultsCategoryIds.additionalExpenses,
      category: 'Gastos Adicionales de Operación',
      diesel: Math.round(dieselAdditionalCost),
      gnv: Math.round(gnvAdditionalCost),
      electric: Math.round(electricAdditionalCost),
    },
    {
      id: ResultsCategoryIds.totalOverhead,
      category: 'Total con Overhead',
      diesel: Math.round(dieselTotalCost),
      gnv: Math.round(gnvTotalCost),
      electric: Math.round(electricTotalCost),
    },
  ];

  const chartTotalCostOfOwnershipData: StackedBarChartDataPoint[] = [
    {
      id: TechnologyType.diesel,
      label: 'Diésel',
      values: {
        capex: Math.round(finalInvestDiesel),
        opex: Math.round(dieselOpex),
        finex: Math.round(dieselFinex),
      },
    },
    {
      id: TechnologyType.gnv,
      label: 'GNV',
      values: {
        capex: Math.round(finalInvestGnv),
        opex: Math.round(gnvOpex),
        finex: Math.round(gnvFinex),
      },
    },
    {
      id: TechnologyType.electric,
      label: 'Eléctricos',
      values: {
        capex: Math.round(finalInvestElectric),
        opex: Math.round(electricOpex),
        finex: Math.round(electricFinex),
      },
    },
  ];

  return {
    totalCostPropertyData,
    chartTotalCostOfOwnershipData,
    finalInvestDiesel,
    finalInvestGnv,
    finalInvestElectric,
    dieselFinex,
    gnvFinex,
    electricFinex,
    totalDiesel,
    totalGnv,
    totalElectrics,
    dieselOpex,
    gnvOpex,
    electricOpex,
    dieselConsumptionCosts,
    gnvConsumptionCosts,
    electricConsumptionCosts,
    totalDieselMaintenance,
    totalGnvMaintenance,
    totalElectricMaintenance,
    totalDieselConsumption,
    totalGnvConsumption,
    totalElectricConsumption,
  };
}

export function getCostPerKilometerData({
  totalCostData,
  annualKilometers,
  busesNumber,
}: GetCostPerKilometerDataParams) {
  const {
    finalInvestDiesel,
    finalInvestGnv,
    finalInvestElectric,
    dieselFinex,
    gnvFinex,
    electricFinex,
    dieselOpex,
    gnvOpex,
    electricOpex,
    totalDieselConsumption,
    totalGnvConsumption,
    totalElectricConsumption,
    totalDieselMaintenance,
    totalGnvMaintenance,
    totalElectricMaintenance,
  } = totalCostData;
  const cpkCapexDiesel = getCostPerKmResult({ invest: finalInvestDiesel, annualKilometers, busesNumber });
  const cpkCapexGnv = getCostPerKmResult({ invest: finalInvestGnv, annualKilometers, busesNumber });
  const cpkCapexElectrics = getCostPerKmResult({ invest: finalInvestElectric, annualKilometers, busesNumber });
  const cpkOpexDiesel = getCostPerKmResult({ invest: dieselOpex, annualKilometers, busesNumber });
  const cpkOpexGnv = getCostPerKmResult({ invest: gnvOpex, annualKilometers, busesNumber });
  const cpkOpexElectrics = getCostPerKmResult({ invest: electricOpex, annualKilometers, busesNumber });
  const cpkFinexDiesel = getCostPerKmResult({ invest: dieselFinex, annualKilometers, busesNumber });
  const cpkFinexGnv = getCostPerKmResult({ invest: gnvFinex, annualKilometers, busesNumber });
  const cpkFinexElectrics = getCostPerKmResult({ invest: electricFinex, annualKilometers, busesNumber });
  const cpkTotalsDiesel = cpkCapexDiesel + cpkOpexDiesel + cpkFinexDiesel;
  const cpkTotalsGnv = cpkCapexGnv + cpkOpexGnv + cpkFinexGnv;
  const cpkTotalsElectrics = cpkCapexElectrics + cpkOpexElectrics + cpkFinexElectrics;

  const costPerKilometerData: CostPerKkmRow[] = [
    {
      id: FormTypes.capex,
      cost: 'CAPEX',
      diesel: Math.round(cpkCapexDiesel),
      gnv: Math.round(cpkCapexGnv),
      electric: Math.round(cpkCapexElectrics),
    },
    {
      id: FormTypes.opex,
      cost: 'OPEX',
      diesel: Math.round(cpkOpexDiesel),
      gnv: Math.round(cpkOpexGnv),
      electric: Math.round(cpkOpexElectrics),
    },
    {
      id: FormTypes.finex,
      cost: 'FINEX',
      diesel: Math.round(cpkFinexDiesel),
      gnv: Math.round(cpkFinexGnv),
      electric: Math.round(cpkFinexElectrics),
    },
    {
      id: ResultsCategoryIds.total,
      cost: 'Total',
      diesel: Math.round(cpkTotalsDiesel),
      gnv: Math.round(cpkTotalsGnv),
      electric: Math.round(cpkTotalsElectrics),
    },
  ];

  const dieselConsumptionCost = totalDieselConsumption / (+annualKilometers * YEARS);
  const gnvConsumptionCost = totalGnvConsumption / (+annualKilometers * YEARS);
  const electricConsumptionCost = totalElectricConsumption / (+annualKilometers * YEARS);
  const dieselMaintenanceCost = totalDieselMaintenance / (+annualKilometers * YEARS);
  const gnvMaintenanceCost = totalGnvMaintenance / (+annualKilometers * YEARS);
  const electricMaintenanceCost = totalElectricMaintenance / (+annualKilometers * YEARS);
  const dieselTotalCosts = dieselConsumptionCost + dieselMaintenanceCost;
  const gnvTotalCosts = gnvConsumptionCost + gnvMaintenanceCost;
  const electricTotalCosts = electricConsumptionCost + electricMaintenanceCost;
  const gnvSavings = dieselTotalCosts - gnvTotalCosts;
  const electricSavings = dieselTotalCosts - electricTotalCosts;

  const chartCostPerKilometerData: StackedBarChartDataPoint[] = [
    {
      id: TechnologyType.diesel,
      label: TECHNOLOGY_LABELS[TechnologyType.diesel],
      values: {
        savings: 0,
        maintenance: Math.round(dieselMaintenanceCost),
        consumption: Math.round(dieselConsumptionCost),
      },
    },
    {
      id: TechnologyType.gnv,
      label: TECHNOLOGY_LABELS[TechnologyType.gnv],
      values: {
        savings: Math.round(gnvSavings),
        maintenance: Math.round(gnvMaintenanceCost),
        consumption: Math.round(gnvConsumptionCost),
      },
    },
    {
      id: TechnologyType.electric,
      label: TECHNOLOGY_LABELS[TechnologyType.electric],
      values: {
        savings: Math.round(electricSavings),
        maintenance: Math.round(electricMaintenanceCost),
        consumption: Math.round(electricConsumptionCost),
      },
    },
  ];

  return {
    costPerKilometerData,
    chartCostPerKilometerData,
    cpkTotalsDiesel,
    cpkTotalsGnv,
    cpkTotalsElectrics,
    cpkOpexDiesel,
    cpkOpexGnv,
    cpkOpexElectrics,
  };
}

export function getComparisonOperationAnnualData({
  totalCostData,
  costPerKmData,
  annualKilometers,
}: GetComparisonOperationAnnualDataParams) {
  const {
    finalInvestDiesel,
    finalInvestGnv,
    finalInvestElectric,
    totalDiesel,
    totalGnv,
    totalElectrics,
    dieselOpex,
    gnvOpex,
    electricOpex,
    dieselConsumptionCosts,
    gnvConsumptionCosts,
    electricConsumptionCosts,
  } = totalCostData;

  const { cpkTotalsDiesel, cpkTotalsGnv, cpkTotalsElectrics, cpkOpexDiesel, cpkOpexGnv, cpkOpexElectrics } =
    costPerKmData;

  const gnvCapexDifferential = finalInvestGnv - finalInvestDiesel;
  const electricCapexDifferential = finalInvestElectric - finalInvestDiesel;
  const gnvDifferentialTco = totalGnv - totalDiesel;
  const electricDifferentialTco = totalElectrics - totalDiesel;
  const gnvOperationalSavings = gnvOpex - dieselOpex;
  const electricOperationalSavings = electricOpex - dieselOpex;
  const gnvTcoPerKm = cpkTotalsGnv - cpkTotalsDiesel;
  const electricTcoPerKm = cpkTotalsElectrics - cpkTotalsDiesel;
  const gnvSavingsPerKm = cpkOpexGnv - cpkOpexDiesel;
  const electricSavingsPerKm = cpkOpexElectrics - cpkOpexDiesel;

  const comparisonOperationAnnualData: AnnualOperationComparisonRow[] = [
    {
      id: FormTypes.capex,
      differential: 'CAPEX',
      gnv: Math.round(gnvCapexDifferential),
      electric: Math.round(electricCapexDifferential),
    },
    {
      id: ResultsCategoryIds.tco,
      differential: 'TCO',
      gnv: Math.round(gnvDifferentialTco),
      electric: Math.round(electricDifferentialTco),
    },
    {
      id: ResultsCategoryIds.operationalSavings,
      differential: 'Ahorros Operacionales',
      gnv: Math.round(gnvOperationalSavings),
      electric: Math.round(electricOperationalSavings),
    },
    {
      id: ResultsCategoryIds.tcoPerKm,
      differential: 'TCO por KM',
      gnv: Math.round(gnvTcoPerKm),
      electric: Math.round(electricTcoPerKm),
    },
    {
      id: ResultsCategoryIds.savingsPerKm,
      differential: 'Ahorros por KM',
      gnv: Math.round(gnvSavingsPerKm),
      electric: Math.round(electricSavingsPerKm),
    },
  ];

  const dieselCostPerKmByYear = calculateCostPerKmByYear({
    consumptionCosts: dieselConsumptionCosts,
    annualKilometers,
    technologyType: TechnologyType.diesel,
  });
  const gnvCostPerKmByYear = calculateCostPerKmByYear({
    consumptionCosts: gnvConsumptionCosts,
    annualKilometers,
    technologyType: TechnologyType.gnv,
  });
  const electricCostPerKmByYear = calculateCostPerKmByYear({
    consumptionCosts: electricConsumptionCosts,
    annualKilometers,
    technologyType: TechnologyType.electric,
  });

  const years = dieselConsumptionCosts.map((item) => item.year);
  const chartComparisonOperationAnnualData = combineChartData({
    years,
    dieselData: dieselCostPerKmByYear,
    gnvData: gnvCostPerKmByYear,
    electricData: electricCostPerKmByYear,
  });

  return {
    comparisonOperationAnnualData,
    chartComparisonOperationAnnualData,
  };
}

export function calculateResultsData(
  results: CalculatorFormData | null | undefined,
  busesData: BusRow[] | null | undefined
): ResultsData | null {
  if (!results || !busesData) {
    return null;
  }

  const { busesNumber, annualKilometers } = results;

  const totalCostData = getTotalCostPropertyData({ busesData, results });

  const { totalCostPropertyData, chartTotalCostOfOwnershipData } = totalCostData;

  const costPerKmData = getCostPerKilometerData({
    totalCostData,
    annualKilometers,
    busesNumber,
  });

  const { costPerKilometerData, chartCostPerKilometerData } = costPerKmData;

  const { comparisonOperationAnnualData, chartComparisonOperationAnnualData } = getComparisonOperationAnnualData({
    totalCostData,
    costPerKmData,
    annualKilometers,
  });

  return {
    totalCostPropertyData,
    costPerKilometerData,
    comparisonOperationAnnualData,
    chartTotalCostOfOwnershipData,
    chartCostPerKilometerData,
    chartComparisonOperationAnnualData,
  };
}
