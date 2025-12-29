'use client';

import { Table } from 'vizonomy';
import type { TableColumn } from 'vizonomy';
import { BarChart, StackedBarChartDataPoint, BarChartSeries } from '@/lib/BarChart';
import type { CostTotalRow } from './ResultsSection.types';
import { currencyFormatChanger } from '@/lib/utils';
import { useCurrency } from '../Calculator/CurrencyContext';
import { FormTextStyled, ValueWithDollarSignStyled } from '../Calculator/CalculatorForm.styled';
import { TechnologyType } from '../Calculator/CalculatorForm.constants';
import { FormTypes, ResultsColumnIds } from './ResultsSection.constants';

const LAST_THREE_ROWS = ['total', 'additional-expenses', 'total-overhead'];

const renderCategory = (value: string, row: CostTotalRow) => {
  const content = FormTextStyled(value);
  const isBold = LAST_THREE_ROWS.includes(row.id);
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
};

const renderValue = (value: number | null | undefined, row: CostTotalRow, currencyPrefix: string) => {
  const content = ValueWithDollarSignStyled({ value, currencyPrefix });
  const isBold = LAST_THREE_ROWS.includes(row.id);
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
};

const createColumns = (currencyPrefix: string): TableColumn<CostTotalRow>[] => [
  {
    id: ResultsColumnIds.category,
    key: ResultsColumnIds.category,
    label: 'Costo Total de Propiedad',
    width: '32%',
    render: (value: string, row: CostTotalRow) => renderCategory(value, row),
  },
  {
    id: TechnologyType.diesel,
    key: TechnologyType.diesel,
    label: 'Diésel',
    width: '22%',
    render: (value: number | null | undefined, row: CostTotalRow) => renderValue(value, row, currencyPrefix),
  },
  {
    id: TechnologyType.gnv,
    key: TechnologyType.gnv,
    label: 'GNV',
    width: '22%',
    render: (value: number | null | undefined, row: CostTotalRow) => renderValue(value, row, currencyPrefix),
  },
  {
    id: TechnologyType.electric,
    key: TechnologyType.electric,
    label: 'Eléctricos',
    width: '24%',
    render: (value: number | null | undefined, row: CostTotalRow) => renderValue(value, row, currencyPrefix),
  },
];

const chartSeries: BarChartSeries[] = [
  { key: FormTypes.finex, label: 'Finex', color: '#33b192' },
  { key: FormTypes.opex, label: 'Opex', color: '#f3817d' },
  { key: FormTypes.capex, label: 'Capex', color: '#6f9ff3' },
];

export function TotalCostOfOwnership({
  totalCostPropertyData,
  chartTotalCostOfOwnershipData,
}: {
  totalCostPropertyData: CostTotalRow[];
  chartTotalCostOfOwnershipData: StackedBarChartDataPoint[];
}) {
  const { getCurrencyPrefix } = useCurrency();
  const currencyPrefix = getCurrencyPrefix();
  const columns = createColumns(currencyPrefix);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="mb-4 font-['Inter',sans-serif] text-xl font-bold leading-[28px] text-[#1a1919]">
          Costo Total de Propiedad
        </h2>
        <div className="w-full max-w-full overflow-visible">
          <div className="overflow-visible [&_*]:border-[#e7e6e6]">
            <Table
              data={totalCostPropertyData}
              columns={columns}
              rowKey="id"
              size="small"
              className="ebus-table w-full max-w-full [&_th]:font-['Inter',sans-serif]
              [&_th]:text-sm [&_th]:font-bold [&_th]:text-[#3d3b3b]
              [&_th]:text-center [&_th:first-child]:text-left [&_thead]:!bg-[#f6f6f6] [&_th]:!bg-[#f6f6f6]
              [&_td]:px-2 [&_td]:py-2 [&_td]:text-sm [&_th]:px-2 [&_table]:w-full
              [&_table]:table-fixed [&_table]:max-w-full [&_table]:border-0 [&_table]:rounded-sm
              [&_th]:border-[1px] [&_th]:border-[#e7e6e6] [&_td]:border-[1px]
              [&_td]:border-[#e7e6e6] [&_tbody_tr:nth-last-child(3)]:bg-[#ebf5f2]
              [&_tbody_tr:nth-last-child(2)]:bg-[#ebf5f2]
              [&_tbody_tr:nth-last-child(1)]:bg-[#c2e5dc]"
            />
          </div>
        </div>
      </div>

      <div className="w-full" id="chart-total-cost-ownership">
        <BarChart
          data={chartTotalCostOfOwnershipData}
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
          yAxisLabel=""
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
