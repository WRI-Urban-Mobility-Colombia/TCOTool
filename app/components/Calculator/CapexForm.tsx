'use client';

import React from 'react';
import { When } from 'vizonomy';
import { EBusSelect } from './components/eBusSelect';
import { EBusTable } from '../EBusTable';
import { EBusToggle } from '../EBusToggle';
import { InformationTooltip } from '../InformationTooltip';
import {
  formatPercentage,
  formatCurrency,
  extractNumericValue,
  extractNumericValueWithMax,
  clampMinNumberString,
  clampDecimalRange,
} from '@/lib/utils';
import { createDefaultValueFocusHandler } from './CalculatorForm.utils';
import { useCapexForm } from './hooks/useCapexForm';
import {
  DEFAULT_VALUES,
  FormInputVariant,
  FormSectionGap,
  FORM_LABELS,
  InputType,
  ButtonVariant,
  ButtonWidthVariant,
  IncentiveType,
  Currency,
  INPUT_VALIDATION,
} from './CalculatorForm.constants';
import {
  InputFormLabel,
  FormSectionTitle,
  CapexDescription,
  ValuesContainerStyled,
  FormInput,
  FormsContainer,
  FormSection,
  FormHeaderContainer,
  FormToggleContainer,
  FormCurrencyContainer,
  ShrinkZeroContainer,
  FormButton,
} from './CalculatorForm.styled';
import {
  TypologyTooltip,
  TrmTooltip,
  EligibilityTooltip,
} from '../InformationTooltip/InformationTooltipContent.styled';
import { EBusFormField } from './components/EBusFormField';
import type { CapexFormProps } from './CalculatorForm.types';

