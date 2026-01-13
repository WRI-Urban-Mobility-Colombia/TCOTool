'use client';

import React from 'react';
import { EBusSelect } from './components/eBusSelect';
import { EBusTable } from '../EBusTable';
import { EBusToggle } from '../EBusToggle';
import { formatNumberThousands, extractNumericValue } from '@/lib/utils';
import { InputType, ButtonVariant } from './CalculatorForm.constants';
import { createDefaultValueFocusHandler } from './CalculatorForm.utils';
import {
  FormSectionTitle,
  OpexDescription,
  InputFormLabel,
  FormInput,
  FormsContainer,
  FormSection,
  FormButtonsContainer,
  FormLabelContainer,
  FormButton,
} from './CalculatorForm.styled';
import { AnnualKilometersTooltip, AcTooltip } from '../InformationTooltip/InformationTooltipContent.styled';
import { EBusFormField } from './components/EBusFormField';
import type { OpexFormProps } from './CalculatorForm.types';
import { DEFAULT_VALUES, FORM_LABELS } from './CalculatorForm.constants';
import { useOpexForm } from './hooks/useOpexForm';

export function OpexForm(props: OpexFormProps) {
  const {
    form,
    handleContinue,
    submitAttempted,
    onBack,
    consumptionTableData,
    technologyTableData,
    fuelTableData,
    acOptions,
    fuelCostToggle,
    maintenanceToggle,
    handleFuelCostToggle,
    handleMaintenanceToggle,
    consumptionColumns,
    technologyColumns,
    combustibleColumns,
  } = useOpexForm(props);

  return (
    <FormsContainer>
      <FormSection>
        <FormSectionTitle>{FORM_LABELS.TITLES.sectionOperational}</FormSectionTitle>
        <OpexDescription />
        <EBusFormField
          title={FORM_LABELS.TITLES.annualKilometers}
          tooltipText={<AnnualKilometersTooltip />}
          required
          value={form.values.annualKilometers}
          defaultValue={DEFAULT_VALUES.annualKilometers}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <FormInput
            type={InputType.text}
            value={form.values.annualKilometers}
            formatter={(value: string) => formatNumberThousands(value)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setValue('annualKilometers', extractNumericValue(e.target.value))
            }
            {...createDefaultValueFocusHandler(form, 'annualKilometers')}
            placeholder={FORM_LABELS.PLACEHOLDERS.zero}
          />
        </EBusFormField>

        <EBusFormField
          title={FORM_LABELS.TITLES.ac}
          tooltipText={<AcTooltip />}
          required
          value={form.values.ac}
          defaultValue={DEFAULT_VALUES.ac}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <EBusSelect
            value={form.values.ac}
            onChange={(value: string) => form.setValue('ac', value)}
            options={acOptions}
            placeholder={FORM_LABELS.PLACEHOLDERS.default}
          />
        </EBusFormField>
      </FormSection>

      <FormSection>
        <FormLabelContainer>
          <InputFormLabel disableTooltip>{FORM_LABELS.TITLES.energyEfficiency}</InputFormLabel>
          <EBusToggle
            label={FORM_LABELS.PLACEHOLDERS.insertDefaultValues}
            checked={fuelCostToggle}
            onClick={handleFuelCostToggle}
          />
        </FormLabelContainer>
        <EBusTable title="" data={consumptionTableData} columns={consumptionColumns} />

        <FormLabelContainer>
          <InputFormLabel disableTooltip>{FORM_LABELS.TITLES.maintenanceCost}</InputFormLabel>
          <EBusToggle
            label={FORM_LABELS.PLACEHOLDERS.insertDefaultValues}
            checked={maintenanceToggle}
            onClick={handleMaintenanceToggle}
          />
        </FormLabelContainer>
        <EBusTable title="" data={technologyTableData} columns={technologyColumns} />

        <InputFormLabel disableTooltip>{FORM_LABELS.TITLES.fuelCosts}</InputFormLabel>
        <EBusTable title="" data={fuelTableData} columns={combustibleColumns} />
      </FormSection>

      <FormButtonsContainer>
        {onBack && (
          <FormButton variant={ButtonVariant.secondary} buttonLabel={FORM_LABELS.BUTTONS.back} onClick={onBack} />
        )}
        <FormButton
          variant={ButtonVariant.primary}
          buttonLabel={FORM_LABELS.BUTTONS.continue}
          onClick={handleContinue}
        />
      </FormButtonsContainer>
    </FormsContainer>
  );
}
