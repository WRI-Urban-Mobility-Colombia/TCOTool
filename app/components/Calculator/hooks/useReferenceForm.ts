import type { ReferenceFormProps } from '../CalculatorForm.types';
import {
  AdditionalOperatingExpensesType,
  ADDITIONAL_OPERATING_EXPENSES_TYPE_LABELS,
  FORM_LABELS,
} from '../CalculatorForm.constants';
import { createSelectOptionsFromEnum } from '../CalculatorForm.utils';
import { formatCurrency, formatPercentage, extractNumericValue, extractNumericValueWithMax } from '@/lib/utils';

export function useReferenceForm(props: ReferenceFormProps) {
  const { form, handleContinue, submitAttempted, onBack } = props;

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
      return FORM_LABELS.PLACEHOLDERS.insertPercentage;
    }
    return FORM_LABELS.PLACEHOLDERS.insertValue;
  };

  return {
    form,
    handleContinue,
    submitAttempted,
    onBack,
    tipoOptions,
    handleAdditionalOperatingExpensesChange,
    getQuantityFormatter,
    getQuantityPlaceholder,
  };
}
