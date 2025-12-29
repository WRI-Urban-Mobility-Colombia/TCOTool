import { useForm } from '@/lib/Form/useForm';
import type { CalculatorFormData, UseCalculatorFormProps } from './CalculatorForm.types';

export const useCalculatorForm = ({ onResultsChange, initialValues }: UseCalculatorFormProps) => {
  const form = useForm<CalculatorFormData>({
    initialValues,
    onSubmit: async (values) => {
      onResultsChange?.(values);
    },
  });

  return {
    form,
    submit: form.handleSubmit,
    reset: form.reset,
  };
};
