'use client';

import React from 'react';
import { When } from 'vizonomy';
import { EBusSelect } from './components/eBusSelect';
import {
  FormSectionTitle,
  ReferenceDescription,
  FormInput,
  FormsContainer,
  FormSection,
  FormButtonsContainer,
  FormButton,
} from './CalculatorForm.styled';
import { EBusFormField } from './components/EBusFormField';
import {
  DEFAULT_VALUES,
  FORM_LABELS,
  InputType,
  ButtonVariant,
  AdditionalOperatingExpensesType,
} from './CalculatorForm.constants';
import type { ReferenceFormProps } from './CalculatorForm.types';
import { useReferenceForm } from './hooks/useReferenceForm';

export function ReferenceForm(props: ReferenceFormProps) {
  const {
    form,
    handleContinue,
    submitAttempted,
    onBack,
    tipoOptions,
    handleAdditionalOperatingExpensesChange,
    getQuantityFormatter,
    getQuantityPlaceholder,
  } = useReferenceForm(props);

  return (
    <FormsContainer>
      <FormSection>
        <FormSectionTitle>{FORM_LABELS.TITLES.sectionReference}</FormSectionTitle>
        <ReferenceDescription />
        <EBusFormField
          title={FORM_LABELS.TITLES.type}
          required
          value={form.values.additionalOperatingExpenses.type}
          defaultValue={DEFAULT_VALUES.additionalOperatingExpenses.type}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <EBusSelect
            value={form.values.additionalOperatingExpenses.type}
            onChange={(value: string) => handleAdditionalOperatingExpensesChange('type', value)}
            options={tipoOptions}
            placeholder={FORM_LABELS.PLACEHOLDERS.default}
          />
        </EBusFormField>

        <When condition={form.values.additionalOperatingExpenses.type !== AdditionalOperatingExpensesType.none}>
          <EBusFormField
            title={FORM_LABELS.TITLES.quantity}
            required
            value={form.values.additionalOperatingExpenses.quantity}
            defaultValue={DEFAULT_VALUES.additionalOperatingExpenses.quantity}
            submitAttempted={submitAttempted}
            requiredMessage={FORM_LABELS.REQUIRED.default}
          >
            <FormInput
              type={InputType.text}
              value={form.values.additionalOperatingExpenses.quantity}
              formatter={getQuantityFormatter()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAdditionalOperatingExpensesChange('quantity', e.target.value)
              }
              placeholder={getQuantityPlaceholder()}
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
          buttonLabel={FORM_LABELS.BUTTONS.calculate}
          onClick={handleContinue}
        />
      </FormButtonsContainer>
    </FormsContainer>
  );
}
