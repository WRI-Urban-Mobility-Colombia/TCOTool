import type {
  BarChartDimensions,
  D3Scale,
  D3BandScale,
  D3LinearScale,
  StackedBarChartDataPoint,
  BarChartSeries,
  BarChartOrientation,
  GridLine,
  AxisData,
} from './BarChart.types';
import {
  SPACE_BETWEEN_LABELS_AND_GRAPHIC,
  DEFAULT_LEGEND_ITEM_GAP,
  LEGEND_START_X,
  LEGEND_ICON_WIDTH,
  LEGEND_ICON_TO_TEXT_GAP,
  DEFAULT_TICKS_COUNT,
  DEFAULT_AXIS_Y_WIDTH,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
  MIN_AXIS_WIDTH,
  MIN_AXIS_WIDTH_PADDING,
  TEXT_HEIGHT,
} from './BarChart.constants';

export function getAdjustedDimensions(
  dimensions: BarChartDimensions,
  orientation: BarChartOrientation,
  axisYWidth: number
): BarChartDimensions {
  if (orientation === 'vertical') {
    return {
      ...dimensions,
      innerWidth: dimensions.innerWidth - axisYWidth - SPACE_BETWEEN_LABELS_AND_GRAPHIC,
    };
  }
  return dimensions;
}

export function callScale(scale: D3Scale, value: string | number): number {
  if ('bandwidth' in scale && typeof value === 'string') {
    return (scale as D3BandScale)(value) ?? 0;
  } else if ('ticks' in scale && typeof value === 'number') {
    return (scale as D3LinearScale)(value);
  }
  return 0;
}

export function getBandwidth(scale: D3Scale): number {
  return 'bandwidth' in scale ? scale.bandwidth() : 0;
}

