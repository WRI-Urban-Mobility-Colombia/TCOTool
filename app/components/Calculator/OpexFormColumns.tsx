import React from 'react';
import { Input } from 'vizonomy';
import type { TableColumn } from 'vizonomy';
import type {
  ConsumoTableRow,
  TecnologiaTableRow,
  CombustibleTableRow,
  ConsumptionValidationKmUnitAcProps,
  ValidationMaintenancePerKilometerProps,
  CalculatorFormData,
} from './CalculatorForm.types';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import { formatNumberThousands } from '@/lib/utils';
import { DollarSignStyled } from './CalculatorForm.styled';
import { EBusSelect } from './components/eBusSelect';
import { EBusFormField } from './components/EBusFormField';
import {
  RiskIncrease,
  RISK_INCREASE_LABELS,
  DEFAULT_VALUES,
  FieldTablesId,
  FuelCostsColumnIds,
  TechnologyType,
} from './CalculatorForm.constants';
import { createSelectOptionsFromEnum, createDefaultValueFocusHandler } from './CalculatorForm.utils';

function SuffixText({ children }: { children: React.ReactNode }) {
  return <span className="shrink-0 font-['Inter',sans-serif] text-[#3d3b3b] whitespace-nowrap">{children}</span>;
}

interface ConsumoColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  consumptionUnitKm: {
    consumptionValidationKmUnitAc: ConsumptionValidationKmUnitAcProps;
  };
  handleConsumoInputChange: (
    column: 'consumptionValidationKmUnitAc',
    row: 'dieselKmGallon' | 'gasKmM3' | 'electricityKmKwh',
    value: string
  ) => void;
  submitAttempted?: boolean;
  fuelCostToggle: boolean;
  defaultValues: {
    dieselKmGallon: string;
    gasKmM3: string;
    electricityKmKwh: string;
  };
}

interface TecnologiaColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  technology: {
    validationMaintenancePerKilometer: ValidationMaintenancePerKilometerProps;
  };
  handleTecnologiaInputChange: (
    column: 'validationMaintenancePerKilometer',
    row: 'dieselCOPKm' | 'gasCOPKm' | 'electricityCOPKm',
    value: string
  ) => void;
  submitAttempted?: boolean;
  maintenanceToggle: boolean;
  defaultValues: ValidationMaintenancePerKilometerProps;
}

