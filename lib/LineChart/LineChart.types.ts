export interface LineChartTooltip {
  label: string;
  value: string;
  color: string;
  x: number;
  y: number;
  year: number;
}

export interface LineChartDataPoint {
  year: number;
  diesel: number;
  gnv: number;
  electric: number;
}

export interface LineChartSeries {
  key: string;
  label: string;
  color: string;
  markerType: 'circle' | 'square' | 'triangle' | 'diamond';
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  series: LineChartSeries[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  formatValueLabel?: (value: number) => string;
  className?: string;
}
