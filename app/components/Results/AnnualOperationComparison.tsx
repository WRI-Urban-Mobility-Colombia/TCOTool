'use client';

import type { AnnualOperationComparisonProps } from './ResultsSection.types';
import { useCurrency } from '../Calculator/CurrencyContext';
import {
  ANNUAL_OPERATION_COMPARISON_TABLE,
  ANNUAL_OPERATION_COMPARISON_CHART_SERIES,
  TableVariant,
} from './ResultsSection.constants';
import {
  MainContainer,
  SectionContainer,
  TableWrapper,
  TableContainer,
  ResultsTable,
  ChartContainer,
  TitleContainer,
  ResultsLineChart,
} from './ResultsSection.styled';
import { formatNumberThousands } from '@/lib/utils';
import { createAnnualOperationComparisonColumns } from './ResultsTable.utils';

export function AnnualOperationComparison({
  comparisonOperationAnnualData,
  chartComparisonOperationAnnualData,
}: AnnualOperationComparisonProps) {
  const { getCurrencyPrefix } = useCurrency();
  const currencyPrefix = getCurrencyPrefix();
  const columns = createAnnualOperationComparisonColumns(currencyPrefix);

  return (
    <MainContainer>
      <SectionContainer>
        <TableWrapper>
          <TableContainer>
            <ResultsTable
              data={comparisonOperationAnnualData}
              columns={columns}
              rowKey={ANNUAL_OPERATION_COMPARISON_TABLE.rowKey}
              variant={TableVariant.annualOperationComparison}
            />
          </TableContainer>
        </TableWrapper>
      </SectionContainer>

      <ChartContainer id="chart-comparison-operation-annual">
        <TitleContainer>{ANNUAL_OPERATION_COMPARISON_TABLE.labels.title}</TitleContainer>
        <ResultsLineChart
          data={chartComparisonOperationAnnualData}
          series={ANNUAL_OPERATION_COMPARISON_CHART_SERIES}
          yAxisLabel={`Costos de Operación por Kilómetro (${currencyPrefix})`}
          formatValueLabel={formatNumberThousands}
        />
      </ChartContainer>
    </MainContainer>
  );
}
