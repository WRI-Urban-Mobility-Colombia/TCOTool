import type { SVGAttributes } from 'react';

export interface BarChartDataPoint {
  id: string;
  label: string;
  value: number;
  category?: string;
}

export interface StackedBarChartDataPoint {
  id: string;
  label: string;
  values: Record<string, number>;
  total?: number;
}

export interface BarChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface BarChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type BarChartOrientation = 'vertical' | 'horizontal';

export interface BarChartStyleProps {
  titleColor?: string;
  titleFontSize?: number;
  titleFontWeight?: number;
  titleFontFamily?: string;
  axisTextColor?: string;
  axisTextFontSize?: number;
  axisTextFontFamily?: string;
  gridLineColor?: string;
  gridLineStrokeWidth?: number;
  backgroundColor?: string;
  totalTextColor?: string;
  totalTextFontSize?: number;
  totalTextFontFamily?: string;
  barOutlineStyle?: string;
  yAxisLabelPopupBackgroundColor?: string;
  yAxisLabelPopupBorderColor?: string;
  yAxisLabelPopupTextColor?: string;
  yAxisLabelPopupFontSize?: number;
  yAxisLabelPopupFontFamily?: string;
  yAxisLabelPopupBorderRadius?: number;
  yAxisLabelPopupPadding?: string;
  yAxisLabelPopupMaxWidth?: number;
  yAxisLabelPopupBoxShadow?: string;
}

export interface BarChartProps extends Omit<SVGAttributes<SVGSVGElement>, 'width' | 'height'> {
  data: StackedBarChartDataPoint[];
  series: BarChartSeries[];
  width?: number;
  height?: number;
  title?: string;
  xAxisLabel?: string;
  xAxisLabelOffset?: number;
  yAxisLabel?: string;
  yAxisLabelOffset?: number;
  orientation?: BarChartOrientation;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom';
  showGrid?: boolean;
  showTooltip?: boolean;
  showTotals?: boolean;
  showIntegersOnly?: boolean;
  barPadding?: number;
  legendItemGap?: number;
  legendItemWidth?: number;
  yAxisLabelMaxWidth?: number;
  yAxisLabelShowPopup?: boolean;
  margin?: BarChartMargin;
  styleProps?: BarChartStyleProps;
  formatCategoryLabel?: (label: string) => string;
  formatValueLabel?: (value: number) => string;
  formatTotalLabel?: (total: number) => string;
  onBarClick?: (dataPoint: StackedBarChartDataPoint, series: string) => void;
  onBarHover?: (dataPoint: StackedBarChartDataPoint | null, series?: string) => void;
  onOpenTooltip?: (dataPoint: StackedBarChartDataPoint, series: string) => string | React.ReactNode;
}

export interface TooltipData {
  dataPoint: StackedBarChartDataPoint;
  series: string;
  value: number;
  x: number;
  y: number;
}

export interface BarChartDimensions {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: BarChartMargin;
}

export type UseBarChartProps = BarChartProps;

export interface D3BandScale {
  domain(): string[];
  range(): number[];
  bandwidth(): number;
  (value: string): number | undefined;
}

export interface D3LinearScale {
  domain(): number[];
  range(): number[];
  ticks(count?: number): number[];
  nice(): D3LinearScale;
  (value: number): number;
}

export interface D3ColorScale {
  domain(): string[];
  range(): string[];
  (value: string): string;
}

export type D3Scale = D3BandScale | D3LinearScale;

export interface StackedDataPoint {
  0: number;
  1: number;
  data: StackedBarChartDataPoint;
}

export interface GridLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface AxisData {
  xAxisTicks: (string | number)[];
  yAxisTicks: (string | number)[];
  gridLines: GridLine[];
}

export interface UseBarChartReturn {
  svgRef: React.RefObject<SVGSVGElement | null>;
  dimensions: BarChartDimensions;
  scales: {
    xScale: D3Scale;
    yScale: D3Scale;
    colorScale: D3ColorScale;
  };
  stackedData: StackedDataPoint[][];
  tooltip: TooltipData | null;
  processedData: (StackedBarChartDataPoint & { total: number })[];
  handleBarClick: (dataPoint: StackedBarChartDataPoint, seriesKey: string) => void;
  handleBarMouseEnter: (event: React.MouseEvent, dataPoint: StackedBarChartDataPoint, seriesKey: string) => void;
  handleBarMouseMove: (event: React.MouseEvent, dataPoint: StackedBarChartDataPoint, seriesKey: string) => void;
  handleBarMouseLeave: () => void;
  formatValue: (value: number) => string;
}
