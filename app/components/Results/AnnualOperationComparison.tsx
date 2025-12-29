'use client';

import React from 'react';
import { Table } from 'vizonomy';
import type { TableColumn } from 'vizonomy';
import { LineChart } from '@/lib/LineChart';
import type { LineChartDataPoint } from '@/lib/LineChart/LineChart.types';
import type { AnnualOperationComparisonRow } from './ResultsSection.types';
import { formatNumberThousands } from '@/lib/utils';
import { FormTextStyled, ValueWithDollarSignStyled } from '../Calculator/CalculatorForm.styled';
import { useCurrency } from '../Calculator/CurrencyContext';
import { TechnologyType } from '../Calculator/CalculatorForm.constants';

const renderCategory = (value: string, row: AnnualOperationComparisonRow) => {
  const content = FormTextStyled(value);
  const isLastRow = row.id === 'savings-per-km';
  return <span className={isLastRow ? 'font-bold' : 'font-bold'}>{content}</span>;
};

const renderValue = (value: number | null | undefined, _row: AnnualOperationComparisonRow, currencyPrefix: string) => {
  const content = ValueWithDollarSignStyled({ value, currencyPrefix });
  return <span className="font-normal">{content}</span>;
};

const createColumns = (currencyPrefix: string): TableColumn<AnnualOperationComparisonRow>[] => [
  {
    id: 'differential',
    key: 'differential',
    label: 'Diferencial con Diésel',
    width: '41%',
    render: (value: string, row: AnnualOperationComparisonRow) => renderCategory(value, row),
  },
  {
    id: TechnologyType.gnv,
    key: TechnologyType.gnv,
    label: 'GNV',
    width: '29.5%',
    render: (value: number | null | undefined, row: AnnualOperationComparisonRow) =>
      renderValue(value, row, currencyPrefix),
  },
  {
    id: TechnologyType.electric,
    key: TechnologyType.electric,
    label: 'Eléctricos',
    width: '29.5%',
    render: (value: number | null | undefined, row: AnnualOperationComparisonRow) =>
      renderValue(value, row, currencyPrefix),
  },
];

const chartSeries = [
  {
    key: TechnologyType.diesel,
    label: 'Bus Diésel',
    color: '#33b192',
    markerType: 'triangle' as const,
  },
  {
    key: TechnologyType.gnv,
    label: 'Bus GNV',
    color: '#f3817d',
    markerType: 'square' as const,
  },
  {
    key: TechnologyType.electric,
    label: 'Eléctrico',
    color: '#6f9ff3',
    markerType: 'diamond' as const,
  },
];

export function AnnualOperationComparison({
  comparisonOperationAnnualData,
  chartComparisonOperationAnnualData,
}: {
  comparisonOperationAnnualData: AnnualOperationComparisonRow[];
  chartComparisonOperationAnnualData: LineChartDataPoint[];
}) {
  const { getCurrencyPrefix } = useCurrency();
  const currencyPrefix = getCurrencyPrefix();
  const columns = createColumns(currencyPrefix);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="w-full max-w-full overflow-visible">
          <div className="overflow-visible [&_*]:border-[#e7e6e6]">
            <Table
              data={comparisonOperationAnnualData}
              columns={columns}
              rowKey="id"
              size="small"
              className="ebus-table w-full max-w-full [&_th]:font-['Inter',sans-serif]
              [&_th]:text-sm [&_th]:font-bold [&_th]:text-[#3d3b3b]
              [&_th]:text-center [&_th:first-child]:text-left [&_thead]:!bg-[#f6f6f6] [&_th]:!bg-[#f6f6f6]
              [&_td]:px-2 [&_td]:py-2 [&_td]:text-sm [&_th]:px-2 [&_table]:w-full
              [&_table]:table-fixed [&_table]:max-w-full [&_table]:border-0 [&_table]:rounded-sm
              [&_th]:border-[1px] [&_th]:border-[#e7e6e6] [&_td]:border-[1px]
              [&_td]:border-[#e7e6e6] [&_tbody_tr_td:first-child]:bg-[#fbf7ea]
              [&_tbody_tr_td:not(:first-child)]:bg-[#ebf5f2]"
            />
          </div>
        </div>
      </div>

      <div className="w-full" id="chart-comparison-operation-annual">
        <h2 className="mb-2 font-['Inter',sans-serif] text-xl font-bold leading-[28px] text-[#1a1919]">
          Comparación Operación Anual
        </h2>
        <LineChart
          data={chartComparisonOperationAnnualData}
          series={chartSeries}
          width={697}
          height={396}
          xAxisLabel={`Años`}
          yAxisLabel={`Costos de Operación por Kilómetro (${currencyPrefix})`}
          formatValueLabel={(value) => formatNumberThousands(value)}
        />
      </div>
    </div>
  );
}
