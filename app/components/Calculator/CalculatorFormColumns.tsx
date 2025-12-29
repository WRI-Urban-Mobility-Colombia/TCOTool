import React from 'react';
import { Input } from 'vizonomy';
import type { TableColumn } from 'vizonomy';
import type {
  InsumoTableRow,
  ValidacionTableRow,
  AcquisitionCostsType,
  CalculatorFormData,
} from './CalculatorForm.types';
import {
  TABLE_COLUMNS_LABELS,
  TechnologyType,
  DEFAULT_ACQUISITION_COSTS,
  AcquisitionCostsColumnIds,
  FieldTablesId,
} from './CalculatorForm.constants';
import { formatNumberThousands } from '@/lib/utils';
import { DollarSignStyled, FormTextStyled } from './CalculatorForm.styled';
import { createDefaultValueFocusHandler } from './CalculatorForm.utils';
import { EBusFormField } from './components/EBusFormField';
import { UseFormReturn } from '@/lib/Form/Form.types';

interface InsumoColumnsProps {
  insumoValues: Record<string, { busetonCost: string; infrastructure: string; battery: string }>;
  handleInsumoInputChange: (rowId: string, field: AcquisitionCostsColumnIds, value: string) => void;
}

interface ValidacionColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  acquisitionCosts: AcquisitionCostsType;
  handleValidacionInputChange: (column: AcquisitionCostsColumnIds, row: TechnologyType, value: string) => void;
  currencyPrefix: string;
  submitAttempted?: boolean;
}

export function createInsumoColumns({
  insumoValues,
  handleInsumoInputChange,
}: InsumoColumnsProps): TableColumn<InsumoTableRow>[] {
  return [
    {
      id: FieldTablesId.technology,
      key: FieldTablesId.technology,
      label: TABLE_COLUMNS_LABELS.technology,
      width: '25%',
      render: FormTextStyled,
    },
    {
      id: AcquisitionCostsColumnIds.busetonCost,
      key: AcquisitionCostsColumnIds.busetonCost,
      label: TABLE_COLUMNS_LABELS.busetonCost,
      width: '25%',
      render: (_value: string, row: InsumoTableRow) => (
        <div className="flex items-center gap-1">
          <DollarSignStyled />
          <Input
            value={insumoValues[row.id]?.busetonCost ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInsumoInputChange(row.id, AcquisitionCostsColumnIds.busetonCost, e.target.value)
            }
            placeholder="Insertar valor"
            className="flex-1 min-w-0 font-['Inter',sans-serif] text-base bg-white
            text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full"
          />
        </div>
      ),
    },
    {
      id: AcquisitionCostsColumnIds.infrastructure,
      key: AcquisitionCostsColumnIds.infrastructure,
      label: TABLE_COLUMNS_LABELS.infrastructure,
      width: '25%',
      render: (_value: string, row: InsumoTableRow) => (
        <div className="flex items-center gap-1">
          <DollarSignStyled />
          <Input
            value={insumoValues[row.id]?.infrastructure ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInsumoInputChange(row.id, AcquisitionCostsColumnIds.infrastructure, e.target.value)
            }
            placeholder="Insertar valor"
            className="flex-1 min-w-0 font-['Inter',sans-serif] text-base bg-white
            text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full"
          />
        </div>
      ),
    },
    {
      id: AcquisitionCostsColumnIds.battery,
      key: AcquisitionCostsColumnIds.battery,
      label: TABLE_COLUMNS_LABELS.battery,
      width: '25%',
      render: (_value: string, row: InsumoTableRow) => (
        <div className="flex items-center gap-1">
          <DollarSignStyled />
          <Input
            value={insumoValues[row.id]?.battery ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInsumoInputChange(row.id, AcquisitionCostsColumnIds.battery, e.target.value)
            }
            placeholder="Insertar valor"
            className="flex-1 min-w-0 font-['Inter',sans-serif] text-base bg-white
            text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full"
          />
        </div>
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
          <div className="flex items-center gap-1">
            <DollarSignStyled currencyPrefix={currencyPrefix} />
            <EBusFormField
              required
              value={rawValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <Input
                value={displayValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValidacionInputChange(AcquisitionCostsColumnIds.busetonCost, column, e.target.value)
                }
                {...createDefaultValueFocusHandler(form, `acquisitionCosts.busetonCost.${column}`)}
                placeholder="Insertar valor"
                className="flex-1 min-w-0 font-['Inter',sans-serif] bg-white border-0 outline-none
                text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full"
              />
            </EBusFormField>
          </div>
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
          <div className="flex items-center gap-1">
            <DollarSignStyled currencyPrefix={currencyPrefix} />
            <EBusFormField
              required={isRequired}
              value={rawValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <Input
                value={displayValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValidacionInputChange(AcquisitionCostsColumnIds.infrastructure, column, e.target.value)
                }
                {...createDefaultValueFocusHandler(form, `acquisitionCosts.infrastructure.${column}`)}
                placeholder="Insertar valor"
                className="flex-1 min-w-0 font-['Inter',sans-serif] bg-white border-0 outline-none
                text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full"
              />
            </EBusFormField>
          </div>
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
          return <div className="flex items-center gap-1 bg-[#f1f1f1] h-full min-h-[20px] battery-cell-disabled" />;
        }

        return (
          <div className="flex items-center gap-1">
            <DollarSignStyled currencyPrefix={currencyPrefix} />
            <EBusFormField
              required
              value={rawValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <Input
                value={displayValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleValidacionInputChange(AcquisitionCostsColumnIds.battery, column, e.target.value)
                }
                {...createDefaultValueFocusHandler(form, `acquisitionCosts.battery.${column}`)}
                placeholder="Insertar valor"
                className="flex-1 min-w-0 font-['Inter',sans-serif] bg-white border-0 outline-none
                text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full"
              />
            </EBusFormField>
          </div>
        );
      },
    },
  ];
}
