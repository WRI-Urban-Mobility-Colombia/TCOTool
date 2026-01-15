import { BarChartSeries } from '@/lib/BarChart';
import { TechnologyType } from '../Calculator/CalculatorForm.constants';

export const DIESEL_MULTIPLIER = 1;
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

export enum TableVariant {
  totalCost = 'total-cost',
  costPerKm = 'cost-per-km',
  annualOperationComparison = 'annual-operation-comparison',
}

export const HARDCODED_INPUT_TYPE: InputTypes = InputTypes.form;

export const LAST_THREE_ROWS = ['total', 'additional-expenses', 'total-overhead'] as const;

export const IPC = {
  SECOND_YEAR: 0.07,
  THIRD_YEAR: 0.05,
  ALL_YEARS: 0.03,
} as const;

export const INICIAL_MULTIPLIER = 1;

export const PRICING_INCREMENT_RISK = 0.25;

export const PERCENTAGE_DIVISOR = 100;

export const DECIMAL_PLACES = 2;

export const RISK_INCREMENT_YEARS = {
  SHORT_TERM: 3,
  MEDIUM_TERM: 7,
  LONG_TERM: 10,
  NONE: 0,
} as const;

export const YEAR_NUMBERS = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
} as const;

export const BARCHART = {
  width: 697,
  height: 500,
  orientation: 'vertical' as const,
  showLegend: true,
  legendPosition: 'top' as const,
  showGrid: true,
  showTooltip: true,
  showTotals: false,
  barPadding: 0.3,
  className: 'w-full',
  margin: {
    top: 60,
    right: 0,
    bottom: 60,
    left: 0,
  },
  xAxisLabel: 'Tipo de Tecnología',
  yAxisLabel: '',
} as const;

export const TOTAL_COST_TABLE = {
  rowKey: 'id',
  columnWidths: {
    category: '32%',
    diesel: '22%',
    gnv: '22%',
    electric: '24%',
  },
  labels: {
    title: 'Costo Total de Propiedad',
    category: 'Costo Total de Propiedad',
    diesel: 'Diésel',
    gnv: 'GNV',
    electric: 'Eléctricos',
  },
} as const;

export const CHART_SERIES: BarChartSeries[] = [
  { key: FormTypes.finex, label: 'Finex', color: '#33b192' },
  { key: FormTypes.opex, label: 'Opex', color: '#f3817d' },
  { key: FormTypes.capex, label: 'Capex', color: '#6f9ff3' },
];

export const COST_PER_KM_TABLE = {
  rowKey: 'id',
  columnWidths: {
    cost: '31%',
    diesel: '23%',
    gnv: '23%',
    electric: '23%',
  },
  labels: {
    title: 'Costo promedio por kilómetro',
    cost: 'Costo promedio por kilómetro',
    diesel: 'Diesel',
    gnv: 'GNV',
    electric: 'Eléctricos',
  },
} as const;

export const COST_PER_KM_CHART_SERIES: BarChartSeries[] = [
  { key: ResultsColumnIds.consumption, label: 'Costo de Consumo', color: '#6f9ff3' },
  { key: ResultsColumnIds.maintenance, label: 'Costos de Mantenimiento', color: '#f3817d' },
  { key: ResultsColumnIds.savings, label: 'Ahorros', color: '#33b192' },
];

export const COST_PER_KM_SUBTITLE = 'Costos Operacionales por Kilómetro';

export const LINECHART = {
  width: 697,
  height: 396,
  xAxisLabel: 'Años',
} as const;

import type { LineChartSeries } from '@/lib/LineChart/LineChart.types';

export const ANNUAL_OPERATION_COMPARISON_CHART_SERIES: LineChartSeries[] = [
  {
    key: TechnologyType.diesel,
    label: 'Bus Diésel',
    color: '#33b192',
    markerType: 'triangle',
  },
  {
    key: TechnologyType.gnv,
    label: 'Bus GNV',
    color: '#f3817d',
    markerType: 'square',
  },
  {
    key: TechnologyType.electric,
    label: 'Eléctrico',
    color: '#6f9ff3',
    markerType: 'diamond',
  },
];

export const ANNUAL_OPERATION_COMPARISON_TABLE = {
  rowKey: 'id',
  columnWidths: {
    differential: '41%',
    gnv: '29.5%',
    electric: '29.5%',
  },
  labels: {
    title: 'Comparación Operación Anual',
    differential: 'Diferencial con Diésel',
    gnv: 'GNV',
    electric: 'Eléctricos',
  },
} as const;
