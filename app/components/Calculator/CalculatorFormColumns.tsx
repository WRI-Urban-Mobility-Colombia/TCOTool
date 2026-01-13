import React from 'react';
import type { TableColumn } from 'vizonomy';
import type {
  InsumoTableRow,
  ValidacionTableRow,
  InsumoColumnsProps,
  ValidacionColumnsProps,
} from './CalculatorForm.types';
import {
  TABLE_COLUMNS_LABELS,
  TechnologyType,
  DEFAULT_ACQUISITION_COSTS,
  AcquisitionCostsColumnIds,
  FieldTablesId,
  TableInputVariant,
  TABLE_COLUMN_WIDTHS,
} from './CalculatorForm.constants';
import { formatNumberThousands } from '@/lib/utils';
import {
  DollarSignStyled,
  FormTextStyled,
  ValuesContainerStyled,
  DisabledCell,
  TableInput,
} from './CalculatorForm.styled';
import { createDefaultValueFocusHandler } from './CalculatorForm.utils';
import { EBusFormField } from './components/EBusFormField';

export function createInsumoColumns({
  insumoValues,
  handleInsumoInputChange,
}: InsumoColumnsProps): TableColumn<InsumoTableRow>[] {
  return [
    {
      id: FieldTablesId.technology,
      key: FieldTablesId.technology,
      label: TABLE_COLUMNS_LABELS.technology,
      width: TABLE_COLUMN_WIDTHS.INSUMO_COLUMN,
      render: FormTextStyled,
    },
    {
      id: AcquisitionCostsColumnIds.busetonCost,
      key: AcquisitionCostsColumnIds.busetonCost,
      label: TABLE_COLUMNS_LABELS.busetonCost,
      width: TABLE_COLUMN_WIDTHS.INSUMO_COLUMN,
      render: (_value: string, row: InsumoTableRow) => (
        <ValuesContainerStyled>
          <DollarSignStyled />
          <TableInput
            variant={TableInputVariant.textBase}
            value={insumoValues[row.id]?.busetonCost ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInsumoInputChange(row.id, AcquisitionCostsColumnIds.busetonCost, e.target.value)
            }
            placeholder="Insertar valor"
          />
        </ValuesContainerStyled>
      ),
    },
    {
      id: AcquisitionCostsColumnIds.infrastructure,
      key: AcquisitionCostsColumnIds.infrastructure,
      label: TABLE_COLUMNS_LABELS.infrastructure,
      width: '25%',
      render: (_value: string, row: InsumoTableRow) => (
        <ValuesContainerStyled>
          <DollarSignStyled />
          <TableInput
            variant={TableInputVariant.textBase}
            value={insumoValues[row.id]?.infrastructure ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInsumoInputChange(row.id, AcquisitionCostsColumnIds.infrastructure, e.target.value)
            }
            placeholder="Insertar valor"
          />
        </ValuesContainerStyled>
      ),
    },
    {
      id: AcquisitionCostsColumnIds.battery,
      key: AcquisitionCostsColumnIds.battery,
      label: TABLE_COLUMNS_LABELS.battery,
      width: TABLE_COLUMN_WIDTHS.INSUMO_COLUMN,
      render: (_value: string, row: InsumoTableRow) => (
        <ValuesContainerStyled>
          <DollarSignStyled />
          <TableInput
            variant={TableInputVariant.textBase}
            value={insumoValues[row.id]?.battery ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInsumoInputChange(row.id, AcquisitionCostsColumnIds.battery, e.target.value)
            }
            placeholder="Insertar valor"
          />
        </ValuesContainerStyled>
      ),
    },
  ];
}

export function createValidacionColumns({
  form,
  acquisitionCosts,
  handleValidacionInputChange,
  currencyPrefix,
  submitAttempted = false,
}: ValidacionColumnsProps): TableColumn<ValidacionTableRow>[] {
  return [
    {
      id: FieldTablesId.technology,
      key: FieldTablesId.technology,
      label: 'Tecnología',
      width: '22%',
      render: (_value: string, row: ValidacionTableRow) => {
        return FormTextStyled(row.technology);
      },
    },
    {
      id: AcquisitionCostsColumnIds.busetonCost,
      key: AcquisitionCostsColumnIds.busetonCost,
      label: TABLE_COLUMNS_LABELS.busetonCost,
      width: '26%',
      render: (_value: number, row: ValidacionTableRow) => {
        const column = row.id as TechnologyType;
        const rawValue = acquisitionCosts.busetonCost[column] ?? '';
        const displayValue = rawValue ? formatNumberThousands(rawValue) : '';
        const defaultValue = DEFAULT_ACQUISITION_COSTS.busetonCost[column] ?? '';

        return (
          <ValuesContainerStyled>
            <DollarSignStyled currencyPrefix={currencyPrefix} />
            <EBusFormField
              required
              value={rawValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <TableInput
                value={displayValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValidacionInputChange(AcquisitionCostsColumnIds.busetonCost, column, e.target.value)
                }
                {...createDefaultValueFocusHandler(form, `acquisitionCosts.busetonCost.${column}`)}
                placeholder="Insertar valor"
              />
            </EBusFormField>
          </ValuesContainerStyled>
        );
      },
    },
    {
      id: AcquisitionCostsColumnIds.infrastructure,
      key: AcquisitionCostsColumnIds.infrastructure,
      label: TABLE_COLUMNS_LABELS.infrastructure,
      width: '26%',
      render: (_value: number | null, row: ValidacionTableRow) => {
        const column = row.id as TechnologyType;
        const rawValue = acquisitionCosts.infrastructure[column] ?? '';
        const displayValue = rawValue ? formatNumberThousands(rawValue) : '';
        const defaultValue = DEFAULT_ACQUISITION_COSTS.infrastructure[column] ?? '';
        const isRequired = column !== TechnologyType.diesel;

        return (
          <ValuesContainerStyled>
            <DollarSignStyled currencyPrefix={currencyPrefix} />
            <EBusFormField
              required={isRequired}
              value={rawValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <TableInput
                value={displayValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValidacionInputChange(AcquisitionCostsColumnIds.infrastructure, column, e.target.value)
                }
                {...createDefaultValueFocusHandler(form, `acquisitionCosts.infrastructure.${column}`)}
                placeholder="Insertar valor"
              />
            </EBusFormField>
          </ValuesContainerStyled>
        );
      },
    },
    {
      id: AcquisitionCostsColumnIds.battery,
      key: AcquisitionCostsColumnIds.battery,
      label: TABLE_COLUMNS_LABELS.battery,
      width: '26%',
      render: (_value: number | null, row: ValidacionTableRow) => {
        const column = row.id as TechnologyType;
        const rawValue = acquisitionCosts.battery[column] ?? '';
        const displayValue = rawValue ? formatNumberThousands(rawValue) : '';
        const defaultValue = DEFAULT_ACQUISITION_COSTS.battery[column] ?? '';

        if (column === 'diesel' || column === 'gnv') {
          return <DisabledCell />;
        }

        return (
          <ValuesContainerStyled>
            <DollarSignStyled currencyPrefix={currencyPrefix} />
            <EBusFormField
              required
              value={rawValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <TableInput
                value={displayValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValidacionInputChange(AcquisitionCostsColumnIds.battery, column, e.target.value)
                }
                {...createDefaultValueFocusHandler(form, `acquisitionCosts.battery.${column}`)}
                placeholder="Insertar valor"
              />
            </EBusFormField>
          </ValuesContainerStyled>
        );
      },
    },
  ];
}
