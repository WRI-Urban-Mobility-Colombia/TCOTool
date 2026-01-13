'use client';

import type { CostPerKilometerProps } from './ResultsSection.types';
import { useCurrency } from '../Calculator/CurrencyContext';
import { createFormatValueLabel } from './ResultsSection.utils';
import { COST_PER_KM_TABLE, COST_PER_KM_CHART_SERIES, COST_PER_KM_SUBTITLE } from './ResultsSection.constants';
import {
  MainContainer,
  SectionContainer,
  TitleContainer,
  TableWrapper,
  TableContainer,
  ResultsTable,
  ChartContainer,
  SubtitleContainer,
  ResultsBarChart,
} from './ResultsSection.styled';
import { TableVariant } from './ResultsSection.constants';
import { createCostPerKmColumns } from './ResultsTable.utils';

export function CostPerKilometer({ costPerKilometerData, chartCostPerKilometerData }: CostPerKilometerProps) {
  const { getCurrencyPrefix } = useCurrency();
  const currencyPrefix = getCurrencyPrefix();
  const columns = createCostPerKmColumns(currencyPrefix);

  return (
    <MainContainer>
      <SectionContainer>
        <TitleContainer>{COST_PER_KM_TABLE.labels.title}</TitleContainer>
        <TableWrapper>
          <TableContainer>
            <ResultsTable
              data={costPerKilometerData}
              columns={columns}
              rowKey={COST_PER_KM_TABLE.rowKey}
              variant={TableVariant.costPerKm}
            />
          </TableContainer>
        </TableWrapper>
      </SectionContainer>

      <SubtitleContainer>{COST_PER_KM_SUBTITLE}</SubtitleContainer>

      <ChartContainer id="chart-cost-per-kilometer">
        <ResultsBarChart
          data={chartCostPerKilometerData}
          series={COST_PER_KM_CHART_SERIES}
          yAxisLabel={`Costo por Kilómetro (${currencyPrefix})`}
          formatValueLabel={createFormatValueLabel(currencyPrefix)}
        />
      </ChartContainer>
    </MainContainer>
  );
}
