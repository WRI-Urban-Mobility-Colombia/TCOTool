'use client';

import type { TotalCostOfOwnershipProps } from './ResultsSection.types';
import { useCurrency } from '../Calculator/CurrencyContext';
import { createFormatValueLabel } from './ResultsSection.utils';
import { BARCHART, TOTAL_COST_TABLE, CHART_SERIES } from './ResultsSection.constants';
import {
  MainContainer,
  SectionContainer,
  TitleContainer,
  TableWrapper,
  TableContainer,
  ResultsTable,
  ChartContainer,
  ResultsBarChart,
} from './ResultsSection.styled';
import { TableVariant } from './ResultsSection.constants';
import { createTotalCostColumns } from './ResultsTable.utils';

export function TotalCostOfOwnership({
  totalCostPropertyData,
  chartTotalCostOfOwnershipData,
}: TotalCostOfOwnershipProps) {
  const { getCurrencyPrefix } = useCurrency();
  const currencyPrefix = getCurrencyPrefix();
  const columns = createTotalCostColumns(currencyPrefix);

  return (
    <MainContainer>
      <SectionContainer>
        <TitleContainer>{TOTAL_COST_TABLE.labels.title}</TitleContainer>
        <TableWrapper>
          <TableContainer>
            <ResultsTable
              data={totalCostPropertyData}
              columns={columns}
              rowKey={TOTAL_COST_TABLE.rowKey}
              variant={TableVariant.totalCost}
            />
          </TableContainer>
        </TableWrapper>
      </SectionContainer>

      <ChartContainer id="chart-total-cost-ownership">
        <ResultsBarChart
          data={chartTotalCostOfOwnershipData}
          series={CHART_SERIES}
          yAxisLabel={BARCHART.yAxisLabel}
          formatValueLabel={createFormatValueLabel(currencyPrefix)}
        />
      </ChartContainer>
    </MainContainer>
  );
}
