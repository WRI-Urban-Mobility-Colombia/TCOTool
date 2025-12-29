'use client';

import React, { useState, useRef } from 'react';
import { Input, Button } from 'vizonomy';
import { EBusSelect } from './components/eBusSelect';
import { EBusButton } from '../EBusButton';
import { EBusTable } from '../EBusTable';
import { formatNumberThousands, extractNumericValue } from '@/lib/utils';
import { ACValue, AC_VALUE_LABELS, TechnologyType, DEFAULT_VALUES, FieldTablesId } from './CalculatorForm.constants';
import {
  createSelectOptionsFromEnum,
  setNestedFormValue,
  createDefaultValueFocusHandler,
  createTableData,
} from './CalculatorForm.utils';
import { FormSectionTitle, OpexDescription, InputFormLabel } from './CalculatorForm.styled';
import { AnnualKilometersTooltip, AcTooltip } from '../InformationTooltip/InformationTooltipContent.styled';
import { createConsumoColumns, createTecnologiaColumns, createCombustibleColumns } from './OpexFormColumns';
import { getBusDataByTechnology } from '../Results/ResultsSection.utils';
import type { BusRow } from '@/lib/utils/csvReader';
import { EBusFormField } from './components/EBusFormField';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import type {
  CalculatorFormData,
  CombustibleTableRow,
  ConsumoTableRow,
  ConsumptionValidationKmUnitAcProps,
  TecnologiaTableRow,
  ValidationMaintenancePerKilometerProps,
} from './CalculatorForm.types';

export interface OpexFormProps {
  form: UseFormReturn<CalculatorFormData>;
  className?: string;
  handleContinue: () => void;
  submitAttempted: boolean;
  onBack?: () => void;
  busesData: BusRow[];
}

