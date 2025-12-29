'use client';

import React from 'react';
import { Input, When } from 'vizonomy';
import { EBusSelect } from './components/eBusSelect';
import { EBusButton } from '../EBusButton';
import { formatPercentage, extractNumericValueWithMax } from '@/lib/utils';
import { SpecialEligibility, SPECIAL_ELIGIBILITY_LABELS, DEFAULT_VALUES } from './CalculatorForm.constants';
import { createSelectOptionsFromEnum, createDefaultValueFocusHandler } from './CalculatorForm.utils';
import { FormSectionTitle, FinexDescription } from './CalculatorForm.styled';
import { InterestEaTooltip } from '../InformationTooltip/InformationTooltipContent.styled';
import { EBusFormField } from './components/EBusFormField';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import type { CalculatorFormData } from './CalculatorForm.types';

export interface FinexFormProps {
  form: UseFormReturn<CalculatorFormData>;
  className?: string;
  handleContinue: () => void;
  submitAttempted: boolean;
  onBack?: () => void;
}

export function FinexForm({ form, className, handleContinue, submitAttempted, onBack }: FinexFormProps) {
  const elegibilidadEspecialOptions = createSelectOptionsFromEnum(SpecialEligibility, SPECIAL_ELIGIBILITY_LABELS);

  return (
    <div className={`forms-container ${className ?? ''}`}>
      <div className="mb-6 flex flex-col gap-4">
        <FormSectionTitle>Gasto Financiero</FormSectionTitle>
        <FinexDescription />
        <EBusFormField
          title="Interés E.A."
          tooltipText={<InterestEaTooltip />}
          required
          value={form.values.interestEA}
          defaultValue={DEFAULT_VALUES.interestEA}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <Input
            type="text"
            value={form.values.interestEA}
            formatter={formatPercentage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              form.setValue('interestEA', extractNumericValueWithMax(e.target.value, 100))
            }
            {...createDefaultValueFocusHandler(form, 'interestEA')}
            placeholder="0%"
            className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px] border border-solid border-[#c9c9c9]
            bg-white text-[#3d3b3b] px-3 py-2"
          />
        </EBusFormField>

        <EBusFormField
          title="Eligibilidad Especial"
          required
          value={form.values.specialEligibility}
          defaultValue={DEFAULT_VALUES.specialEligibility}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <EBusSelect
            value={form.values.specialEligibility}
            onChange={(value: string) => form.setValue('specialEligibility', value)}
            options={elegibilidadEspecialOptions}
            placeholder="Seleccione una opción"
          />
        </EBusFormField>

        <When condition={form.values.specialEligibility !== SpecialEligibility.none}>
          <EBusFormField
            title="Tasa Especial E.A."
            required
            value={form.values.specialRateEA}
            defaultValue={DEFAULT_VALUES.specialRateEA}
            submitAttempted={submitAttempted}
            requiredMessage="Este campo es obligatorio"
          >
            <Input
              type="text"
              value={form.values.specialRateEA}
              formatter={formatPercentage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                form.setValue('specialRateEA', extractNumericValueWithMax(e.target.value, 100))
              }
              {...createDefaultValueFocusHandler(form, 'specialRateEA')}
              placeholder="0%"
              className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px] border border-solid border-[#c9c9c9]
            bg-white text-[#3d3b3b] px-3 py-2"
            />
          </EBusFormField>
        </When>
      </div>

      <div className="flex gap-4">
        {onBack && <EBusButton variant="secondary" buttonLabel="Atrás" onClick={onBack} className="h-[40px] flex-1" />}
        <EBusButton variant="primary" buttonLabel="Continuar" onClick={handleContinue} className="h-[40px] flex-1" />
      </div>
    </div>
  );
}
