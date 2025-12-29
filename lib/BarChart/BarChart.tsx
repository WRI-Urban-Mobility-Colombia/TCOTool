import React, { useMemo, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { flushSync } from 'react-dom';
import * as d3 from 'd3';
import { ChartsTooltip } from '@/app/components/ChartsTooltip';
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
  DEFAULT_TICKS_COUNT,
  MILLION_THRESHOLD,
  DEFAULT_TITLE_FONT_SIZE,
  DEFAULT_TITLE_FONT_WEIGHT,
  DEFAULT_TITLE_COLOR,
  DEFAULT_AXIS_TEXT_COLOR,
  DEFAULT_GRID_LINE_COLOR,
  DEFAULT_GRID_LINE_STROKE_WIDTH,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_TOTAL_TEXT_COLOR,
  DEFAULT_TOTAL_TEXT_FONT_SIZE,
  DEFAULT_BAR_OUTLINE_STYLE,
  ROUNDED_BAR_RADIUS,
  MIN_BAR_HEIGHT_FOR_TEXT,
  MIN_BAR_WIDTH_FOR_TEXT,
  TEXT_OFFSET_Y_AXIS,
  TEXT_OFFSET_Y_TOTAL,
  TEXT_OFFSET_X_AXIS,
  BAR_TEXT_FONT_SIZE,
  LEGEND_RECT_SIZE,
  LEGEND_TEXT_OFFSET_X,
  LEGEND_TEXT_OFFSET_Y,
  TEXT_HEIGHT,
} from './BarChart.constants';
import { formatLargeValue } from '@/lib/utils/formatters';
import type { BarChartProps, StackedDataPoint, StackedBarChartDataPoint } from './BarChart.types';
import { useBarChart } from './useBarChart';
import {
  getAdjustedDimensions,
  callScale,
  getBandwidth,
  isTopBar as isTopBarUtil,
  calculateLegendItems,
  calculateLegendPositions,
  getAxisData,
  getSvgStyles,
  calculateAxisYWidth,
  calculateYAxisLabelWidth,
} from './BarChart.utils';

