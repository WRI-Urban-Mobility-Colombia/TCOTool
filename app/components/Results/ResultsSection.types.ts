import { LineChartDataPoint } from '@/lib/LineChart/LineChart.types';
import type { CalculatorFormData } from '../Calculator/CalculatorForm.types';
import { StackedBarChartDataPoint } from '@/lib/BarChart';
import jsPDF from 'jspdf';
import { TechnologyType } from '../Calculator/CalculatorForm.constants';
import { InputTypes } from './ResultsSection.constants';
import { UseFormReturn } from '@/lib/Form/Form.types';

export interface BusRow {
  technology: string;
  typology: string;
  usefulLife: string;
  busCostUSD: string;
  infrastructureUSD: string;
  batteryUSD: string;
  consumptionKmUnitDefault: string;
  maintenanceUSDKm: string;
}

export interface ResultsSectionProps {
  className?: string;
  results?: CalculatorFormData | null;
  onDataCalculated?: (data: ResultsData) => void;
}

export interface CostTotalRow {
  id: string;
  category: string;
  diesel: number | null;
  gnv: number | null;
  electric: number | null;
}

export interface CostPerKkmRow {
  id: string;
  cost: string;
  diesel: number | null;
  gnv: number | null;
  electric: number | null;
}

export interface AnnualOperationComparisonRow {
  id: string;
  differential: string;
  gnv: number | null;
  electric: number | null;
}
export interface ResultsData {
  totalCostPropertyData: CostTotalRow[];
  costPerKilometerData: CostPerKkmRow[];
  comparisonOperationAnnualData: AnnualOperationComparisonRow[];
  chartTotalCostOfOwnershipData: StackedBarChartDataPoint[];
  chartCostPerKilometerData: StackedBarChartDataPoint[];
  chartComparisonOperationAnnualData: LineChartDataPoint[];
}

export interface PdfData extends ResultsData {
  currencyPrefix: string;
}

export interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export interface TotalCostDataProps {
  totalCostPropertyData: CostTotalRow[];
  chartTotalCostOfOwnershipData: StackedBarChartDataPoint[];
  finalInvestDiesel: number;
  finalInvestGnv: number;
  finalInvestElectric: number;
  dieselFinex: number;
  gnvFinex: number;
  electricFinex: number;
  totalDiesel: number;
  totalGnv: number;
  totalElectrics: number;
  dieselOpex: number;
  gnvOpex: number;
  electricOpex: number;
  dieselConsumptionCosts: YearMultiplierWithConsumptionCost[];
  gnvConsumptionCosts: YearMultiplierWithConsumptionCost[];
  electricConsumptionCosts: YearMultiplierWithConsumptionCost[];
  totalDieselMaintenance: number;
  totalGnvMaintenance: number;
  totalElectricMaintenance: number;
  totalDieselConsumption: number;
  totalGnvConsumption: number;
  totalElectricConsumption: number;
}

export interface CostPerKmDataProps {
  costPerKilometerData: CostPerKkmRow[];
  chartCostPerKilometerData: StackedBarChartDataPoint[];
  cpkTotalsDiesel: number;
  cpkTotalsGnv: number;
  cpkTotalsElectrics: number;
  cpkOpexDiesel: number;
  cpkOpexGnv: number;
  cpkOpexElectrics: number;
}

export interface GetTotalCostPropertyDataParams {
  busesData: BusRow[];
  results: CalculatorFormData;
}

export interface GetCostPerKilometerDataParams {
  totalCostData: TotalCostDataProps;
  annualKilometers: string;
  busesNumber: string;
}

export interface GetComparisonOperationAnnualDataParams {
  totalCostData: TotalCostDataProps;
  costPerKmData: CostPerKmDataProps;
  annualKilometers: string;
}

export interface RenderTotalCostCategoryParams {
  value: string;
  row: CostTotalRow;
}

export interface RenderTotalCostValueParams {
  value: number | null | undefined;
  row: CostTotalRow;
  currencyPrefix: string;
}

export interface RenderCostPerKmCategoryParams {
  value: string;
  row: CostPerKkmRow;
}

export interface RenderCostPerKmValueParams {
  value: number | null | undefined;
  row: CostPerKkmRow;
  currencyPrefix: string;
}

export interface RenderAnnualOperationComparisonCategoryParams {
  value: string;
  row: AnnualOperationComparisonRow;
}

export interface RenderAnnualOperationComparisonValueParams {
  value: number | null | undefined;
  _row: AnnualOperationComparisonRow;
  currencyPrefix: string;
}

export interface TotalCostOfOwnershipProps {
  totalCostPropertyData: CostTotalRow[];
  chartTotalCostOfOwnershipData: StackedBarChartDataPoint[];
}

export interface CostPerKilometerProps {
  costPerKilometerData: CostPerKkmRow[];
  chartCostPerKilometerData: StackedBarChartDataPoint[];
}

export interface AnnualOperationComparisonProps {
  comparisonOperationAnnualData: AnnualOperationComparisonRow[];
  chartComparisonOperationAnnualData: LineChartDataPoint[];
}

export interface YearMultiplier {
  year: number;
  multiplier: number;
}

