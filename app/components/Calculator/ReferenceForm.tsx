'use client';

import React from 'react';
import { Input, When } from 'vizonomy';
import { EBusSelect } from './components/eBusSelect';
import { EBusButton } from '../EBusButton';
import { formatCurrency, formatPercentage, extractNumericValue, extractNumericValueWithMax } from '@/lib/utils';
import { AdditionalOperatingExpensesType, ADDITIONAL_OPERATING_EXPENSES_TYPE_LABELS } from './CalculatorForm.constants';
import { createSelectOptionsFromEnum } from './CalculatorForm.utils';
import { FormSectionTitle, ReferenceDescription } from './CalculatorForm.styled';
import { EBusFormField } from './components/EBusFormField';
import { DEFAULT_VALUES } from './CalculatorForm.constants';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import type { CalculatorFormData } from './CalculatorForm.types';

export interface ReferenceFormProps {
  form: UseFormReturn<CalculatorFormData>;
  className?: string;
  handleContinue: () => void;
  submitAttempted: boolean;
  onBack?: () => void;
}

export function ReferenceForm({ form, className, handleContinue, submitAttempted, onBack }: ReferenceFormProps) {
  const tipoOptions = createSelectOptionsFromEnum(
    AdditionalOperatingExpensesType,
    ADDITIONAL_OPERATING_EXPENSES_TYPE_LABELS
  );

  const handleAdditionalOperatingExpensesChange = (field: 'type' | 'quantity', value: string) => {
    let processedValue: string;
    if (field === 'quantity') {
      const isPercentage = form.values.additionalOperatingExpenses.type === AdditionalOperatingExpensesType.percentage;
      processedValue = isPercentage ? extractNumericValueWithMax(value, 100) : extractNumericValue(value);
    } else {
      processedValue = value;
    }
    form.setValue('additionalOperatingExpenses', {
      ...form.values.additionalOperatingExpenses,
      [field]: processedValue,
    });
  };

  const getQuantityFormatter = () => {
    const type = form.values.additionalOperatingExpenses.type;
    if (type === AdditionalOperatingExpensesType.percentage) {
      return (value: string) => formatPercentage(value);
    }
    return formatCurrency;
  };

  const getQuantityPlaceholder = () => {
    const type = form.values.additionalOperatingExpenses.type;
    if (type === AdditionalOperatingExpensesType.percentage) {
      return 'Insertar porcentaje';
    }
    return 'Insertar valor';
  };

  return (
    <div className={`forms-container ${className ?? ''}`}>
      <div className="mb-6 flex flex-col gap-4">
        <FormSectionTitle>Referencia</FormSectionTitle>
        <ReferenceDescription />
        <EBusFormField
          title="Tipo"
          required
          value={form.values.additionalOperatingExpenses.type}
          defaultValue={DEFAULT_VALUES.additionalOperatingExpenses.type}
          submitAttempted={submitAttempted}
          requiredMessage="Este campo es obligatorio"
        >
          <EBusSelect
            value={form.values.additionalOperatingExpenses.type}
            onChange={(value: string) => handleAdditionalOperatingExpensesChange('type', value)}
            options={tipoOptions}
            placeholder="Seleccione una opción"
          />
        </EBusFormField>

        <When condition={form.values.additionalOperatingExpenses.type !== AdditionalOperatingExpensesType.none}>
          <EBusFormField
            title="Cantidad"
            required
            value={form.values.additionalOperatingExpenses.quantity}
            defaultValue={DEFAULT_VALUES.additionalOperatingExpenses.quantity}
            submitAttempted={submitAttempted}
            requiredMessage="Este campo es obligatorio"
          >
            <Input
              type="text"
              value={form.values.additionalOperatingExpenses.quantity}
              formatter={getQuantityFormatter()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAdditionalOperatingExpensesChange('quantity', e.target.value)
              }
              placeholder={getQuantityPlaceholder()}
              className="font-['Inter',sans-serif] h-[40px] w-full rounded-[4px]
            border border-solid border-[#c9c9c9] bg-white text-[#3d3b3b] px-3 py-2"
            />
          </EBusFormField>
        </When>
      </div>

      <div className="flex gap-4">
        {onBack && <EBusButton variant="secondary" buttonLabel="Atrás" onClick={onBack} className="h-[40px] flex-1" />}
        <EBusButton variant="primary" buttonLabel="Calcular" onClick={handleContinue} className="h-[40px] flex-1" />
      </div>
    </div>
  );
}
