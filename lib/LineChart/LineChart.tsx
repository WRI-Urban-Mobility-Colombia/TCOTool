'use client';

import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { createPortal } from 'react-dom';
import { ChartsTooltip } from '@/app/components/ChartsTooltip';
import type { LineChartProps, LineChartTooltip } from './LineChart.types';
import {
  SPACE_BETWEEN_LABELS_AND_GRAPHIC,
  DEFAULT_MARGIN,
  DEFAULT_DIMENSIONS,
  FONT,
  AXIS,
  GRID_LINE,
  TEXT as TEXT_STYLES,
  LINE,
  MARKER,
  LEGEND,
  CALCULATION,
} from './LineChart.constants';
import { formatLargeValue } from '@/lib/utils/formatters';

export function LineChart({
  data,
  series,
  width = DEFAULT_DIMENSIONS.width,
  height = DEFAULT_DIMENSIONS.height,
  xAxisLabel,
  yAxisLabel,
  margins,
  formatValueLabel,
  className,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<LineChartTooltip | null>(null);

  const margin = useMemo(
    () => ({
      top: DEFAULT_MARGIN.TOP,
      right: DEFAULT_MARGIN.RIGHT,
      bottom: DEFAULT_MARGIN.BOTTOM,
      left: DEFAULT_MARGIN.LEFT,
      ...margins,
    }),
    [margins]
  );

  const dimensions = useMemo(
    () => ({
      width,
      height,
      innerWidth: width - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
    }),
    [width, height, margin]
  );

  const maxYAxisValue = useMemo(() => {
    const allValues = data.flatMap((d) => [d.diesel, d.gnv, d.electric]);
    const maxValue = d3.max(allValues) ?? 0;
    const minValue = d3.min(allValues) ?? 0;
    return maxValue + minValue;
  }, [data]);

  const formatValue = useMemo(
    () => (value: number) => (formatValueLabel ? formatValueLabel(value) : d3.format(',')(value)),
    [formatValueLabel]
  );

  const measureTextWidth = React.useCallback((text: string, fontSize: number, fontFamily: string): number => {
    if (typeof document === 'undefined') return 0;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return 0;

    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  }, []);

  const { maxYAxisTick, niceStep } = useMemo(() => {
    if (maxYAxisValue <= 0) return { maxYAxisTick: 0, niceStep: 1 };

    const approximateStep = maxYAxisValue * CALCULATION.APPROXIMATE_STEP_FACTOR;
    const magnitude = Math.pow(10, Math.floor(Math.log10(approximateStep)) - 1);
    const normalized = approximateStep / magnitude;
    const roundedNormalized = Math.round(normalized);
    const step = roundedNormalized * magnitude;
    const maxTick = Math.ceil(maxYAxisValue / step) * step;
    return { maxYAxisTick: maxTick, niceStep: step };
  }, [maxYAxisValue]);

  const axisYWidth = useMemo(() => {
    if (maxYAxisValue <= 0) return AXIS.MIN_WIDTH;

    const ticks: number[] = [];
    for (let value = 0; value <= maxYAxisTick; value += niceStep) {
      ticks.push(Math.round(value));
    }

    if (ticks.length === 0) return AXIS.MIN_WIDTH;

    const labelWidths = ticks.map((tick: number) => {
      const formattedLabel = formatLargeValue(tick, formatValue, maxYAxisValue);
      return measureTextWidth(formattedLabel, FONT.SIZE, FONT.FAMILY);
    });

    const maxWidth = Math.max(...labelWidths);
    const calculatedWidth = Math.max(AXIS.MIN_WIDTH, Math.ceil(maxWidth) + AXIS.MIN_WIDTH_PADDING);

    return calculatedWidth;
  }, [maxYAxisValue, maxYAxisTick, niceStep, formatValue, measureTextWidth]);

  const adjustedDimensions = useMemo(() => {
    return {
      ...dimensions,
      innerWidth: dimensions.innerWidth - axisYWidth - SPACE_BETWEEN_LABELS_AND_GRAPHIC,
    };
  }, [dimensions, axisYWidth]);

  const scales = useMemo(() => {
    const years = data.map((d) => d.year);
    const minYear = d3.min(years) ?? 0;
    const maxYear = d3.max(years) ?? 0;
    const yearRange = maxYear - minYear;
    const padding = yearRange > 0 ? yearRange * CALCULATION.YEAR_PADDING_FACTOR : CALCULATION.DEFAULT_YEAR_PADDING;

    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear + padding])
      .range([0, adjustedDimensions.innerWidth]);

    const yScale = d3.scaleLinear().domain([0, maxYAxisTick]).range([dimensions.innerHeight, 0]);

    return { xScale, yScale, maxYAxisValue };
  }, [data, adjustedDimensions.innerWidth, dimensions.innerHeight, maxYAxisTick, maxYAxisValue]);

  const lineGenerators = useMemo(() => {
    return series.map((s) => {
      const line = d3
        .line<LineChartProps['data'][0]>()
        .x((d) => scales.xScale(d.year))
        .y((d) => {
          const value = d[s.key as keyof LineChartProps['data'][0]] as number | null | undefined;
          return scales.yScale(value as number);
        })
        .defined((d) => {
          const value = d[s.key as keyof LineChartProps['data'][0]] as number | null | undefined;
          return value !== null && value !== undefined && !isNaN(value);
        })
        .curve(d3.curveLinear);

      return { series: s, line };
    });
  }, [series, scales]);

  const formatYAxisLabel = useMemo(() => {
    return (value: number) => formatLargeValue(value, formatValue, maxYAxisValue);
  }, [maxYAxisValue, formatValue]);

  const yTicks = useMemo(() => {
    if (maxYAxisValue <= 0) return [0];

    const ticks = [];
    for (let value = 0; value <= maxYAxisTick; value += niceStep) {
      ticks.push(Math.round(value));
    }

    return ticks;
  }, [maxYAxisValue, maxYAxisTick, niceStep]);

  const xTicks = useMemo(() => {
    return scales.xScale.ticks(data.length);
  }, [scales.xScale, data.length]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const yAxisLabelsContainer = g
      .append('g')
      .attr('transform', `translate(0, 0)`)
      .attr('class', 'y-axis-labels-container');

    const chartContainer = g
      .append('g')
      .attr('transform', `translate(${axisYWidth + SPACE_BETWEEN_LABELS_AND_GRAPHIC}, 0)`)
      .attr('class', 'chart-container');

    chartContainer
      .selectAll('.grid-line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', adjustedDimensions.innerWidth)
      .attr('y1', (d) => scales.yScale(d))
      .attr('y2', (d) => scales.yScale(d))
      .attr('stroke', GRID_LINE.COLOR)
      .attr('stroke-width', GRID_LINE.STROKE_WIDTH);

    yAxisLabelsContainer
      .selectAll('.y-axis-label')
      .data(yTicks)
      .enter()
      .append('g')
      .attr('class', 'y-axis-label')
      .attr('transform', (d) => `translate(0, ${scales.yScale(d)})`)
      .each(function (d) {
        const group = d3.select(this);
        const text = group
          .append('text')
          .attr('x', axisYWidth + AXIS.TEXT_OFFSET_X)
          .attr('y', 0)
          .attr('fill', TEXT_STYLES.COLOR)
          .attr('font-size', FONT.SIZE)
          .attr('font-family', FONT.FAMILY)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .text(formatYAxisLabel(d));

        const bbox = text.node()?.getBBox();
        if (bbox && bbox.width > axisYWidth) {
          text.attr('textLength', axisYWidth - AXIS.TEXT_LENGTH_ADJUSTMENT).attr('lengthAdjust', 'spacingAndGlyphs');
        }
      });

    chartContainer
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', dimensions.innerHeight)
      .attr('stroke', GRID_LINE.COLOR)
      .attr('stroke-width', GRID_LINE.STROKE_WIDTH);

    const xAxis = chartContainer.append('g').attr('transform', `translate(0, ${dimensions.innerHeight})`);
    xAxis
      .call(d3.axisBottom(scales.xScale).tickFormat(d3.format('d')).tickSize(0))
      .selectAll('text')
      .attr('fill', TEXT_STYLES.COLOR)
      .attr('font-size', FONT.SIZE)
      .attr('font-family', FONT.FAMILY)
      .attr('dy', 10);
    xAxis.selectAll('path').attr('stroke', GRID_LINE.COLOR);
    xAxis.selectAll('line').remove();

    if (xAxisLabel) {
      g.append('text')
        .attr('x', width / 2 - margin.left - axisYWidth / 2 - SPACE_BETWEEN_LABELS_AND_GRAPHIC / 2)
        .attr('y', dimensions.innerHeight + margin.bottom - AXIS.X_LABEL_OFFSET_Y)
        .attr('fill', TEXT_STYLES.COLOR)
        .attr('font-size', FONT.SIZE)
        .attr('font-family', FONT.FAMILY)
        .attr('text-anchor', 'middle')
        .text(xAxisLabel);
    }

    if (yAxisLabel) {
      const labelText = g
        .append('text')
        .attr('x', -dimensions.innerHeight / 2)
        .attr('y', -margin.left + FONT.Y_AXIS_LABEL_SIZE)
        .attr('fill', TEXT_STYLES.COLOR)
        .attr('font-size', FONT.Y_AXIS_LABEL_SIZE)
        .attr('font-family', FONT.FAMILY)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text(yAxisLabel);

      const textNode = labelText.node();
      if (textNode) {
        const bbox = textNode.getBBox();
        labelText.attr('y', -margin.left + bbox.height);
      }
    }

    if (data.length > 0) {
      lineGenerators.forEach(({ series: s, line }) => {
        const lastDataPoint = data[data.length - 1];
        const lastValue = lastDataPoint?.[s.key as keyof LineChartProps['data'][0]] as number | null | undefined;

        if (lastValue === null || lastValue === undefined || isNaN(lastValue)) {
          const pathData = line(data);
          if (pathData) {
            chartContainer
              .append('path')
              .datum(data)
              .attr('fill', 'none')
              .attr('stroke', s.color)
              .attr('stroke-width', LINE.STROKE_WIDTH)
              .attr('d', pathData);
          }
          return;
        }

        const extendedData = [
          ...data,
          {
            ...lastDataPoint,
            year: scales.xScale.domain()[1],
          },
        ];
        const extendedLine = d3
          .line<LineChartProps['data'][0]>()
          .x((d) => scales.xScale(d.year))
          .y((d) => {
            const value = d[s.key as keyof LineChartProps['data'][0]] as number | null | undefined;
            return scales.yScale(value as number);
          })
          .defined((d) => {
            const value = d[s.key as keyof LineChartProps['data'][0]] as number | null | undefined;
            return value !== null && value !== undefined && !isNaN(value);
          })
          .curve(d3.curveLinear);
        const pathData = extendedLine(extendedData);
        if (!pathData) return;

        chartContainer
          .append('path')
          .datum(extendedData)
          .attr('fill', 'none')
          .attr('stroke', s.color)
          .attr('stroke-width', LINE.STROKE_WIDTH)
          .attr('d', pathData);
      });

      lineGenerators.forEach(({ series: s }) => {
        const markerGroup = chartContainer.append('g').attr('class', `markers-${s.key}`);

        data.forEach((d) => {
          const rawValue = d[s.key as keyof typeof d];
          let value: number | null = null;

          if (typeof rawValue === 'number' && !isNaN(rawValue)) {
            value = rawValue;
          } else if (typeof rawValue === 'string') {
            const parsed = +rawValue;
            if (!isNaN(parsed)) {
              value = parsed;
            }
          }

          if (value === null) {
            return;
          }

          const x = scales.xScale(d.year);
          const y = scales.yScale(value);

          if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
            return;
          }

          const marker = markerGroup.append('g').attr('transform', `translate(${x}, ${y})`);

          if (s.markerType === 'circle') {
            marker.append('circle').attr('r', MARKER.CIRCLE_RADIUS).attr('fill', s.color);
          } else if (s.markerType === 'square') {
            marker
              .append('rect')
              .attr('x', -MARKER.SQUARE_OFFSET)
              .attr('y', -MARKER.SQUARE_OFFSET)
              .attr('width', MARKER.SQUARE_SIZE)
              .attr('height', MARKER.SQUARE_SIZE)
              .attr('fill', s.color)
              .attr('rx', MARKER.SQUARE_RX);
          } else if (s.markerType === 'triangle') {
            const size = MARKER.TRIANGLE_SIZE;
            const trianglePoints = `0,-${size} ${size},${size} -${size},${size}`;
            marker
              .append('polygon')
              .attr('points', trianglePoints)
              .attr('fill', s.color)
              .attr('shape-rendering', 'geometricPrecision')
              .attr('stroke', 'none');
          } else if (s.markerType === 'diamond') {
            const size = MARKER.DIAMOND_SIZE;
            const diamondPoints = `0,-${size} ${size},0 0,${size} -${size},0`;
            marker
              .append('polygon')
              .attr('points', diamondPoints)
              .attr('fill', s.color)
              .attr('shape-rendering', 'geometricPrecision')
              .attr('stroke', 'none');
          } else {
            marker.append('circle').attr('r', MARKER.CIRCLE_RADIUS).attr('fill', s.color);
          }

          const hitArea = marker
            .append('circle')
            .attr('r', MARKER.HIT_AREA_RADIUS)
            .attr('fill', 'transparent')
            .attr('cursor', 'pointer')
            .style('pointer-events', 'all');

          const getPointPosition = () => {
            if (!svgRef.current) return { x: 0, y: 0 };
            const svg = svgRef.current;
            const svgRect = svg.getBoundingClientRect();

            const viewBoxX = 0;
            const viewBoxY = 0;
            const viewBoxWidth = width;
            const viewBoxHeight = height;

            const scaleX = svgRect.width / viewBoxWidth;
            const scaleY = svgRect.height / viewBoxHeight;

            const pointInViewBoxX = x + axisYWidth + margin.left - viewBoxX;
            const pointInViewBoxY = y + margin.top - viewBoxY;

            const screenX = svgRect.left + pointInViewBoxX * scaleX;
            const screenY = svgRect.top + pointInViewBoxY * scaleY - MARKER.HIT_AREA_OFFSET_Y;

            return { x: screenX, y: screenY };
          };

          hitArea
            .on('mouseenter', function () {
              const pos = getPointPosition();
              setTooltip({
                label: s.label,
                value: formatValue(value),
                color: s.color,
                x: pos.x,
                y: pos.y,
                year: d.year,
              });
            })
            .on('mouseleave', () => {
              setTooltip(null);
            });

          hitArea.on('click', function () {
            const pos = getPointPosition();
            setTooltip({
              label: s.label,
              value: formatValue(value),
              color: s.color,
              x: pos.x,
              y: pos.y,
              year: d.year,
            });
          });
        });
      });
    }

    const legendGroup = g.append('g').attr('transform', `translate(0, -${margin.top - LEGEND.OFFSET_Y})`);

    const tempSvg = d3.select('body').append('svg').style('visibility', 'hidden').style('position', 'absolute');
    const tempText = tempSvg.append('text').attr('font-size', FONT.SIZE).attr('font-family', FONT.FAMILY);

    const legendItemWidths = series.map((s) => {
      const textNode = tempText.text(s.label).node();
      const textWidth = textNode ? (textNode.getBBox?.()?.width ?? 0) : 0;
      const minItemWidth = LEGEND.ICON_WIDTH + LEGEND.ICON_TO_TEXT_GAP + textWidth;
      return minItemWidth;
    });

    tempSvg.remove();

    const totalWidth = legendItemWidths.reduce((sum, w) => sum + w, 0) + (series.length - 1) * LEGEND.ITEM_GAP;
    const centerX = width / 2;
    const startX = centerX - totalWidth / 2;
    let currentX = startX - margin.left;

    series.forEach((s, i) => {
      const item = legendGroup.append('g').attr('transform', `translate(${currentX}, 0)`);
      const iconGroup = item
        .append('g')
        .attr('transform', `translate(${LEGEND.CIRCLE_RADIUS}, ${LEGEND.TEXT_OFFSET_Y})`);

      if (s.markerType === 'circle') {
        iconGroup.append('circle').attr('r', LEGEND.CIRCLE_RADIUS).attr('fill', s.color);
      } else if (s.markerType === 'square') {
        const offset = LEGEND.SQUARE_SIZE / 2;
        iconGroup
          .append('rect')
          .attr('x', -offset)
          .attr('y', -offset)
          .attr('width', LEGEND.SQUARE_SIZE)
          .attr('height', LEGEND.SQUARE_SIZE)
          .attr('fill', s.color)
          .attr('rx', LEGEND.SQUARE_RX);
      } else if (s.markerType === 'triangle') {
        const size = LEGEND.CIRCLE_RADIUS;
        const trianglePoints = `0,-${size} ${size},${size} -${size},${size}`;
        iconGroup
          .append('polygon')
          .attr('points', trianglePoints)
          .attr('fill', s.color)
          .attr('shape-rendering', 'geometricPrecision')
          .attr('stroke', 'none');
      } else if (s.markerType === 'diamond') {
        const size = LEGEND.CIRCLE_RADIUS;
        const diamondPoints = `0,-${size} ${size},0 0,${size} -${size},0`;
        iconGroup
          .append('polygon')
          .attr('points', diamondPoints)
          .attr('fill', s.color)
          .attr('shape-rendering', 'geometricPrecision')
          .attr('stroke', 'none');
      }

      item
        .append('text')
        .attr('x', LEGEND.TEXT_OFFSET_X)
        .attr('y', LEGEND.TEXT_OFFSET_Y)
        .attr('fill', TEXT_STYLES.COLOR)
        .attr('font-size', FONT.SIZE)
        .attr('font-family', FONT.FAMILY)
        .attr('dominant-baseline', 'central')
        .text(s.label);

      currentX += legendItemWidths[i] + LEGEND.ITEM_GAP;
    });
  }, [
    data,
    series,
    scales,
    dimensions,
    adjustedDimensions,
    axisYWidth,
    lineGenerators,
    xAxisLabel,
    yAxisLabel,
    formatValue,
    formatYAxisLabel,
    yTicks,
    xTicks,
    width,
    height,
    margin,
  ]);

  return (
    <div className={className} style={{ width: '100%', position: 'relative' }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          overflow: 'visible',
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
        }}
      />
      {tooltip &&
        typeof document !== 'undefined' &&
        createPortal(
          <ChartsTooltip
            label={tooltip.label}
            value={tooltip.value}
            color={tooltip.color}
            x={tooltip.x}
            y={tooltip.y}
            year={tooltip.year}
          />,
          document.body
        )}
    </div>
  );
}
