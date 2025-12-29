'use client';

import { TotalCostOfOwnership } from './TotalCostOfOwnership';
import { AnnualOperationComparison } from './AnnualOperationComparison';
import { CostPerKilometer } from './CostPerKilometer';
import type { ResultsSectionProps, AnnualOperationComparisonRow } from './ResultsSection.types';
import {
  IncentiveEligibility,
  RiskIncrease,
  TECHNOLOGY_LABELS,
  Typology,
  TYPOLOGY_VALUES,
} from '../Calculator/CalculatorForm.constants';
import { useGetBusesDataByTypeAndTechnology } from '@/lib/hooks/useGetBusesDataByTypeAndTechnology';

import { ACValue, TechnologyType } from '../Calculator/CalculatorForm.constants';
import {
  generateYearMultipliers,
  addPriceScenarioToMultipliers,
  getAdditionalCost,
  calculateDieselMaintenanceCost,
  calculateGnvMaintenanceCost,
  calculateElectricMaintenanceCost,
  calculateDieselConsumptionCost,
  calculateDieselOpexTotal,
  calculateGnvConsumptionCost,
  calculateGnvOpexTotal,
  calculateElectricConsumptionCost,
  calculateElectricOpexTotal,
  calculateDieselFinexResult,
  calculateFinexResult,
  getFinalInvestDiesel,
  getBusDataByTechnology,
  getCostPerKmResult,
  calculateCostPerKmByYear,
  combineChartData,
  getIncentiveAmount,
} from './ResultsSection.utils';
import {
  AC_PERCENTAGE,
  FormTypes,
  HARDCODED_INPUT_TYPE,
  InputTypes,
  ResultsCategoryIds,
  YEARS,
} from './ResultsSection.constants';
import { extractNumericValue } from '@/lib/utils';
import type { StackedBarChartDataPoint } from '@/lib/BarChart';
import type { ResultsData } from './ResultsSection.types';
import { useEffect, useMemo } from 'react';