export function measureTextWidth(text: string, fontSize: number, fontFamily: string): number {
  if (typeof document === 'undefined') return 0;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return 0;

  ctx.font = `${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

export function measureTextHeight(text: string, fontSize: number, fontFamily: string): number {
  if (typeof document === 'undefined') return 0;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return 0;

  ctx.font = `${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent ?? fontSize * TEXT_HEIGHT.ASCENT_RATIO;
  const descent = metrics.actualBoundingBoxDescent ?? fontSize * TEXT_HEIGHT.DESCENT_RATIO;
  const height = ascent + descent;
  return height;
}

export function calculateYAxisLabelWidth(
  yAxisLabel: string | undefined,
  axisTextFontSize?: number,
  axisTextFontFamily?: string
): number {
  if (!yAxisLabel) return 0;

  const fontSize = axisTextFontSize ?? DEFAULT_FONT_SIZE;
  const fontFamily = axisTextFontFamily ?? DEFAULT_FONT_FAMILY;
  return measureTextHeight(yAxisLabel, fontSize, fontFamily);
}

export function calculateAxisYWidth(
  orientation: BarChartOrientation,
  yScale: D3Scale,
  formatValue: (value: number) => string,
  formatValueLabel?: (value: number) => string,
  axisTextFontSize?: number,
  axisTextFontFamily?: string,
  formatLargeValueFn?: (value: number, baseFormatter: (value: number) => string, maxValue: number) => string
): number {
  if (orientation !== 'vertical') return DEFAULT_AXIS_Y_WIDTH;

  const fontSize = axisTextFontSize ?? DEFAULT_FONT_SIZE;
  const fontFamily = axisTextFontFamily ?? DEFAULT_FONT_FAMILY;

  const yTicks = 'ticks' in yScale ? yScale.ticks(DEFAULT_TICKS_COUNT) : [];

  if (yTicks.length === 0) return DEFAULT_AXIS_Y_WIDTH;

  const formatLabelForMeasurement = (value: number): string => {
    const maxValue = Math.max(...yTicks);
    const baseFormatter = formatValueLabel ?? formatValue;

    if (formatLargeValueFn) {
      return formatLargeValueFn(value, baseFormatter, maxValue);
    }

    return baseFormatter(value);
  };

  const labelWidths = yTicks.map((tick: number) => {
    const formattedLabel = formatLabelForMeasurement(tick);
    return measureTextWidth(formattedLabel, fontSize, fontFamily);
  });

  const maxWidth = Math.max(...labelWidths);
  const calculatedWidth = Math.max(MIN_AXIS_WIDTH, Math.ceil(maxWidth) + MIN_AXIS_WIDTH_PADDING);

  return calculatedWidth;
}

export function isTopBar(seriesIndex: number, dataPoint: StackedBarChartDataPoint, series: BarChartSeries[]): boolean {
  for (let j = seriesIndex + 1; j < series.length; j++) {
    const nextSeriesValue = dataPoint.values[series[j].key] ?? 0;
    if (nextSeriesValue > 0) {
      return false;
    }
  }
  return true;
}

export function calculateLegendItemWidths(
  series: BarChartSeries[],
  formatCategoryFn: (label: string) => string,
  legendItemWidth: number,
  ctx: CanvasRenderingContext2D | null
): number[] {
  return series.map((s) => {
    const label = formatCategoryFn(s.label);
    const textWidth = ctx ? ctx.measureText(label).width : 0;
    const autoWidth = LEGEND_ICON_WIDTH + LEGEND_ICON_TO_TEXT_GAP + textWidth;
    return Math.max(legendItemWidth ?? 0, autoWidth);
  });
}

export function calculateLegendItems(
  series: BarChartSeries[],
  formatCategoryFn: (label: string) => string,
  legendItemGap: number,
  legendItemWidth: number,
  ctx: CanvasRenderingContext2D | null
): Array<BarChartSeries & { x: number; y: number }> {
  const itemWidths = calculateLegendItemWidths(series, formatCategoryFn, legendItemWidth, ctx);

  return series.reduce(
    (acc, s, i) => {
      const gapBetweenItems = legendItemGap > 0 ? legendItemGap : DEFAULT_LEGEND_ITEM_GAP;
      const x = i === 0 ? LEGEND_START_X : acc.lastX + itemWidths[i - 1] + gapBetweenItems;
      const item = { ...s, x, y: 0 } as typeof s & {
        x: number;
        y: number;
      };
      return {
        items: [...acc.items, item],
        lastX: x,
      };
    },
    {
      items: [] as Array<BarChartSeries & { x: number; y: number }>,
      lastX: LEGEND_START_X,
    }
  ).items;
}

export function calculateLegendPositions(
  measuredWidths: number[],
  legendItemGap: number,
  chartWidth: number,
  marginLeft: number,
  axisYWidth: number
): number[] {
  const gapBetweenItems = legendItemGap > 0 ? legendItemGap : DEFAULT_LEGEND_ITEM_GAP;
  const totalWidth =
    measuredWidths.reduce((sum, w) => sum + w, 0) + Math.max(0, measuredWidths.length - 1) * gapBetweenItems;
  const startX = Math.max(0, chartWidth / 2 - totalWidth / 2 - (marginLeft + axisYWidth));
  const positions = measuredWidths.reduce(
    (acc, w, i) => {
      const x = i === 0 ? startX : acc.positions[i - 1] + acc.widths[i - 1] + gapBetweenItems;
      return {
        positions: [...acc.positions, x],
        widths: [...acc.widths, w],
      };
    },
    { positions: [] as number[], widths: [] as number[] }
  ).positions;

  return positions;
}

export function getAxisData(
  orientation: BarChartOrientation,
  adjustedXScale: D3Scale,
  yScale: D3Scale,
  adjustedDimensions: BarChartDimensions,
  callScaleFn: (scale: D3Scale, value: string | number) => number
): AxisData {
  if (orientation === 'vertical') {
    const yTicks = 'ticks' in yScale ? yScale.ticks(DEFAULT_TICKS_COUNT) : [];
    return {
      xAxisTicks: adjustedXScale.domain(),
      yAxisTicks: yTicks,
      gridLines: yTicks.map(
        (tick: number): GridLine => ({
          x1: 0,
          y1: callScaleFn(yScale, tick),
          x2: adjustedDimensions.innerWidth,
          y2: callScaleFn(yScale, tick),
        })
      ),
    };
  } else {
    const xTicks = 'ticks' in adjustedXScale ? adjustedXScale.ticks(DEFAULT_TICKS_COUNT) : [];
    return {
      xAxisTicks: xTicks,
      yAxisTicks: yScale.domain(),
      gridLines: xTicks.map(
        (tick: number): GridLine => ({
          x1: callScaleFn(adjustedXScale, tick),
          y1: 0,
          x2: callScaleFn(adjustedXScale, tick),
          y2: adjustedDimensions.innerHeight,
        })
      ),
    };
  }
}

export function getSvgStyles(
  dimensions: BarChartDimensions,
  axisYWidth: number,
  axisTextColor: string,
  axisTextFontSize: number,
  axisTextFontFamily: string
) {
  return {
    viewBox: {
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
    },
    line: {
      x1: dimensions.width / 2,
      y1: 0,
      x2: dimensions.width / 2,
      y2: dimensions.height,
    },
    axisYLabels: {
      x: dimensions.margin.left,
      y: dimensions.margin.top,
    },
    innerContainerGraphic: {
      x: dimensions.margin.left + axisYWidth + SPACE_BETWEEN_LABELS_AND_GRAPHIC,
      y: dimensions.margin.top,
      width: dimensions.innerWidth - axisYWidth - SPACE_BETWEEN_LABELS_AND_GRAPHIC,
      height: dimensions.innerHeight,
      fill: 'none' as const,
    },
    axisXText: {
      x: dimensions.width / 2 - dimensions.margin.left - axisYWidth - SPACE_BETWEEN_LABELS_AND_GRAPHIC,
      y: dimensions.innerHeight + dimensions.margin.bottom - axisTextFontSize / 2,
      fill: axisTextColor,
      fontSize: axisTextFontSize,
      fontFamily: axisTextFontFamily,
    },
  };
}