function BarChart({
  data,
  series,
  title,
  xAxisLabel,
  xAxisLabelOffset,
  yAxisLabel,
  yAxisLabelOffset,
  orientation = 'vertical',
  showLegend = true,
  legendPosition = 'bottom',
  showGrid = true,
  showTooltip = true,
  showTotals = false,
  showIntegersOnly = false,
  barPadding = 0.1,
  legendItemGap = 0,
  legendItemWidth = 0,
  styleProps = {},
  formatCategoryLabel,
  formatValueLabel,
  formatTotalLabel,
  className,
  onOpenTooltip,
  ...svgProps
}: BarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{
    dataPointId: string;
    seriesKey: string;
  } | null>(null);
  const [customTooltip, setCustomTooltip] = useState<{
    dataPoint: StackedBarChartDataPoint;
    seriesKey: string;
    content: string | React.ReactNode;
    x: number;
    y: number;
  } | null>(null);

  const {
    svgRef,
    dimensions,
    scales,
    stackedData,
    tooltip,
    processedData,
    formatValue,
    handleBarMouseEnter,
    handleBarMouseMove,
    handleBarMouseLeave,
  } = useBarChart({
    data,
    series,
    title,
    xAxisLabel,
    xAxisLabelOffset,
    yAxisLabel,
    yAxisLabelOffset,
    orientation,
    showLegend,
    showGrid,
    showTooltip,
    showTotals,
    showIntegersOnly,
    barPadding,
    styleProps,
    ...svgProps,
  });

  const { xScale, yScale } = scales;

  const axisYValuesWidth = calculateAxisYWidth(
    orientation,
    yScale,
    formatValue,
    formatValueLabel,
    styleProps.axisTextFontSize,
    styleProps.axisTextFontFamily,
    formatLargeValue
  );

  const yAxisLabelWidth = calculateYAxisLabelWidth(
    yAxisLabel,
    styleProps.axisTextFontSize,
    styleProps.axisTextFontFamily
  );

  const additionalPadding = yAxisLabelWidth ? TEXT_HEIGHT.ADDITIONAL_PADDING : 0;
  const axisYWidth = axisYValuesWidth + yAxisLabelWidth + additionalPadding;

  const adjustedDimensions = useMemo(
    () => getAdjustedDimensions(dimensions, orientation, axisYWidth),
    [dimensions, orientation, axisYWidth]
  );

  const adjustedXScale = useMemo(() => {
    if (orientation === 'vertical' && 'bandwidth' in xScale) {
      return (xScale as d3.ScaleBand<string>).copy().range([0, adjustedDimensions.innerWidth]);
    }
    return xScale;
  }, [xScale, orientation, adjustedDimensions.innerWidth]);

  const axisData = useMemo(
    () => getAxisData(orientation, adjustedXScale, yScale, adjustedDimensions, callScale),
    [adjustedXScale, yScale, orientation, adjustedDimensions]
  );

  const formatCategory = useMemo(
    () => (label: string) => (formatCategoryLabel ? formatCategoryLabel(label) : label),
    [formatCategoryLabel]
  );

  const formatNumeric = useMemo(
    () => (value: number) => (formatValueLabel ? formatValueLabel(value) : formatValue(value)),
    [formatValueLabel, formatValue]
  );

  const formatYAxisLabel = useMemo(() => {
    if (orientation === 'vertical' && 'ticks' in yScale) {
      const yTicks = yScale.ticks(DEFAULT_TICKS_COUNT);
      const maxValue = Math.max(...yTicks);

      if (maxValue > MILLION_THRESHOLD) {
        return (value: number) => formatLargeValue(value, formatNumeric, maxValue);
      }
    }
    return formatNumeric;
  }, [orientation, yScale, formatNumeric]);

  const formatTotal = useMemo(
    () => (value: number) => (formatTotalLabel ? formatTotalLabel(value) : formatNumeric(value)),
    [formatTotalLabel, formatNumeric]
  );

  const handleCustomMouseEnter = useCallback(
    (dataPoint: StackedBarChartDataPoint, seriesKey: string, event: React.MouseEvent) => {
      const rect = event.currentTarget.getBoundingClientRect();

      if (onOpenTooltip) {
        const content = onOpenTooltip(dataPoint, seriesKey);

        flushSync(() => {
          setHoveredBar({ dataPointId: dataPoint.id, seriesKey });
          setCustomTooltip({
            dataPoint,
            seriesKey,
            content,
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
        });
      }
    },
    [onOpenTooltip]
  );

  const handleCustomMouseLeave = useCallback(() => {
    flushSync(() => {
      setHoveredBar(null);
      setCustomTooltip(null);
    });
  }, []);

  const legendItems = useMemo(() => {
    const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    const ctx: CanvasRenderingContext2D | null = canvas ? canvas.getContext('2d') : null;

    return calculateLegendItems(series, formatCategory, legendItemGap, legendItemWidth, ctx);
  }, [series, legendItemGap, legendItemWidth, formatCategory]);

  const [legendPositions, setLegendPositions] = useState<number[] | null>(null);
  const legendItemRefs = useRef<Array<SVGGElement | null>>([]);

  useLayoutEffect(() => {
    if (!showLegend) {
      return;
    }

    const refs = legendItemRefs.current;
    if (!refs || refs.length === 0) return;

    const measuredWidths = refs.map((el) => (el ? el.getBBox().width : 0));
    if (measuredWidths.some((w) => !isFinite(w) || w <= 0)) return;

    const positions = calculateLegendPositions(
      measuredWidths,
      legendItemGap,
      dimensions.width,
      dimensions.margin.left,
      axisYWidth
    );

    setLegendPositions((prev) => {
      if (!prev || prev.length !== positions.length || prev.some((p, i) => p !== positions[i])) {
        return positions;
      }
      return prev;
    });
  }, [series, showLegend, legendItemGap, dimensions.width, dimensions.margin.left, axisYWidth]);

  const {
    titleColor = DEFAULT_TITLE_COLOR,
    titleFontSize = DEFAULT_TITLE_FONT_SIZE,
    titleFontWeight = DEFAULT_TITLE_FONT_WEIGHT,
    titleFontFamily = DEFAULT_FONT_FAMILY,
    axisTextColor = DEFAULT_AXIS_TEXT_COLOR,
    axisTextFontSize = DEFAULT_FONT_SIZE,
    axisTextFontFamily = DEFAULT_FONT_FAMILY,
    gridLineColor = DEFAULT_GRID_LINE_COLOR,
    gridLineStrokeWidth = DEFAULT_GRID_LINE_STROKE_WIDTH,
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    totalTextColor = DEFAULT_TOTAL_TEXT_COLOR,
    totalTextFontSize = DEFAULT_TOTAL_TEXT_FONT_SIZE,
    totalTextFontFamily = DEFAULT_FONT_FAMILY,
    barOutlineStyle = DEFAULT_BAR_OUTLINE_STYLE,
  } = styleProps;

  const svgStyles = useMemo(
    () => getSvgStyles(dimensions, axisYWidth, axisTextColor, axisTextFontSize, axisTextFontFamily),
    [dimensions, axisYWidth, axisTextColor, axisTextFontSize, axisTextFontFamily]
  );

  return (
    <div className={className} style={{ backgroundColor, position: 'relative', width: '100%' }}>
      {title && (
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: titleFontSize,
              fontWeight: titleFontWeight,
              fontFamily: titleFontFamily,
              color: titleColor,
            }}
          >
            {title}
          </h3>
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        viewBox={`${svgStyles.viewBox.x} ${svgStyles.viewBox.y} ${svgStyles.viewBox.width} ${svgStyles.viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Bar chart visualization"
        style={{ overflow: 'visible', display: 'block', width: '100%', height: 'auto' }}
        {...svgProps}
      >
        {orientation === 'vertical' && (
          <g transform={`translate(${svgStyles.axisYLabels.x}, ${svgStyles.axisYLabels.y})`}>
            {axisData.yAxisTicks.map((tick: string | number) => {
              const fullLabel = formatYAxisLabel(tick as number);
              const displayLabel = fullLabel;
              const isTruncated = fullLabel !== displayLabel;

              return (
                <g key={tick} transform={`translate(0, ${callScale(yScale, tick)})`}>
                  <text
                    x={axisYWidth + TEXT_OFFSET_Y_AXIS}
                    y={0}
                    fill={axisTextColor}
                    fontSize={axisTextFontSize}
                    fontFamily={axisTextFontFamily}
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={{ cursor: isTruncated ? 'pointer' : 'default' }}
                  >
                    {displayLabel}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        <g transform={`translate(${svgStyles.innerContainerGraphic.x}, ${svgStyles.innerContainerGraphic.y})`}>
          {showGrid && (
            <g>
              {axisData.gridLines.map((line, i: number) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={gridLineColor}
                  strokeWidth={gridLineStrokeWidth}
                />
              ))}
            </g>
          )}

          <g>
            {stackedData.map((seriesData, seriesIndex) => {
              const seriesKey = series[seriesIndex].key;
              const seriesColor = series[seriesIndex].color;

              return seriesData.map((d: StackedDataPoint, i: number) => {
                const dataPoint = processedData[i];
                const segmentValue = dataPoint.values[seriesKey] ?? 0;

                let x, y, width, height;

                if (orientation === 'vertical') {
                  x = callScale(adjustedXScale, dataPoint.label);
                  y = callScale(yScale, d[1]);
                  width = getBandwidth(adjustedXScale);
                  height = Math.max(0, callScale(yScale, d[0]) - callScale(yScale, d[1]));
                } else {
                  x = callScale(adjustedXScale, d[0]);
                  y = callScale(yScale, dataPoint.label);
                  width = Math.max(0, callScale(adjustedXScale, d[1]) - callScale(adjustedXScale, d[0]));
                  height = getBandwidth(yScale);
                }

                if (segmentValue === 0 || (orientation === 'vertical' ? height <= 0 : width <= 0)) {
                  return null;
                }

                const isTopBar = isTopBarUtil(seriesIndex, dataPoint, series);

                const isHovered =
                  hoveredBar && hoveredBar.dataPointId === dataPoint.id && hoveredBar.seriesKey === seriesKey;

                if (isTopBar && orientation === 'vertical') {
                  const path = `M ${x} ${y + height}
                    L ${x} ${y + ROUNDED_BAR_RADIUS}
                    Q ${x} ${y} ${x + ROUNDED_BAR_RADIUS} ${y}
                    L ${x + width - ROUNDED_BAR_RADIUS} ${y}
                    Q ${x + width} ${y} ${x + width} ${y + ROUNDED_BAR_RADIUS}
                    L ${x + width} ${y + height}
                    Z`;

                  return (
                    <g key={`${seriesKey}-${dataPoint.id}`}>
                      <path
                        d={path}
                        fill={seriesColor}
                        style={{
                          cursor: 'pointer',
                          outline: isHovered ? barOutlineStyle : 'none',
                        }}
                        onMouseEnter={(event) => {
                          handleBarMouseEnter(event, dataPoint, seriesKey);
                          handleCustomMouseEnter(dataPoint, seriesKey, event);
                        }}
                        onMouseMove={(event) => {
                          handleBarMouseMove(event, dataPoint, seriesKey);
                        }}
                        onMouseLeave={() => {
                          handleBarMouseLeave();
                          handleCustomMouseLeave();
                        }}
                        aria-label={`${formatCategory(dataPoint.label)}:
                        ${formatCategory(series[seriesIndex].label)} ${formatNumeric(segmentValue)}`}
                        role="button"
                        tabIndex={0}
                      />
                      {height > MIN_BAR_HEIGHT_FOR_TEXT && (
                        <text
                          x={x + width / 2}
                          y={y + height / 2}
                          fill="white"
                          fontSize={BAR_TEXT_FONT_SIZE}
                          fontFamily={axisTextFontFamily}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontWeight={500}
                        >
                          {formatNumeric(segmentValue)}
                        </text>
                      )}
                    </g>
                  );
                }

                return (
                  <g key={`${seriesKey}-${dataPoint.id}`}>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={seriesColor}
                      style={{
                        cursor: 'pointer',
                        outline: isHovered ? barOutlineStyle : 'none',
                      }}
                      onMouseEnter={(event) => {
                        handleBarMouseEnter(event, dataPoint, seriesKey);
                        handleCustomMouseEnter(dataPoint, seriesKey, event);
                      }}
                      onMouseMove={(event) => {
                        handleBarMouseMove(event, dataPoint, seriesKey);
                      }}
                      onMouseLeave={() => {
                        handleBarMouseLeave();
                        handleCustomMouseLeave();
                      }}
                      aria-label={`${formatCategory(dataPoint.label)}:
                      ${formatCategory(series[seriesIndex].label)} ${formatNumeric(segmentValue)}`}
                      role="button"
                      tabIndex={0}
                    />
                    {((orientation === 'vertical' && height > MIN_BAR_HEIGHT_FOR_TEXT) ||
                      (orientation === 'horizontal' && width > MIN_BAR_WIDTH_FOR_TEXT)) && (
                      <text
                        x={orientation === 'vertical' ? x + width / 2 : x + width / 2}
                        y={orientation === 'vertical' ? y + height / 2 : y + height / 2}
                        fill="white"
                        fontSize={BAR_TEXT_FONT_SIZE}
                        fontFamily={axisTextFontFamily}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontWeight={500}
                      >
                        {formatNumeric(segmentValue)}
                      </text>
                    )}
                  </g>
                );
              });
            })}
          </g>

          {showTotals && (
            <g>
              {processedData.map((dataPoint) => {
                const total = dataPoint.total;
                let x, y;

                if (orientation === 'vertical') {
                  x = callScale(adjustedXScale, dataPoint.label) + getBandwidth(adjustedXScale) / 2;
                  y = callScale(yScale, total) + TEXT_OFFSET_Y_TOTAL;
                } else {
                  x = callScale(adjustedXScale, total) + 5;
                  y = callScale(yScale, dataPoint.label) + getBandwidth(yScale) / 2;
                }

                return (
                  <text
                    key={`total-${dataPoint.id}`}
                    x={x}
                    y={y}
                    fill={totalTextColor}
                    fontSize={totalTextFontSize}
                    fontFamily={totalTextFontFamily}
                    textAnchor="middle"
                    dominantBaseline="alphabetic"
                  >
                    {formatTotal(total)}
                  </text>
                );
              })}
            </g>
          )}
          <g transform={`translate(0, ${adjustedDimensions.innerHeight})`}>
            {axisData.xAxisTicks.map((tick: string | number) => (
              <g
                key={tick}
                transform={
                  orientation === 'vertical'
                    ? `translate(${callScale(adjustedXScale, tick) + getBandwidth(adjustedXScale) / 2}, 0)`
                    : `translate(${callScale(adjustedXScale, tick)}, 0)`
                }
              >
                <text
                  x={0}
                  y={TEXT_OFFSET_X_AXIS}
                  fill={axisTextColor}
                  fontSize={axisTextFontSize}
                  fontFamily={axisTextFontFamily}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                >
                  {orientation === 'vertical' ? formatCategory(String(tick)) : formatNumeric(tick as number)}
                </text>
              </g>
            ))}
          </g>

          {Boolean(xAxisLabel) && (
            <text
              x={svgStyles.axisXText.x}
              y={svgStyles.axisXText.y}
              fill={svgStyles.axisXText.fill}
              fontSize={svgStyles.axisXText.fontSize}
              fontFamily={svgStyles.axisXText.fontFamily}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {xAxisLabel}
            </text>
          )}

          {Boolean(yAxisLabel) && (
            <text
              x={-dimensions.innerHeight / 2}
              y={-axisYWidth - (yAxisLabelWidth + TEXT_HEIGHT.ADDITIONAL_PADDING) / 2}
              fill={axisTextColor}
              fontSize={axisTextFontSize}
              fontFamily={axisTextFontFamily}
              textAnchor="middle"
              dominantBaseline="middle"
              transform="rotate(-90)"
            >
              {yAxisLabel}
            </text>
          )}

          {showLegend && (
            <g
              transform={
                legendPosition === 'top'
                  ? `translate(0, -${(dimensions.margin.top + axisTextFontSize) / 2})`
                  : `translate(0, ${dimensions.height - (dimensions.margin.bottom + axisTextFontSize) / 2})`
              }
            >
              {legendItems.map((item, idx) => (
                <g
                  key={item.key}
                  ref={(el) => {
                    if (el) {
                      legendItemRefs.current[idx] = el;
                    }
                  }}
                  transform={`translate(${legendPositions ? legendPositions[idx] : item.x}, ${item.y})`}
                >
                  <rect x={0} y={0} width={LEGEND_RECT_SIZE} height={LEGEND_RECT_SIZE} fill={item.color} rx={2} />
                  <text
                    x={LEGEND_TEXT_OFFSET_X}
                    y={LEGEND_TEXT_OFFSET_Y}
                    fill={axisTextColor}
                    fontSize={axisTextFontSize}
                    fontFamily={axisTextFontFamily}
                    dominantBaseline="central"
                  >
                    {formatCategory(item.label)}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </svg>

      {showTooltip &&
        Boolean(tooltip) &&
        typeof document !== 'undefined' &&
        createPortal(
          <ChartsTooltip
            label={`${formatCategory(tooltip?.dataPoint.label ?? '')} - ${formatCategory(
              series.find((s) => s.key === tooltip?.series)?.label ?? String(tooltip?.series)
            )}`}
            value={formatNumeric(tooltip?.value ?? 0)}
            color={series.find((s) => s.key === tooltip?.series)?.color ?? '#000000'}
            x={tooltip?.x ?? 0}
            y={tooltip?.y ?? 0}
          />,
          document.body
        )}

      {customTooltip &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: customTooltip.x,
              top: customTooltip.y,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          >
            {customTooltip.content}
          </div>,
          document.body
        )}
    </div>
  );
}

export default BarChart;
