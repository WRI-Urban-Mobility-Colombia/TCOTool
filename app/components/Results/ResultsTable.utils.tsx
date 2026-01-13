import React from 'react';
import type { TableColumn } from 'vizonomy';
import { FormTextStyled, ValueWithDollarSignStyled } from '../Calculator/CalculatorForm.styled';
import { TechnologyType } from '../Calculator/CalculatorForm.constants';
import type {
  CostTotalRow,
  CostPerKkmRow,
  AnnualOperationComparisonRow,
  RenderTotalCostCategoryParams,
  RenderTotalCostValueParams,
  RenderCostPerKmCategoryParams,
  RenderCostPerKmValueParams,
  RenderAnnualOperationComparisonCategoryParams,
  RenderAnnualOperationComparisonValueParams,
} from './ResultsSection.types';
import {
  ResultsColumnIds,
  LAST_THREE_ROWS,
  TOTAL_COST_TABLE,
  COST_PER_KM_TABLE,
  ANNUAL_OPERATION_COMPARISON_TABLE,
} from './ResultsSection.constants';

export function renderTotalCostCategory({ value, row }: RenderTotalCostCategoryParams) {
  const content = FormTextStyled(value);
  const isBold = LAST_THREE_ROWS.includes(row.id as (typeof LAST_THREE_ROWS)[number]);
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
}

export function renderTotalCostValue({ value, row, currencyPrefix }: RenderTotalCostValueParams) {
  const content = ValueWithDollarSignStyled({ value, currencyPrefix });
  const isBold = LAST_THREE_ROWS.includes(row.id as (typeof LAST_THREE_ROWS)[number]);
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
}

export function createTotalCostColumns(currencyPrefix: string): TableColumn<CostTotalRow>[] {
  return [
    {
      id: ResultsColumnIds.category,
      key: ResultsColumnIds.category,
      label: TOTAL_COST_TABLE.labels.category,
      width: TOTAL_COST_TABLE.columnWidths.category,
      render: (value: string, row: CostTotalRow) => renderTotalCostCategory({ value, row }),
    },
    {
      id: TechnologyType.diesel,
      key: TechnologyType.diesel,
      label: TOTAL_COST_TABLE.labels.diesel,
      width: TOTAL_COST_TABLE.columnWidths.diesel,
      render: (value: number | null | undefined, row: CostTotalRow) =>
        renderTotalCostValue({ value, row, currencyPrefix }),
    },
    {
      id: TechnologyType.gnv,
      key: TechnologyType.gnv,
      label: TOTAL_COST_TABLE.labels.gnv,
      width: TOTAL_COST_TABLE.columnWidths.gnv,
      render: (value: number | null | undefined, row: CostTotalRow) =>
        renderTotalCostValue({ value, row, currencyPrefix }),
    },
    {
      id: TechnologyType.electric,
      key: TechnologyType.electric,
      label: TOTAL_COST_TABLE.labels.electric,
      width: TOTAL_COST_TABLE.columnWidths.electric,
      render: (value: number | null | undefined, row: CostTotalRow) =>
        renderTotalCostValue({ value, row, currencyPrefix }),
    },
  ];
}

export function renderCostPerKmCategory({ value, row }: RenderCostPerKmCategoryParams) {
  const content = FormTextStyled(value);
  const isBold = row.id === 'total';
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
}

export function renderCostPerKmValue({ value, row, currencyPrefix }: RenderCostPerKmValueParams) {
  const content = ValueWithDollarSignStyled({ value, currencyPrefix });
  const isBold = row.id === 'total';
  return <span className={isBold ? 'font-bold' : 'font-normal'}>{content}</span>;
}

export function createCostPerKmColumns(currencyPrefix: string): TableColumn<CostPerKkmRow>[] {
  return [
    {
      id: ResultsColumnIds.cost,
      key: ResultsColumnIds.cost,
      label: COST_PER_KM_TABLE.labels.cost,
      width: COST_PER_KM_TABLE.columnWidths.cost,
      render: (value: string, row: CostPerKkmRow) => renderCostPerKmCategory({ value, row }),
    },
    {
      id: TechnologyType.diesel,
      key: TechnologyType.diesel,
      label: COST_PER_KM_TABLE.labels.diesel,
      width: COST_PER_KM_TABLE.columnWidths.diesel,
      render: (value: number | null | undefined, row: CostPerKkmRow) =>
        renderCostPerKmValue({ value, row, currencyPrefix }),
    },
    {
      id: TechnologyType.gnv,
      key: TechnologyType.gnv,
      label: COST_PER_KM_TABLE.labels.gnv,
      width: COST_PER_KM_TABLE.columnWidths.gnv,
      render: (value: number | null | undefined, row: CostPerKkmRow) =>
        renderCostPerKmValue({ value, row, currencyPrefix }),
    },
    {
      id: TechnologyType.electric,
      key: TechnologyType.electric,
      label: COST_PER_KM_TABLE.labels.electric,
      width: COST_PER_KM_TABLE.columnWidths.electric,
      render: (value: number | null | undefined, row: CostPerKkmRow) =>
        renderCostPerKmValue({ value, row, currencyPrefix }),
    },
  ];
}

export function renderAnnualOperationComparisonCategory({ value, row }: RenderAnnualOperationComparisonCategoryParams) {
  const content = FormTextStyled(value);
  const isLastRow = row.id === 'savings-per-km';
  return <span className={isLastRow ? 'font-bold' : 'font-bold'}>{content}</span>;
}

export function renderAnnualOperationComparisonValue({
  value,
  _row,
  currencyPrefix,
}: RenderAnnualOperationComparisonValueParams) {
  const content = ValueWithDollarSignStyled({ value, currencyPrefix });
  return <span className="font-normal">{content}</span>;
}

export function createAnnualOperationComparisonColumns(
  currencyPrefix: string
): TableColumn<AnnualOperationComparisonRow>[] {
  return [
    {
      id: 'differential',
      key: 'differential',
      label: ANNUAL_OPERATION_COMPARISON_TABLE.labels.differential,
      width: ANNUAL_OPERATION_COMPARISON_TABLE.columnWidths.differential,
      render: (value: string, row: AnnualOperationComparisonRow) =>
        renderAnnualOperationComparisonCategory({ value, row }),
    },
    {
      id: TechnologyType.gnv,
      key: TechnologyType.gnv,
      label: ANNUAL_OPERATION_COMPARISON_TABLE.labels.gnv,
      width: ANNUAL_OPERATION_COMPARISON_TABLE.columnWidths.gnv,
      render: (value: number | null | undefined, row: AnnualOperationComparisonRow) =>
        renderAnnualOperationComparisonValue({ value, _row: row, currencyPrefix }),
    },
    {
      id: TechnologyType.electric,
      key: TechnologyType.electric,
      label: ANNUAL_OPERATION_COMPARISON_TABLE.labels.electric,
      width: ANNUAL_OPERATION_COMPARISON_TABLE.columnWidths.electric,
      render: (value: number | null | undefined, row: AnnualOperationComparisonRow) =>
        renderAnnualOperationComparisonValue({ value, _row: row, currencyPrefix }),
    },
  ];
}