export interface YearMultiplierWithPrice {
  year: number;
  multiplier: number;
  priceScenario: number;
}

export interface YearMultiplierWithMaintenanceCost {
  year: number;
  multiplier: number;
  priceScenario: number;
  maintenanceCost: number;
}

export interface YearMultiplierWithConsumptionCost {
  year: number;
  multiplier: number;
  priceScenario: number;
  maintenanceCost: number;
  consumptionCost: number;
}

export interface YearFinex {
  year: number;
  invest: number;
  interest: number;
}

export interface OpexTotalResult {
  totalDieselMaintenance: number;
  totalDieselConsumption: number;
  dieselOpex: number;
}

export interface GnvOpexTotalResult {
  totalGnvMaintenance: number;
  totalGnvConsumption: number;
  gnvOpex: number;
}

export interface ElectricOpexTotalResult {
  totalElectricMaintenance: number;
  totalElectricConsumption: number;
  electricOpex: number;
}

export interface ChartTechnologyDataPoint {
  diesel?: number;
  gnv?: number;
  electric?: number;
}

export type TechnologyTypeForChart = TechnologyType;

export interface DieselOpexDataResult {
  dieselConsumptionCosts: YearMultiplierWithConsumptionCost[];
  totalDieselMaintenance: number;
  totalDieselConsumption: number;
  dieselOpex: number;
}

export interface GnvOpexDataResult {
  gnvConsumptionCosts: YearMultiplierWithConsumptionCost[];
  totalGnvMaintenance: number;
  totalGnvConsumption: number;
  gnvOpex: number;
}

export interface ElectricOpexDataResult {
  electricConsumptionCosts: YearMultiplierWithConsumptionCost[];
  totalElectricMaintenance: number;
  totalElectricConsumption: number;
  electricOpex: number;
}

export interface CalculateDieselFinexResultParams {
  finalInvestDiesel: number;
  interestRate: number;
}

export interface CalculateFinexResultParams {
  results: CalculatorFormData;
  finalInvest: number;
  technologyType: TechnologyType;
}

export interface AddPriceScenarioToMultipliersParams {
  yearMultipliers: YearMultiplier[];
  initialPrice: number;
}

export interface GetAdditionalCostParams {
  additionalOperatingExpenses: { type: string; quantity: string };
  opex: number;
  additionalYearMultipliers: YearMultiplier[];
}

export interface CalculateDieselMaintenanceCostParams {
  results: CalculatorFormData;
  dieselYearMultipliersWithPrice: YearMultiplierWithPrice[];
}

export interface CalculateGnvMaintenanceCostParams {
  results: CalculatorFormData;
  gnvYearMultipliersWithPrice: YearMultiplierWithPrice[];
}

export interface CalculateElectricMaintenanceCostParams {
  results: CalculatorFormData;
  electricYearMultipliersWithPrice: YearMultiplierWithPrice[];
}

export interface CalculateDieselConsumptionCostParams {
  results: CalculatorFormData;
  dieselMaintenanceCosts: YearMultiplierWithMaintenanceCost[];
  finalDieselTechnologyConsumption: number;
}

export interface CalculateGnvConsumptionCostParams {
  results: CalculatorFormData;
  gnvMaintenanceCosts: YearMultiplierWithMaintenanceCost[];
  finalGnvTechnologyConsumption: number;
}

export interface CalculateElectricConsumptionCostParams {
  results: CalculatorFormData;
  electricMaintenanceCosts: YearMultiplierWithMaintenanceCost[];
  finalElectricTechnologyConsumption: number;
}

export interface GetFinalInvestDieselParams {
  busesData: BusRow[];
  results: CalculatorFormData;
  inputType: InputTypes;
}

export interface GetFinalInvestGnvParams {
  busesData: BusRow[];
  results: CalculatorFormData;
  inputType: InputTypes;
}

export interface GetFinalInvestElectricParams {
  busesData: BusRow[];
  results: CalculatorFormData;
  inputType: InputTypes;
}

export interface GetBusDataByTechnologyParams {
  busesData: BusRow[];
  technology: TechnologyType;
}

export interface GetCostPerKmResultParams {
  invest: number;
  annualKilometers: string;
  busesNumber: string;
}

export interface CalculateCostPerKmByYearParams {
  consumptionCosts: YearMultiplierWithConsumptionCost[];
  annualKilometers: string;
  technologyType: TechnologyType;
}

export interface CombineChartDataParams {
  years: number[];
  dieselData: ChartTechnologyDataPoint[];
  gnvData: ChartTechnologyDataPoint[];
  electricData: ChartTechnologyDataPoint[];
}

export interface GetIncentiveAmountParams {
  incentiveType: string;
  capexPercentage: number;
  incentiveAmountCOP?: string;
}

export interface RenderFormParams {
  currentStep: number;
  form: UseFormReturn<CalculatorFormData>;
  handleContinue: () => void;
  submitAttempted: boolean;
  insertDefaultValues: boolean;
  handleAcquisitionCostsToggle: (value: boolean) => void;
  handlePreviousStep: () => void;
  busesData: BusRow[];
}
