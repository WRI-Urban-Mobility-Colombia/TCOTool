import React from 'react';
import { Table } from 'vizonomy';
import type { TableColumn } from 'vizonomy';
import { BarChart } from '@/lib/BarChart';
import type { StackedBarChartDataPoint, BarChartSeries } from '@/lib/BarChart';
import { LineChart } from '@/lib/LineChart';
import type { LineChartDataPoint, LineChartSeries } from '@/lib/LineChart/LineChart.types';
import type { CostTotalRow, CostPerKkmRow, AnnualOperationComparisonRow } from './ResultsSection.types';
import { TableVariant, BARCHART, LINECHART } from './ResultsSection.constants';

export function ResultsContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full ${className ?? ''}`}>{children}</div>;
}

export function ResultsSectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="mb-6">{children}</div>;
}

export function ResultsDivider() {
  return <div className="mb-6 h-px w-full bg-[#e5e7eb]"></div>;
}

export function MainContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="mb-6">{children}</div>;
}

export function TitleContainer({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-['Inter',sans-serif] text-xl font-bold leading-[28px] text-[#1a1919]">{children}</h2>;
}

export function TableWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-full overflow-visible">{children}</div>;
}

export function TableContainer({ children }: { children: React.ReactNode }) {
  return <div className="overflow-visible [&_*]:border-[#e7e6e6]">{children}</div>;
}

const BASE_TABLE_CLASSNAME =
  'ebus-table w-full max-w-full [&_th]:font-["Inter",sans-serif] [&_th]:text-sm [&_th]:font-bold [&_th]:text-[#3d3b3b] [&_th]:text-center [&_th:first-child]:text-left [&_thead]:!bg-[#f6f6f6] [&_th]:!bg-[#f6f6f6] [&_td]:px-2 [&_td]:py-2 [&_td]:text-sm [&_th]:px-2 [&_table]:w-full [&_table]:table-fixed [&_table]:max-w-full [&_table]:border-0 [&_table]:rounded-sm [&_th]:border-[1px] [&_th]:border-[#e7e6e6] [&_td]:border-[1px] [&_td]:border-[#e7e6e6]';

const TABLE_VARIANT_CLASSNAMES = {
  [TableVariant.totalCost]:
    '[&_tbody_tr:nth-last-child(3)]:bg-[#ebf5f2] [&_tbody_tr:nth-last-child(2)]:bg-[#ebf5f2] [&_tbody_tr:nth-last-child(1)]:bg-[#c2e5dc]',
  [TableVariant.costPerKm]: '[&_tbody_tr:nth-last-child(1)]:bg-[#c2e5dc]',
  [TableVariant.annualOperationComparison]:
    '[&_tbody_tr_td:first-child]:bg-[#fbf7ea] [&_tbody_tr_td:not(:first-child)]:bg-[#ebf5f2]',
};

export function ResultsTable<T extends CostTotalRow | CostPerKkmRow | AnnualOperationComparisonRow>({
  data,
  columns,
  rowKey = 'id',
  variant,
}: {
  data: T[];
  columns: TableColumn<T>[];
  rowKey?: string;
  variant: TableVariant;
}) {
  const className = `${BASE_TABLE_CLASSNAME} ${TABLE_VARIANT_CLASSNAMES[variant]}`;

  return <Table data={data} columns={columns} rowKey={rowKey} size="small" className={className} />;
}

export function ChartContainer({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div className="w-full" id={id}>
      {children}
    </div>
  );
}

export function SubtitleContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="font-['Inter',sans-serif] text-base font-normal leading-[22px] text-[#000000]">{children}</h3>
    </div>
  );
}

export function ResultsBarChart({
  data,
  series,
  yAxisLabel,
  formatValueLabel,
}: {
  data: StackedBarChartDataPoint[];
  series: BarChartSeries[];
  yAxisLabel: string;
  formatValueLabel: (value: number) => string;
}) {
  return (
    <BarChart
      data={data}
      series={series}
      width={BARCHART.width}
      height={BARCHART.height}
      orientation={BARCHART.orientation}
      showLegend={BARCHART.showLegend}
      legendPosition={BARCHART.legendPosition}
      showGrid={BARCHART.showGrid}
      showTooltip={BARCHART.showTooltip}
      showTotals={BARCHART.showTotals}
      xAxisLabel={BARCHART.xAxisLabel}
      yAxisLabel={yAxisLabel}
      formatValueLabel={formatValueLabel}
      margin={BARCHART.margin}
      barPadding={BARCHART.barPadding}
      className={BARCHART.className}
    />
  );
}

export function ResultsLineChart({
  data,
  series,
  yAxisLabel,
  formatValueLabel,
}: {
  data: LineChartDataPoint[];
  series: LineChartSeries[];
  yAxisLabel: string;
  formatValueLabel: (value: number) => string;
}) {
  return (
    <LineChart
      data={data}
      series={series}
      width={LINECHART.width}
      height={LINECHART.height}
      xAxisLabel={LINECHART.xAxisLabel}
      yAxisLabel={yAxisLabel}
      formatValueLabel={formatValueLabel}
    />
  );
}