export function createConsumoColumns({
  form,
  consumptionUnitKm,
  handleConsumoInputChange,
  submitAttempted,
  fuelCostToggle,
  defaultValues,
}: ConsumoColumnsProps): TableColumn<ConsumoTableRow>[] {
  const getRowKey = (row: ConsumoTableRow): 'dieselKmGallon' | 'gasKmM3' | 'electricityKmKwh' => {
    if (row.id === 'diesel') return 'dieselKmGallon';
    if (row.id === 'gnv') return 'gasKmM3';
    return 'electricityKmKwh';
  };

  return [
    {
      id: FieldTablesId.consumption,
      key: FieldTablesId.consumption,
      label: 'Tecnología',
      width: '33%',
      render: (value: string) => (
        <span className="text-xs sm:text-sm font-['Inter',sans-serif] text-[#3d3b3b]">{value}</span>
      ),
    },
    {
      id: FieldTablesId.validation,
      key: FieldTablesId.validation,
      label: 'Consumo Energético (kilómetros por unidad)',
      width: '67%',
      render: (_value: string | null, row: ConsumoTableRow) => {
        const rowKey = getRowKey(row);
        const rawValue = consumptionUnitKm.consumptionValidationKmUnitAc[rowKey] ?? '';

        let suffix: string;
        let defaultInputValue: string;
        if (rowKey === 'dieselKmGallon') {
          suffix = 'Km/gal';
          defaultInputValue = defaultValues.dieselKmGallon;
        } else if (rowKey === 'gasKmM3') {
          suffix = 'Km/m3';
          defaultInputValue = defaultValues.gasKmM3;
        } else {
          suffix = 'Km/kWh';
          defaultInputValue = defaultValues.electricityKmKwh;
        }

        const defaultValue = DEFAULT_VALUES.consumptionUnitKm.consumptionValidationKmUnitAc[rowKey] ?? '';
        const displayValue = fuelCostToggle ? defaultInputValue : rawValue;

        return (
          <div className="flex items-center gap-1">
            <EBusFormField
              required
              value={displayValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <Input
                value={displayValue}
                disabled={fuelCostToggle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleConsumoInputChange('consumptionValidationKmUnitAc', rowKey, e.target.value)
                }
                {...(!fuelCostToggle
                  ? createDefaultValueFocusHandler(form, `consumptionUnitKm.consumptionValidationKmUnitAc.${rowKey}`)
                  : {})}
                placeholder="Insertar valor"
                className="flex-1 min-w-0 font-['Inter',sans-serif] text-sm bg-white border-0 outline-none
                text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full
                disabled:cursor-not-allowed"
              />
            </EBusFormField>
            <SuffixText>{suffix}</SuffixText>
          </div>
        );
      },
    },
  ];
}

export function createTecnologiaColumns({
  form,
  technology,
  handleTecnologiaInputChange,
  submitAttempted,
  maintenanceToggle,
  defaultValues,
}: TecnologiaColumnsProps): TableColumn<TecnologiaTableRow>[] {
  const getRowKey = (id: string): 'dieselCOPKm' | 'gasCOPKm' | 'electricityCOPKm' => {
    if (id === 'diesel') return 'dieselCOPKm';
    if (id === 'gnv') return 'gasCOPKm';
    return 'electricityCOPKm';
  };

  return [
    {
      id: FieldTablesId.technology,
      key: FieldTablesId.technology,
      label: 'Tecnología',
      width: '33%',
      render: (value: string) => (
        <span className="text-xs sm:text-sm font-['Inter',sans-serif] text-[#3d3b3b]">{value}</span>
      ),
    },
    {
      id: FieldTablesId.validation,
      key: FieldTablesId.validation,
      label: 'Costo de Mantenimiento por Kilómetro',
      width: '67%',
      render: (_value: number, row: TecnologiaTableRow) => {
        const rowKey = getRowKey(row.id);
        const rawValue = technology.validationMaintenancePerKilometer[rowKey] ?? '';

        let defaultInputValue: string;
        if (rowKey === 'dieselCOPKm') {
          defaultInputValue = defaultValues.dieselCOPKm;
        } else if (rowKey === 'gasCOPKm') {
          defaultInputValue = defaultValues.gasCOPKm;
        } else {
          defaultInputValue = defaultValues.electricityCOPKm;
        }

        const defaultValue = DEFAULT_VALUES.technology.validationMaintenancePerKilometer[rowKey] ?? '';
        const displayValue = maintenanceToggle ? defaultInputValue : rawValue;

        return (
          <div className="flex items-center gap-1">
            <DollarSignStyled />
            <EBusFormField
              required
              value={displayValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <Input
                value={formatNumberThousands(displayValue)}
                disabled={maintenanceToggle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleTecnologiaInputChange('validationMaintenancePerKilometer', rowKey, e.target.value)
                }
                {...(!maintenanceToggle
                  ? createDefaultValueFocusHandler(form, `technology.validationMaintenancePerKilometer.${rowKey}`)
                  : {})}
                placeholder="Insertar valor"
                className="flex-1 min-w-0 font-['Inter',sans-serif] text-sm bg-white border-0 outline-none
                text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full
                disabled:cursor-not-allowed"
              />
            </EBusFormField>
          </div>
        );
      },
    },
  ];
}

interface CombustibleColumnsProps {
  form: UseFormReturn<CalculatorFormData>;
  fuel: {
    price: {
      dieselCOPGallon: string;
      gasCOPM3: string;
      electricityCOPKwh: string;
    };
    increaseRisk: {
      dieselCOPGallon: string;
      gasCOPM3: string;
      electricityCOPKwh: string;
    };
  };
  handleCombustibleInputChange: (
    column: 'price' | 'increaseRisk',
    row: 'dieselCOPGallon' | 'gasCOPM3' | 'electricityCOPKwh',
    value: string
  ) => void;
  submitAttempted?: boolean;
}

export function createCombustibleColumns({
  form,
  fuel,
  handleCombustibleInputChange,
  submitAttempted,
}: CombustibleColumnsProps): TableColumn<CombustibleTableRow>[] {
  const getRowKey = (id: string): 'dieselCOPGallon' | 'gasCOPM3' | 'electricityCOPKwh' => {
    if (id === 'diesel') return 'dieselCOPGallon';
    if (id === 'gnv') return 'gasCOPM3';
    return 'electricityCOPKwh';
  };

  const riskIncreaseOptions = createSelectOptionsFromEnum(RiskIncrease, RISK_INCREASE_LABELS);

  return [
    {
      id: FieldTablesId.fuel,
      key: FieldTablesId.fuel,
      label: 'Combustible',
      width: '33%',
      render: (value: string) => (
        <span className="text-xs sm:text-sm font-['Inter',sans-serif] text-[#3d3b3b]">{value}</span>
      ),
    },
    {
      id: FuelCostsColumnIds.price,
      key: FuelCostsColumnIds.price,
      label: 'Precio',
      width: '33%',
      render: (_value: number, row: CombustibleTableRow) => {
        const rowKey = getRowKey(row.id);
        const currentValue = fuel.price[rowKey] ?? '';
        const defaultValue = DEFAULT_VALUES.fuel.price[rowKey] ?? '';

        return (
          <div className="flex items-center gap-1">
            <DollarSignStyled />
            <EBusFormField
              required
              value={currentValue}
              defaultValue={defaultValue}
              submitAttempted={submitAttempted ?? false}
              variant="table"
            >
              <Input
                value={formatNumberThousands(currentValue)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCombustibleInputChange('price', rowKey, e.target.value)
                }
                {...createDefaultValueFocusHandler(form, `fuel.price.${rowKey}`)}
                placeholder="Insertar valor"
                className="flex-1 min-w-0 font-['Inter',sans-serif] text-sm bg-white border-0 outline-none
                text-[#3d3b3b] rounded-[4px] text-right max-w-full w-full"
              />
            </EBusFormField>
          </div>
        );
      },
    },
    {
      id: FuelCostsColumnIds.increaseRisk,
      key: FuelCostsColumnIds.increaseRisk,
      label: 'Riesgo de Incremento',
      width: '34%',
      render: (_value: string, row: CombustibleTableRow) => {
        const rowKey = getRowKey(row.id);
        const isLastRow = row.id === TechnologyType.electric;
        const selectValue = fuel.increaseRisk[rowKey] ?? '';
        const defaultValue = DEFAULT_VALUES.fuel.increaseRisk[rowKey] ?? '';

        return (
          <EBusFormField
            title=""
            value={selectValue}
            defaultValue={defaultValue}
            required
            submitAttempted={submitAttempted ?? false}
            disableTooltip
            variant="table"
          >
            <EBusSelect
              value={selectValue}
              onChange={(value: string) => handleCombustibleInputChange('increaseRisk', rowKey, value)}
              options={riskIncreaseOptions}
              placeholder="Seleccione una opción"
              variant="table"
              isLastRow={isLastRow}
            />
          </EBusFormField>
        );
      },
    },
  ];
}
