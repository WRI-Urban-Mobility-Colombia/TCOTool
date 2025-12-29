'use client';

import React from 'react';
import { Input, Button, When } from 'vizonomy';
import { EBusSelect } from './components/eBusSelect';
import { EBusButton } from '../EBusButton';
import { EBusTable } from '../EBusTable';
import { InformationTooltip } from '../InformationTooltip';
import {
  formatPercentage,
  formatCurrency,
  extractNumericValue,
  extractNumericValueWithMax,
  clampMinNumberString,
  clampDecimalRange,
} from '@/lib/utils';
import {
  TYPLOGY_LABELS,
  Typology,
  IncentiveType,
  INCENTIVE_TYPE_LABELS,
  IncentiveEligibility,
  INCENTIVE_ELIGIBILITY_LABELS,
  TechnologyType,
  Currency,
  CURRENCY_LABELS,
  FieldTablesId,
  AcquisitionCostsColumnIds,
} from './CalculatorForm.constants';
import { useCurrency } from './CurrencyContext';
import { createValidacionColumns } from './CalculatorFormColumns';
import {
  createSelectOptionsFromEnum,
  setNestedFormValue,
  createDefaultValueFocusHandler,
  createTableData,
} from './CalculatorForm.utils';
import { DEFAULT_VALUES } from './CalculatorForm.constants';
import { InputFormLabel, FormSectionTitle, CapexDescription } from './CalculatorForm.styled';
import {
  TypologyTooltip,
  TrmTooltip,
  EligibilityTooltip,
} from '../InformationTooltip/InformationTooltipContent.styled';
import { EBusFormField } from './components/EBusFormField';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import type { CalculatorFormData, ValidacionTableRow } from './CalculatorForm.types';

interface CapexFormProps {
  form: UseFormReturn<CalculatorFormData>;
  handleContinue: () => void;
  submitAttempted: boolean;
  insertDefaultValues: boolean;
  handleAcquisitionCostsToggle: (value: boolean) => void;
}

