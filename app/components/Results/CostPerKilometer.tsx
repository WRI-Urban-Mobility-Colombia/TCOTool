'use client';

import { Table } from 'vizonomy';
import type { TableColumn } from 'vizonomy';
import { BarChart, StackedBarChartDataPoint, BarChartSeries } from '@/lib/BarChart';
import type { CostPerKkmRow } from './ResultsSection.types';
import { currencyFormatChanger } from '@/lib/utils';
import { useCurrency } from '../Calculator/CurrencyContext';
import { FormTextStyled, ValueWithDollarSignStyled } from '../Calculator/CalculatorForm.styled';
import { TechnologyType } from '../Calculator/CalculatorForm.constants';
import { ResultsColumnIds } from './ResultsSection.constants';

const renderCategory = (value: string, row: CostPerKkmRow) => {
  const content = FormTextStyled(value);
  const isBold = row.id === 'total';
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
};

const renderValue = (value: number | null | undefined, row: CostPerKkmRow, currencyPrefix: string) => {
  const content = ValueWithDollarSignStyled({ value, currencyPrefix });
  const isBold = row.id === 'total';
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
};

const createColumns = (currencyPrefix: string): TableColumn<CostPerKkmRow>[] => [
  {
    id: ResultsColumnIds.cost,
    key: ResultsColumnIds.cost,
    label: 'Costo promedio por kilómetro',
    width: '31%',
    render: (value: string, row: CostPerKkmRow) => renderCategory(value, row),
  },
  {
    id: TechnologyType.diesel,
    key: TechnologyType.diesel,
    label: 'Diesel',
    width: '23%',
    render: (value: number | null | undefined, row: CostPerKkmRow) => renderValue(value, row, currencyPrefix),
  },
  {
    id: TechnologyType.gnv,
    key: TechnologyType.gnv,
    label: 'GNV',
    width: '23%',
    render: (value: number | null | undefined, row: CostPerKkmRow) => renderValue(value, row, currencyPrefix),
  },
  {
    id: TechnologyType.electric,
    key: TechnologyType.electric,
    label: 'Eléctricos',
    width: '23%',
    render: (value: number | null | undefined, row: CostPerKkmRow) => renderValue(value, row, currencyPrefix),
  },
];

const chartSeries: BarChartSeries[] = [
  { key: ResultsColumnIds.consumption, label: 'Costo de Consumo', color: '#6f9ff3' },
  { key: ResultsColumnIds.maintenance, label: 'Costos de Mantenimiento', color: '#f3817d' },
  { key: ResultsColumnIds.savings, label: 'Ahorros', color: '#33b192' },
];

export function CostPerKilometer({
  costPerKilometerData,
  chartCostPerKilometerData,
}: {
  costPerKilometerData: CostPerKkmRow[];
  chartCostPerKilometerData: StackedBarChartDataPoint[];
}) {
  const { getCurrencyPrefix } = useCurrency();
  const currencyPrefix = getCurrencyPrefix();
  const columns = createColumns(currencyPrefix);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="mb-4 font-['Inter',sans-serif] text-xl font-bold leading-[28px] text-[#1a1919]">
          Costo promedio por kilómetro
        </h2>
        <div className="w-full max-w-full overflow-visible">
          <div className="overflow-visible [&_*]:border-[#e7e6e6]">
            <Table
              data={costPerKilometerData}
              columns={columns}
              rowKey="id"
              size="small"
              className="ebus-table w-full max-w-full [&_th]:font-['Inter',sans-serif]
              [&_th]:text-sm [&_th]:font-bold [&_th]:text-[#3d3b3b]
              [&_th]:text-center [&_th:first-child]:text-left [&_thead]:!bg-[#f6f6f6] [&_th]:!bg-[#f6f6f6]
              [&_td]:px-2 [&_td]:py-2 [&_td]:text-sm [&_th]:px-2 [&_table]:w-full
              [&_table]:table-fixed [&_table]:max-w-full [&_table]:border-0 [&_table]:rounded-sm
              [&_th]:border-[1px] [&_th]:border-[#e7e6e6] [&_td]:border-[1px]
              [&_td]:border-[#e7e6e6] [&_tbody_tr:nth-last-child(1)]:bg-[#c2e5dc]"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-['Inter',sans-serif] text-base font-normal leading-[22px] text-[#000000]">
          Costos Operacionales por Kilómetro
        </h3>
      </div>

      <div className="w-full" id="chart-cost-per-kilometer">
        <BarChart
          data={chartCostPerKilometerData}
          series={chartSeries}
          width={697}
          height={500}
          orientation="vertical"
          showLegend={true}
          legendPosition="top"
          showGrid={true}
          showTooltip={true}
          showTotals={false}
          xAxisLabel="Tipo de Tecnología"
          yAxisLabel={`Costo por Kilómetro (${currencyPrefix})`}
          formatValueLabel={(value) => {
            return currencyFormatChanger(value, currencyPrefix);
          }}
          margin={{ top: 60, right: 0, bottom: 60, left: 0 }}
          barPadding={0.3}
          className="w-full"
        />
      </div>
    </div>
  );
}