export function CapexForm(props: CapexFormProps) {
  const {
    form,
    handleContinue,
    submitAttempted,
    insertDefaultValues,
    handleAcquisitionCostsToggle,
    currency,
    setCurrency,
    getCurrencyPrefix,
    validacionTableData,
    validacionColumns,
    typologySelectOptions,
    incentiveTypeSelectOptions,
    incentiveEligibilitySelectOptions,
    currencySelectOptions,
  } = useCapexForm(props);

  return (
    <FormsContainer>
      <FormSection>
        <FormSectionTitle>{FORM_LABELS.TITLES.sectionCapital}</FormSectionTitle>
        <CapexDescription />
        <EBusFormField
          title={FORM_LABELS.TITLES.typology}
          tooltipText={<TypologyTooltip />}
          required
          value={form.values.typology}
          defaultValue={DEFAULT_VALUES.typology}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <EBusSelect
            value={form.values.typology}
            onChange={(value: string) => form.setValue('typology', value)}
            options={typologySelectOptions}
            placeholder={FORM_LABELS.PLACEHOLDERS.default}
          />
        </EBusFormField>

        <EBusFormField
          title={FORM_LABELS.TITLES.busesNumber}
          required
          value={form.values.busesNumber}
          defaultValue={DEFAULT_VALUES.busesNumber}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <FormInput
            type={InputType.number}
            value={form.values.busesNumber}
            min={INPUT_VALIDATION.BUSES_NUMBER_MIN}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const fixedValue = clampMinNumberString(e.target.value, INPUT_VALIDATION.BUSES_NUMBER_MIN);
              form.setValue('busesNumber', fixedValue);
            }}
            placeholder={FORM_LABELS.PLACEHOLDERS.busesNumber}
            {...createDefaultValueFocusHandler(form, 'busesNumber')}
          />
        </EBusFormField>

        <EBusFormField
          title={FORM_LABELS.TITLES.chargersPerBus}
          required
          value={form.values.chargersPerBus}
          defaultValue={DEFAULT_VALUES.chargersPerBus}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <FormInput
            type={InputType.number}
            value={form.values.chargersPerBus}
            min={INPUT_VALIDATION.CHARGERS_PER_BUS_MIN}
            max={INPUT_VALIDATION.CHARGERS_PER_BUS_MAX}
            step={INPUT_VALIDATION.CHARGERS_PER_BUS_STEP}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const fixedValue = clampDecimalRange(
                e.target.value,
                INPUT_VALIDATION.CHARGERS_PER_BUS_MIN,
                INPUT_VALIDATION.CHARGERS_PER_BUS_MAX,
                INPUT_VALIDATION.CHARGERS_PER_BUS_DECIMAL_PLACES
              );
              form.setValue('chargersPerBus', fixedValue);
            }}
            placeholder={FORM_LABELS.PLACEHOLDERS.chargersPerBus}
            {...createDefaultValueFocusHandler(form, 'chargersPerBus')}
          />
        </EBusFormField>

        <EBusFormField
          title={FORM_LABELS.TITLES.trm}
          tooltipText={<TrmTooltip />}
          required
          value={form.values.trm}
          defaultValue={DEFAULT_VALUES.trm}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <FormInput
            variant={FormInputVariant.flex1}
            type={InputType.text}
            value={form.values.trm}
            formatter={(value: string) => formatCurrency(value, getCurrencyPrefix())}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setValue('trm', extractNumericValue(e.target.value))
            }
            {...createDefaultValueFocusHandler(form, 'trm')}
            placeholder={FORM_LABELS.PLACEHOLDERS.insertValue}
          />
        </EBusFormField>

        <EBusFormField
          title={FORM_LABELS.TITLES.incentiveType}
          required
          value={form.values.incentiveType}
          defaultValue={DEFAULT_VALUES.incentiveType}
          submitAttempted={submitAttempted}
          requiredMessage={FORM_LABELS.REQUIRED.default}
        >
          <EBusSelect
            value={form.values.incentiveType}
            onChange={(value: string) => form.setValue('incentiveType', value)}
            options={incentiveTypeSelectOptions}
            placeholder={FORM_LABELS.PLACEHOLDERS.default}
          />
        </EBusFormField>

        <When
          condition={
            form.values.incentiveType === IncentiveType.percentage ||
            form.values.incentiveType === IncentiveType.amountOfMoney
          }
        >
          <EBusFormField
            title={FORM_LABELS.TITLES.eligibility}
            tooltipText={<EligibilityTooltip />}
            required
            value={form.values.eligibility}
            defaultValue={DEFAULT_VALUES.eligibility}
            submitAttempted={submitAttempted}
            requiredMessage={FORM_LABELS.REQUIRED.default}
          >
            <EBusSelect
              value={form.values.eligibility}
              onChange={(value: string) => form.setValue('eligibility', value)}
              options={incentiveEligibilitySelectOptions}
              placeholder={FORM_LABELS.PLACEHOLDERS.default}
            />
          </EBusFormField>
        </When>

        <When condition={form.values.incentiveType === IncentiveType.percentage}>
          <EBusFormField
            title={FORM_LABELS.TITLES.incentivePercentage}
            required
            value={form.values.incentivePercentage}
            defaultValue={DEFAULT_VALUES.incentivePercentage}
            submitAttempted={submitAttempted}
            requiredMessage={FORM_LABELS.REQUIRED.default}
          >
            <FormInput
              type={InputType.text}
              value={form.values.incentivePercentage}
              formatter={formatPercentage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                form.setValue('incentivePercentage', extractNumericValueWithMax(e.target.value, 100))
              }
              {...createDefaultValueFocusHandler(form, 'incentivePercentage')}
              placeholder={FORM_LABELS.PLACEHOLDERS.zeroPercent}
            />
          </EBusFormField>
        </When>

        <When condition={form.values.incentiveType === IncentiveType.amountOfMoney}>
          <EBusFormField
            title={FORM_LABELS.TITLES.incentiveAmountCOP}
            required
            value={form.values.incentiveAmountCOP}
            defaultValue={DEFAULT_VALUES.incentiveAmountCOP}
            submitAttempted={submitAttempted}
            requiredMessage={FORM_LABELS.REQUIRED.default}
          >
            <ValuesContainerStyled>
              <FormInput
                variant={FormInputVariant.flex1}
                type={InputType.text}
                value={form.values.incentiveAmountCOP}
                formatter={(value: string) => formatCurrency(value, getCurrencyPrefix())}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  form.setValue('incentiveAmountCOP', extractNumericValue(e.target.value))
                }
                placeholder={FORM_LABELS.PLACEHOLDERS.zero}
                {...createDefaultValueFocusHandler(form, 'incentiveAmountCOP')}
              />
            </ValuesContainerStyled>
          </EBusFormField>
        </When>
      </FormSection>

      <FormSection gap={FormSectionGap.small}>
        <FormHeaderContainer>
          <FormToggleContainer>
            <InputFormLabel disableTooltip>{FORM_LABELS.TITLES.acquisitionCost}</InputFormLabel>
            <ValuesContainerStyled>
              <EBusToggle
                label={FORM_LABELS.PLACEHOLDERS.insertDefaultValues}
                checked={insertDefaultValues}
                onClick={() => {
                  handleAcquisitionCostsToggle(!insertDefaultValues);
                }}
              />
              <ShrinkZeroContainer>
                <InformationTooltip text="" />
              </ShrinkZeroContainer>
            </ValuesContainerStyled>
          </FormToggleContainer>
          <FormCurrencyContainer>
            <EBusSelect
              value={currency}
              onChange={(value: string) => {
                setCurrency(value as Currency);
              }}
              options={currencySelectOptions}
              placeholder={FORM_LABELS.PLACEHOLDERS.default}
            />
          </FormCurrencyContainer>
        </FormHeaderContainer>

        <EBusTable
          title={FORM_LABELS.TITLES.validationInsumos}
          data={validacionTableData}
          columns={validacionColumns}
        />
      </FormSection>

      <FormButton
        variant={ButtonVariant.primary}
        buttonLabel={FORM_LABELS.BUTTONS.continue}
        onClick={handleContinue}
        widthVariant={ButtonWidthVariant.full}
      />
    </FormsContainer>
  );
}