export function CapexForm({
  form,
  handleContinue,
  submitAttempted,
  insertDefaultValues,
  handleAcquisitionCostsToggle,
}: CapexFormProps) {
  const { currency, setCurrency, getCurrencyPrefix } = useCurrency();

  const validacionTableData = createTableData<ValidacionTableRow>(FieldTablesId.validation, FieldTablesId.technology);

  const typologySelectOptions = createSelectOptionsFromEnum(Typology, TYPLOGY_LABELS);
  const incentiveTypeSelectOptions = createSelectOptionsFromEnum(IncentiveType, INCENTIVE_TYPE_LABELS);
  const incentiveEligibilitySelectOptions = createSelectOptionsFromEnum(
    IncentiveEligibility,
    INCENTIVE_ELIGIBILITY_LABELS
  );
  const currencySelectOptions = createSelectOptionsFromEnum(Currency, CURRENCY_LABELS);

  const handleValidacionInputChange = (column: AcquisitionCostsColumnIds, row: TechnologyType, value: string) => {
    setNestedFormValue(form, 'acquisitionCosts', column, row, value, true);
  };

  const validacionColumns = createValidacionColumns({
    form,
    acquisitionCosts: form.values.acquisitionCosts,
    handleValidacionInputChange,
    currencyPrefix: getCurrencyPrefix(),
    submitAttempted,
  });

  return (
    <div className="forms-container">
      <div className="mb-6 flex flex-col gap-4">
        <FormSectionTitle>Gasto de Capital</FormSectionTitle>
        <CapexDescription />
        <EBusFormField
          title="Tipología"
          tooltipText={<TypologyTooltip />}
          required
          value={form.values.typology}
          defaultValue={DEFAULT_VALUES.typology}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <EBusSelect
            value={form.values.typology}
            onChange={(value: string) => form.setValue('typology', value)}
            options={typologySelectOptions}
            placeholder="Seleccione una opción"
          />
        </EBusFormField>

        <EBusFormField
          title="Número de buses"
          required
          value={form.values.busesNumber}
          defaultValue={DEFAULT_VALUES.busesNumber}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <Input
            type="number"
            value={form.values.busesNumber}
            min={1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const fixedValue = clampMinNumberString(e.target.value, 1);
              form.setValue('busesNumber', fixedValue);
            }}
            placeholder="Ingrese número de buses"
            {...createDefaultValueFocusHandler(form, 'busesNumber')}
            className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px] border border-solid border-[#c9c9c9]
            bg-white text-[#3d3b3b] px-3 py-2"
          />
        </EBusFormField>

        <EBusFormField
          title="Cargadores por bus"
          required
          value={form.values.chargersPerBus}
          defaultValue={DEFAULT_VALUES.chargersPerBus}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <Input
            type="number"
            value={form.values.chargersPerBus}
            min={0}
            max={1}
            step={0.1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const fixedValue = clampDecimalRange(e.target.value, 0, 1, 2);
              form.setValue('chargersPerBus', fixedValue);
            }}
            placeholder="Ingrese cargadores por bus"
            {...createDefaultValueFocusHandler(form, 'chargersPerBus')}
            className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px] border border-solid border-[#c9c9c9]
            bg-white text-[#3d3b3b] px-3 py-2"
          />
        </EBusFormField>

        <EBusFormField
          title="TRM"
          tooltipText={<TrmTooltip />}
          required
          value={form.values.trm}
          defaultValue={DEFAULT_VALUES.trm}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <Input
            type="text"
            value={form.values.trm}
            formatter={(value: string) => formatCurrency(value, getCurrencyPrefix())}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setValue('trm', extractNumericValue(e.target.value))
            }
            {...createDefaultValueFocusHandler(form, 'trm')}
            placeholder="Insertar valor"
            className="flex-1 font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
            border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2"
          />
        </EBusFormField>

        <EBusFormField
          title="Tipo de Incentivo"
          required
          value={form.values.incentiveType}
          defaultValue={DEFAULT_VALUES.incentiveType}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <EBusSelect
            value={form.values.incentiveType}
            onChange={(value: string) => form.setValue('incentiveType', value)}
            options={incentiveTypeSelectOptions}
            placeholder="Seleccione una opción"
          />
        </EBusFormField>

        <When
          condition={
            form.values.incentiveType === IncentiveType.percentage ||
            form.values.incentiveType === IncentiveType.amountOfMoney
          }
        >
          <EBusFormField
            title="Elegibilidad"
            tooltipText={<EligibilityTooltip />}
            required
            value={form.values.eligibility}
            defaultValue={DEFAULT_VALUES.eligibility}
            submitAttempted={submitAttempted}
            requiredMessage="Este campo es obligatorio"
          >
            <EBusSelect
              value={form.values.eligibility}
              onChange={(value: string) => form.setValue('eligibility', value)}
              options={incentiveEligibilitySelectOptions}
              placeholder="Seleccione una opción"
            />
          </EBusFormField>
        </When>

        <When condition={form.values.incentiveType === IncentiveType.percentage}>
          <EBusFormField
            title="Porcentaje de incentivo"
            required
            value={form.values.incentivePercentage}
            defaultValue={DEFAULT_VALUES.incentivePercentage}
            submitAttempted={submitAttempted}
            requiredMessage="Este campo es obligatorio"
          >
            <Input
              type="text"
              value={form.values.incentivePercentage}
              formatter={formatPercentage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                form.setValue('incentivePercentage', extractNumericValueWithMax(e.target.value, 100))
              }
              {...createDefaultValueFocusHandler(form, 'incentivePercentage')}
              placeholder="0%"
              className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px] border border-solid border-[#c9c9c9]
            bg-white text-[#3d3b3b] px-3 py-2"
            />
          </EBusFormField>
        </When>

        <When condition={form.values.incentiveType === IncentiveType.amountOfMoney}>
          <EBusFormField
            title="Monto de incentivo (COP) por Bus"
            required
            value={form.values.incentiveAmountCOP}
            defaultValue={DEFAULT_VALUES.incentiveAmountCOP}
            submitAttempted={submitAttempted}
            requiredMessage="Este campo es obligatorio"
          >
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={form.values.incentiveAmountCOP}
                formatter={(value: string) => formatCurrency(value, getCurrencyPrefix())}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('incentiveAmountCOP', extractNumericValue(e.target.value))
                }
                placeholder="0"
                {...createDefaultValueFocusHandler(form, 'incentiveAmountCOP')}
                className="flex-1 font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
              border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2
             "
              />
            </div>
          </EBusFormField>
        </When>
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <InputFormLabel disableTooltip>Costo de Adquisición</InputFormLabel>
            <div className="flex items-center gap-2">
              <Button
                type="default"
                onClick={() => {
                  handleAcquisitionCostsToggle(!insertDefaultValues);
                }}
                className="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors
                  focus:outline-none"
                style={{
                  backgroundColor: insertDefaultValues ? '#F0AB00' : '#c9c9c9',
                  padding: '2.7px',
                }}
              >
                <span
                  className={`absolute inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                    insertDefaultValues ? 'translate-x-[13px]' : 'translate-x-0'
                  }`}
                />
              </Button>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sm text-[#3d3b3b] whitespace-nowrap">Insertar valores predeterminados</span>
                <div className="shrink-0">
                  <InformationTooltip text="" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-[230px]">
            <EBusSelect
              value={currency}
              onChange={(value: string) => {
                setCurrency(value as Currency);
              }}
              options={currencySelectOptions}
              placeholder="Seleccione una opción"
            />
          </div>
        </div>

        <EBusTable title="Validacion de Insumos" data={validacionTableData} columns={validacionColumns} />
      </div>

      <EBusButton variant="primary" buttonLabel="Continuar" onClick={handleContinue} className="h-[40px] w-full" />
    </div>
  );
}
