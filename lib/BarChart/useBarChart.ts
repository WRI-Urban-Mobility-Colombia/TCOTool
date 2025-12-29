import { useCallback, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

import type {
  UseBarChartProps,
  UseBarChartReturn,
  StackedBarChartDataPoint,
  TooltipData,
  BarChartDimensions,
} from './BarChart.types';

const DEFAULT_MARGIN = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 20,
};

const DEFAULT_DIMENSIONS = {
  width: 800,
  height: 400,
};

const BAR_PADDING = 0.1;

export const useBarChart = (props: UseBarChartProps): UseBarChartReturn => {
  const {
    data,
    series,
    width = DEFAULT_DIMENSIONS.width,
    height = DEFAULT_DIMENSIONS.height,
    margin = DEFAULT_MARGIN,
    orientation = 'vertical',
    barPadding = BAR_PADDING,
    showIntegersOnly = false,
    onBarClick,
    onBarHover,
  } = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const dimensions: BarChartDimensions = useMemo(
    () => ({
      width,
      height,
      innerWidth: width - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
      margin,
    }),
    [width, height, margin]
  );

  const processedData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      total: Object.values(d.values).reduce((sum, val) => sum + val, 0),
    }));
  }, [data]);

  const scales = useMemo(() => {
    const maxValue = d3.max(processedData, (d: StackedBarChartDataPoint & { total: number }) => d.total) ?? 0;
    const maxValueWithPadding = maxValue * 1.25;

    let xScale, yScale;

    if (orientation === 'vertical') {
      xScale = d3
        .scaleBand()
        .domain(processedData.map((d) => d.label))
        .range([0, dimensions.innerWidth])
        .padding(barPadding);

      const tempScale = d3.scaleLinear().domain([0, maxValueWithPadding]).range([dimensions.innerHeight, 0]).nice();
      const ticks = tempScale.ticks(5);
      const maxTick = ticks.length > 0 ? Math.max(...ticks) : maxValueWithPadding;

      yScale = d3.scaleLinear().domain([0, maxTick]).range([dimensions.innerHeight, 0]);

      if (showIntegersOnly) {
        yScale.ticks = function (count?: number) {
          const originalTicks = d3.scaleLinear().domain(this.domain()).range(this.range()).nice().ticks(count);

          const integerTicks = [...new Set(originalTicks.map((tick: number) => Math.round(tick)))];
          return integerTicks.sort((a: number, b: number) => a - b);
        };
      }
    } else {
      xScale = d3.scaleLinear().domain([0, maxValueWithPadding]).range([0, dimensions.innerWidth]).nice();

      yScale = d3
        .scaleBand()
        .domain(processedData.map((d) => d.label))
        .range([0, dimensions.innerHeight])
        .padding(barPadding);
    }

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(series.map((s) => s.key))
      .range(series.map((s) => s.color));

    return { xScale, yScale, colorScale };
  }, [processedData, dimensions, series, orientation, barPadding, showIntegersOnly]);

  const stackedData = useMemo(() => {
    const stack = d3
      .stack<StackedBarChartDataPoint>()
      .keys(series.map((s) => s.key))
      .value((d: StackedBarChartDataPoint, key: string) => d.values[key] ?? 0);

    return stack(processedData);
  }, [processedData, series]);

  const handleBarClick = useCallback(
    (dataPoint: StackedBarChartDataPoint, seriesKey: string) => {
      onBarClick?.(dataPoint, seriesKey);
    },
    [onBarClick]
  );

  const handleBarMouseEnter = useCallback(
    (event: React.MouseEvent, dataPoint: StackedBarChartDataPoint, seriesKey: string) => {
      const value = dataPoint.values[seriesKey] ?? 0;

      setTooltip({
        dataPoint,
        series: seriesKey,
        value,
        x: event.clientX,
        y: event.clientY - 20,
      });

      onBarHover?.(dataPoint, seriesKey);
    },
    [onBarHover]
  );

  const handleBarMouseMove = useCallback(
    (event: React.MouseEvent, dataPoint: StackedBarChartDataPoint, seriesKey: string) => {
      const value = dataPoint.values[seriesKey] ?? 0;

      setTooltip({
        dataPoint,
        series: seriesKey,
        value,
        x: event.clientX,
        y: event.clientY - 20,
      });
    },
    []
  );

  const handleBarMouseLeave = useCallback(() => {
    setTooltip(null);
    onBarHover?.(null);
  }, [onBarHover]);

  const formatValue = useCallback(
    (value: number) => {
      if (showIntegersOnly) {
        return d3.format(',')(Math.round(value));
      }
      return d3.format(',')(value);
    },
    [showIntegersOnly]
  );

  return {
    svgRef,
    dimensions,
    scales,
    stackedData,
    tooltip,
    processedData,
    handleBarClick,
    handleBarMouseEnter,
    handleBarMouseMove,
    handleBarMouseLeave,
    formatValue,
  };
};
