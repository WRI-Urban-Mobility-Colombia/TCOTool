'use client';

import React from 'react';
import { When } from 'vizonomy';
import { EBusSelect } from './components/eBusSelect';
import { formatPercentage, extractNumericValueWithMax } from '@/lib/utils';
import { SpecialEligibility, SPECIAL_ELIGIBILITY_LABELS, InputType, ButtonVariant } from './CalculatorForm.constants';
import { createSelectOptionsFromEnum, createDefaultValueFocusHandler } from './CalculatorForm.utils';
import {
  FormSectionTitle,
  FinexDescription,
  FormInput,
  FormsContainer,
  FormSection,
  FormButtonsContainer,
  FormButton,
} from './CalculatorForm.styled';
import { InterestEaTooltip } from '../InformationTooltip/InformationTooltipContent.styled';
import { EBusFormField } from './components/EBusFormField';
import type { FinexFormProps } from './CalculatorForm.types';
import { DEFAULT_VALUES, FORM_LABELS } from './CalculatorForm.constants';

export function FinexForm({ form, handleContinue, submitAttempted, onBack }: FinexFormProps) {
  const elegibilidadEspecialOptions = createSelectOptionsFromEnum(SpecialEligibility, SPECIAL_ELIGIBILITY_LABELS);

  return (
    <FormsContainer>
      <FormSection>
        <FormSectionTitle>{FORM_LABELS.TITLES.sectionFinancial}</FormSectionTitle>
        <FinexDescription />
        <EBusFormField
          title={FORM_LABELS.TITLES.interestEA}
          tooltipText={<InterestEaTooltip />}
          required
          value={form.values.interestEA}
          defaultValue={DEFAULT_VALUES.interestEA}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <FormInput
            type={InputType.text}
            value={form.values.interestEA}
            formatter={formatPercentage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setValue('interestEA', extractNumericValueWithMax(e.target.value, 100))
            }
            {...createDefaultValueFocusHandler(form, 'interestEA')}
            placeholder={FORM_LABELS.PLACEHOLDERS.zeroPercent}
          />
        </EBusFormField>

        <EBusFormField
          title={FORM_LABELS.TITLES.specialEligibility}
          required
          value={form.values.specialEligibility}
          defaultValue={DEFAULT_VALUES.specialEligibility}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <EBusSelect
            value={form.values.specialEligibility}
            onChange={(value: string) => form.setValue('specialEligibility', value)}
            options={elegibilidadEspecialOptions}
            placeholder={FORM_LABELS.PLACEHOLDERS.default}
          />
        </EBusFormField>

        <When condition={form.values.specialEligibility !== SpecialEligibility.none}>
          <EBusFormField
            title={FORM_LABELS.TITLES.specialRateEA}
            required
            value={form.values.specialRateEA}
            defaultValue={DEFAULT_VALUES.specialRateEA}
            submitAttempted={submitAttempted}
            requiredMessage={FORM_LABELS.REQUIRED.default}
          >
            <FormInput
              type={InputType.text}
              value={form.values.specialRateEA}
              formatter={formatPercentage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                form.setValue('specialRateEA', extractNumericValueWithMax(e.target.value, 100))
              }
              {...createDefaultValueFocusHandler(form, 'specialRateEA')}
              placeholder={FORM_LABELS.PLACEHOLDERS.zeroPercent}
            />
          </EBusFormField>
        </When>
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