export function ResultsSection({ className, results, onDataCalculated }: ResultsSectionProps) {
  const typology = results?.typology ? TYPOLOGY_VALUES[results.typology as Typology] : undefined;
  const busesData = useGetBusesDataByTypeAndTechnology(typology);

  const resultsData = useMemo((): ResultsData | null => {
    if (!results || !busesData) {
      return null;
    }

    const {
      acquisitionCosts,
      fuel,
      busesNumber,
      ac,
      interestEA,
      annualKilometers,
      additionalOperatingExpenses,
      eligibility,
      incentivePercentage,
      incentiveType,
      incentiveAmountCOP,
      chargersPerBus,
    } = results;
    const { busetonCost, infrastructure, battery } = acquisitionCosts;
    const { price, increaseRisk } = fuel;

    const dieselBusData = getBusDataByTechnology(busesData, TechnologyType.diesel);
    const finalInvestDiesel = getFinalInvestDiesel(
      dieselBusData,
      results.trm,
      HARDCODED_INPUT_TYPE,
      busetonCost.diesel,
      busesNumber
    );

    const gnvBusData = getBusDataByTechnology(busesData, TechnologyType.gnv);
    const gnvBusCost = gnvBusData ? +extractNumericValue(gnvBusData.busCostUSD) : 0;
    const gnvSelectedBusCost = HARDCODED_INPUT_TYPE === InputTypes.dataBase ? gnvBusCost : +busetonCost.gnv;
    const busCostGnv = gnvSelectedBusCost * +results.trm;
    const gnvInfrastructureCost = gnvBusData ? +extractNumericValue(gnvBusData.infrastructureUSD) : 0;
    const gnvSelectedInfrastructureCost =
      HARDCODED_INPUT_TYPE === InputTypes.dataBase ? gnvInfrastructureCost : +infrastructure.gnv;
    const infrastructureCostGnv = gnvSelectedInfrastructureCost * +results.trm;
    const capexResultGnv = busCostGnv + infrastructureCostGnv;
    const eligibilityGnv = eligibility === IncentiveEligibility.electric ? 0 : 1;
    const gnvCapexPercentage = (+incentivePercentage / 100) * capexResultGnv;
    const gnvCurrentIncentive = getIncentiveAmount(incentiveType, gnvCapexPercentage, incentiveAmountCOP);
    const gnvIncentive = eligibilityGnv * gnvCurrentIncentive;
    const finalInvestGnv = (capexResultGnv - gnvIncentive) * +busesNumber;

    const electricBusData = getBusDataByTechnology(busesData, TechnologyType.electric);
    const electricBusCost = electricBusData ? +extractNumericValue(electricBusData.busCostUSD) : 0;
    const electricSelectedBusCost =
      HARDCODED_INPUT_TYPE === InputTypes.dataBase ? electricBusCost : +busetonCost.electric;
    const busCostElectric = electricSelectedBusCost * +results.trm;
    const electricInfrastructureCost = electricBusData ? +extractNumericValue(electricBusData.infrastructureUSD) : 0;
    const electricSelectedInfrastructureCost =
      HARDCODED_INPUT_TYPE === InputTypes.dataBase ? electricInfrastructureCost : +infrastructure.electric;
    const infrastructureCostElectric = electricSelectedInfrastructureCost * +results.trm * +chargersPerBus;
    const electricBatteryCost = electricBusData ? +extractNumericValue(electricBusData.batteryUSD) : 0;
    const electricSelectedBatteryCost =
      HARDCODED_INPUT_TYPE === InputTypes.dataBase ? electricBatteryCost : +battery.electric;
    const batteryCostElectric = electricSelectedBatteryCost * +results.trm;
    const capexResultElectric = busCostElectric + infrastructureCostElectric + batteryCostElectric;
    const electricCapexPercentage = (+incentivePercentage / 100) * capexResultElectric;
    const electricCurrentIncentive = getIncentiveAmount(incentiveType, electricCapexPercentage, incentiveAmountCOP);
    const finalInvestElectric = (capexResultElectric - electricCurrentIncentive) * +busesNumber;

    const dieselYearMultipliers = generateYearMultipliers(increaseRisk.dieselCOPGallon);
    const dieselYearMultipliersWithPrice = addPriceScenarioToMultipliers(dieselYearMultipliers, +price.dieselCOPGallon);
    const dieselMaintenanceCosts = calculateDieselMaintenanceCost(results, dieselYearMultipliersWithPrice);
    const dieselTechnologyConsumption = +results.consumptionUnitKm.consumptionValidationKmUnitAc.dieselKmGallon || 0;
    const percentageByAC = ac === ACValue.yes ? AC_PERCENTAGE.YES : AC_PERCENTAGE.NO;
    const finalDieselTechnologyConsumption = dieselTechnologyConsumption * percentageByAC;
    const dieselConsumptionCosts = calculateDieselConsumptionCost(
      results,
      dieselMaintenanceCosts,
      finalDieselTechnologyConsumption
    );
    const { totalDieselMaintenance, totalDieselConsumption, dieselOpex } =
      calculateDieselOpexTotal(dieselConsumptionCosts);

    const gnvYearMultipliers = generateYearMultipliers(increaseRisk.gasCOPM3);
    const gnvYearMultipliersWithPrice = addPriceScenarioToMultipliers(gnvYearMultipliers, +price.gasCOPM3);
    const gnvMaintenanceCosts = calculateGnvMaintenanceCost(results, gnvYearMultipliersWithPrice);
    const gnvTechnologyConsumption = +results.consumptionUnitKm.consumptionValidationKmUnitAc.gasKmM3 || 0;
    const finalGnvTechnologyConsumption = gnvTechnologyConsumption * percentageByAC;
    const gnvConsumptionCosts = calculateGnvConsumptionCost(
      results,
      gnvMaintenanceCosts,
      finalGnvTechnologyConsumption
    );
    const { totalGnvMaintenance, totalGnvConsumption, gnvOpex } = calculateGnvOpexTotal(gnvConsumptionCosts);

    const electricYearMultipliers = generateYearMultipliers(increaseRisk.electricityCOPKwh);
    const electricYearMultipliersWithPrice = addPriceScenarioToMultipliers(
      electricYearMultipliers,
      +price.electricityCOPKwh
    );
    const electricMaintenanceCosts = calculateElectricMaintenanceCost(results, electricYearMultipliersWithPrice);
    const electricTechnologyConsumption =
      +results.consumptionUnitKm.consumptionValidationKmUnitAc.electricityKmKwh || 0;
    const finalElectricTechnologyConsumption = electricTechnologyConsumption * percentageByAC;
    const electricConsumptionCosts = calculateElectricConsumptionCost(
      results,
      electricMaintenanceCosts,
      finalElectricTechnologyConsumption
    );
    const { totalElectricMaintenance, totalElectricConsumption, electricOpex } =
      calculateElectricOpexTotal(electricConsumptionCosts);

    const dieselFinex = calculateDieselFinexResult(finalInvestDiesel, +interestEA / 100);
    const gnvFinex = calculateFinexResult(results, finalInvestGnv, TechnologyType.gnv);
    const electricFinex = calculateFinexResult(results, finalInvestElectric, TechnologyType.electric);

    const totalDiesel = Math.round(finalInvestDiesel + dieselOpex + dieselFinex);
    const totalGnv = Math.round(finalInvestGnv + gnvOpex + gnvFinex);
    const totalElectrics = Math.round(finalInvestElectric + electricOpex + electricFinex);

    const additionalYearMultipliers = generateYearMultipliers(RiskIncrease.none);

    const dieselAdditionalCost = getAdditionalCost(additionalOperatingExpenses, dieselOpex, additionalYearMultipliers);

    const gnvAdditionalCost = getAdditionalCost(additionalOperatingExpenses, gnvOpex, additionalYearMultipliers);

    const electricAdditionalCost = getAdditionalCost(
      additionalOperatingExpenses,
      electricOpex,
      additionalYearMultipliers
    );

    const dieselTotalCost = totalDiesel + dieselAdditionalCost;
    const gnvTotalCost = totalGnv + gnvAdditionalCost;
    const electricTotalCost = totalElectrics + electricAdditionalCost;

    const totalCostPropertyData = [
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

    const cpkCapexDiesel = getCostPerKmResult(finalInvestDiesel, annualKilometers, busesNumber);
    const cpkCapexGnv = getCostPerKmResult(finalInvestGnv, annualKilometers, busesNumber);
    const cpkCapexElectrics = getCostPerKmResult(finalInvestElectric, annualKilometers, busesNumber);
    const cpkOpexDiesel = getCostPerKmResult(dieselOpex, annualKilometers, busesNumber);
    const cpkOpexGnv = getCostPerKmResult(gnvOpex, annualKilometers, busesNumber);
    const cpkOpexElectrics = getCostPerKmResult(electricOpex, annualKilometers, busesNumber);
    const cpkFinexDiesel = getCostPerKmResult(dieselFinex, annualKilometers, busesNumber);
    const cpkFinexGnv = getCostPerKmResult(gnvFinex, annualKilometers, busesNumber);
    const cpkFinexElectrics = getCostPerKmResult(electricFinex, annualKilometers, busesNumber);
    const cpkTotalsDiesel = cpkCapexDiesel + cpkOpexDiesel + cpkFinexDiesel;
    const cpkTotalsGnv = cpkCapexGnv + cpkOpexGnv + cpkFinexGnv;
    const cpkTotalsElectrics = cpkCapexElectrics + cpkOpexElectrics + cpkFinexElectrics;

    const costPerKilometerData = [
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

    const dieselCostPerKmByYear = calculateCostPerKmByYear(
      dieselConsumptionCosts,
      annualKilometers,
      TechnologyType.diesel
    );
    const gnvCostPerKmByYear = calculateCostPerKmByYear(gnvConsumptionCosts, annualKilometers, TechnologyType.gnv);
    const electricCostPerKmByYear = calculateCostPerKmByYear(
      electricConsumptionCosts,
      annualKilometers,
      TechnologyType.electric
    );

    const years = dieselConsumptionCosts.map((item) => item.year);
    const chartComparisonOperationAnnualData = combineChartData(
      years,
      dieselCostPerKmByYear,
      gnvCostPerKmByYear,
      electricCostPerKmByYear
    );

    return {
      totalCostPropertyData,
      costPerKilometerData,
      comparisonOperationAnnualData,
      chartTotalCostOfOwnershipData,
      chartCostPerKilometerData,
      chartComparisonOperationAnnualData,
    };
  }, [results, busesData]);

  useEffect(() => {
    if (onDataCalculated && resultsData) {
      onDataCalculated(resultsData);
    }
  }, [resultsData, onDataCalculated]);

  if (!results || !busesData || !resultsData) {
    return null;
  }

  const {
    totalCostPropertyData,
    costPerKilometerData,
    comparisonOperationAnnualData,
    chartTotalCostOfOwnershipData,
    chartCostPerKilometerData,
    chartComparisonOperationAnnualData,
  } = resultsData;

  return (
    <div className={`w-full ${className ?? ''}`}>
      <div className="mb-6">
        <TotalCostOfOwnership
          totalCostPropertyData={totalCostPropertyData}
          chartTotalCostOfOwnershipData={chartTotalCostOfOwnershipData}
        />
      </div>

      <div className="mb-6 h-px w-full bg-[#e5e7eb]"></div>

      <div className="mb-6">
        <AnnualOperationComparison
          comparisonOperationAnnualData={comparisonOperationAnnualData}
          chartComparisonOperationAnnualData={chartComparisonOperationAnnualData}
        />
      </div>

      <div className="mb-6 h-px w-full bg-[#e5e7eb]"></div>

      <div className="mb-6">
        <CostPerKilometer
          costPerKilometerData={costPerKilometerData}
          chartCostPerKilometerData={chartCostPerKilometerData}
        />
      </div>
    </div>
  );
}
