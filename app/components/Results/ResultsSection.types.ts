import { LineChartDataPoint } from '@/lib/LineChart/LineChart.types';
import type { CalculatorFormData } from '../Calculator/CalculatorForm.types';
import { StackedBarChartDataPoint } from '@/lib/BarChart';
import jsPDF from 'jspdf';

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