export function OpexForm({ form, className, handleContinue, submitAttempted, onBack, busesData }: OpexFormProps) {
  const consumptionTableData = createTableData<ConsumoTableRow>(FieldTablesId.consumption);
  const technologyTableData = createTableData<TecnologiaTableRow>(FieldTablesId.technology);
  const fuelTableData = createTableData<CombustibleTableRow>(FieldTablesId.fuel);

  const acOptions = createSelectOptionsFromEnum(ACValue, AC_VALUE_LABELS);
  const [fuelCostToggle, setFuelCostToggle] = useState(true);
  const previousValuesRef = useRef<ConsumptionValidationKmUnitAcProps | null>(null);
  const [maintenanceToggle, setMaintenanceToggle] = useState(true);
  const previousMaintenanceValuesRef = useRef<ValidationMaintenancePerKilometerProps | null>(null);
  const { dieselKmGallon, gasKmM3, electricityKmKwh } = form.values.consumptionUnitKm.consumptionValidationKmUnitAc;
  const dieselBusData = getBusDataByTechnology(busesData, TechnologyType.diesel);
  const gnvBusData = getBusDataByTechnology(busesData, TechnologyType.gnv);
  const electricBusData = getBusDataByTechnology(busesData, TechnologyType.electric);

  const defaultConsumptionValues = {
    dieselKmGallon: dieselBusData?.consumptionKmUnitDefault ?? '',
    gasKmM3: gnvBusData?.consumptionKmUnitDefault ?? '',
    electricityKmKwh: electricBusData?.consumptionKmUnitDefault ?? '',
  };

  const { dieselCOPKm, gasCOPKm, electricityCOPKm } = form.values.technology.validationMaintenancePerKilometer;

  const defaultMaintenanceValues = {
    dieselCOPKm: dieselBusData?.maintenanceUSDKm ?? '',
    gasCOPKm: gnvBusData?.maintenanceUSDKm ?? '',
    electricityCOPKm: electricBusData?.maintenanceUSDKm ?? '',
  };

  const handleConsumoInputChange = (
    column: 'consumptionValidationKmUnitAc',
    row: 'dieselKmGallon' | 'gasKmM3' | 'electricityKmKwh',
    value: string
  ) => {
    setNestedFormValue(form, 'consumptionUnitKm', column, row, value, true);
  };

  const handleTecnologiaInputChange = (
    column: 'validationMaintenancePerKilometer',
    row: 'dieselCOPKm' | 'gasCOPKm' | 'electricityCOPKm',
    value: string
  ) => {
    setNestedFormValue(form, 'technology', column, row, value, true);
  };

  const handleFuelCostToggle = () => {
    const newToggleState = !fuelCostToggle;
    setFuelCostToggle(newToggleState);

    if (newToggleState) {
      previousValuesRef.current = { dieselKmGallon, gasKmM3, electricityKmKwh };

      form.setValue('consumptionUnitKm', {
        ...form.values.consumptionUnitKm,
        consumptionValidationKmUnitAc: defaultConsumptionValues,
      });
    } else if (!newToggleState && previousValuesRef.current) {
      form.setValue('consumptionUnitKm', {
        ...form.values.consumptionUnitKm,
        consumptionValidationKmUnitAc: previousValuesRef.current,
      });
      previousValuesRef.current = null;
    }
  };

  const handleMaintenanceToggle = () => {
    const newToggleState = !maintenanceToggle;
    setMaintenanceToggle(newToggleState);

    if (newToggleState) {
      previousMaintenanceValuesRef.current = { dieselCOPKm, gasCOPKm, electricityCOPKm };

      form.setValue('technology', {
        ...form.values.technology,
        validationMaintenancePerKilometer: defaultMaintenanceValues,
      });
    } else if (!newToggleState && previousMaintenanceValuesRef.current) {
      form.setValue('technology', {
        ...form.values.technology,
        validationMaintenancePerKilometer: previousMaintenanceValuesRef.current,
      });
      previousMaintenanceValuesRef.current = null;
    }
  };

  const consumptionColumns = createConsumoColumns({
    form,
    consumptionUnitKm: form.values.consumptionUnitKm,
    handleConsumoInputChange,
    submitAttempted,
    fuelCostToggle,
    defaultValues: defaultConsumptionValues,
  });

  const technologyColumns = createTecnologiaColumns({
    form,
    technology: form.values.technology,
    handleTecnologiaInputChange,
    submitAttempted,
    maintenanceToggle,
    defaultValues: defaultMaintenanceValues,
  });

  const handleCombustibleInputChange = (
    column: 'price' | 'increaseRisk',
    row: 'dieselCOPGallon' | 'gasCOPM3' | 'electricityCOPKwh',
    value: string
  ) => {
    const extractNumeric = column === 'price';
    setNestedFormValue(form, 'fuel', column, row, value, extractNumeric);
  };

  const combustibleColumns = createCombustibleColumns({
    form,
    fuel: form.values.fuel,
    handleCombustibleInputChange,
    submitAttempted,
  });

  return (
    <div className={`forms-container ${className ?? ''}`}>
      <div className="mb-6 flex flex-col gap-4">
        <FormSectionTitle>Gasto Operacional</FormSectionTitle>
        <OpexDescription />
        <EBusFormField
          title="Kilómetros Anuales por Bus"
          tooltipText={<AnnualKilometersTooltip />}
          required
          value={form.values.annualKilometers}
          defaultValue={DEFAULT_VALUES.annualKilometers}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <Input
            type="text"
            value={form.values.annualKilometers}
            formatter={(value: string) => formatNumberThousands(value)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setValue('annualKilometers', extractNumericValue(e.target.value))
            }
            {...createDefaultValueFocusHandler(form, 'annualKilometers')}
            placeholder="0"
            className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px] border border-solid border-[#c9c9c9]
            bg-white text-[#3d3b3b] px-3 py-2"
          />
        </EBusFormField>

        <EBusFormField
          title="A/C"
          tooltipText={<AcTooltip />}
          required
          value={form.values.ac}
          defaultValue={DEFAULT_VALUES.ac}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <EBusSelect
            value={form.values.ac}
            onChange={(value: string) => form.setValue('ac', value)}
            options={acOptions}
            placeholder="Seleccione una opción"
          />
        </EBusFormField>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <InputFormLabel disableTooltip>Eficiencia Energética</InputFormLabel>
          <div className="flex items-center gap-2">
            <Button
              type="default"
              onClick={handleFuelCostToggle}
              className="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors
                focus:outline-none"
              style={{
                backgroundColor: fuelCostToggle ? '#F0AB00' : '#c9c9c9',
                padding: '2.7px',
              }}
            >
              <span
                className={`absolute inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                  fuelCostToggle ? 'translate-x-[13px]' : 'translate-x-0'
                }`}
              />
            </Button>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-sm text-[#3d3b3b] whitespace-nowrap">Insertar valores predeterminados</span>
            </div>
          </div>
        </div>
        <EBusTable title="" data={consumptionTableData} columns={consumptionColumns} />

        <div className="flex flex-col gap-2">
          <InputFormLabel disableTooltip>Costo de Mantenimiento</InputFormLabel>
          <div className="flex items-center gap-2">
            <Button
              type="default"
              onClick={handleMaintenanceToggle}
              className="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors
                focus:outline-none"
              style={{
                backgroundColor: maintenanceToggle ? '#F0AB00' : '#c9c9c9',
                padding: '2.7px',
              }}
            >
              <span
                className={`absolute inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                  maintenanceToggle ? 'translate-x-[13px]' : 'translate-x-0'
                }`}
              />
            </Button>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-sm text-[#3d3b3b] whitespace-nowrap">Insertar valores predeterminados</span>
            </div>
          </div>
        </div>
        <EBusTable title="" data={technologyTableData} columns={technologyColumns} />

        <InputFormLabel disableTooltip>Costos de Combustibles e Incrementos</InputFormLabel>
        <EBusTable title="" data={fuelTableData} columns={combustibleColumns} />
      </div>

      <div className="flex gap-4">
        {onBack && <EBusButton variant="secondary" buttonLabel="Atrás" onClick={onBack} className="h-[40px] flex-1" />}
        <EBusButton variant="primary" buttonLabel="Continuar" onClick={handleContinue} className="h-[40px] flex-1" />
      </div>
    </div>
  );
}
