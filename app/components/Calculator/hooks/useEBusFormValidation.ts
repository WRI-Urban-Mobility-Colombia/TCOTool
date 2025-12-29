import { useState } from 'react';
import type { UseEBusFormValidationProps, UseEBusFormValidationReturn } from './useEBusFormValidation.types';
import type { CalculatorFormData } from '../CalculatorForm.types';

interface SubmitAttemptedByStep {
  [key: number]: boolean;
}
export function useEBusFormValidation({
  form,
  requiredFields,
  step,
  onCalculate,
  onInvalid,
}: UseEBusFormValidationProps): UseEBusFormValidationReturn {
  const [submitAttemptedByStep, setSubmitAttemptedByStep] = useState<SubmitAttemptedByStep>({});

  const submitAttempted = submitAttemptedByStep[step] ?? false;

  const currentStepFields = requiredFields[step as keyof typeof requiredFields] ?? [];

  type NestedFormValue = string | NestedFormRecord;
  type NestedFormRecord = {
    [key: string]: NestedFormValue;
  };

  const buildNestedRecord = (values: CalculatorFormData): NestedFormRecord => {
    return JSON.parse(JSON.stringify(values)) as NestedFormRecord;
  };

  const formValues = buildNestedRecord(form.values);

  const isRecord = (value: NestedFormValue): value is NestedFormRecord => {
    return typeof value === 'object' && value !== null;
  };

  const resolveValue = (path: string): string => {
    const segments = path.split('.');
    let current: NestedFormValue = formValues;

    for (const segment of segments) {
      if (isRecord(current) && Object.prototype.hasOwnProperty.call(current, segment)) {
        current = current[segment];
      } else {
        return '';
      }
    }

    return typeof current === 'string' ? current : '';
  };

  const validateRequiredFields = (): boolean => {
    const fieldsToValidate = currentStepFields.map((field) => ({
      name: field,
      value: resolveValue(field),
    }));
    return fieldsToValidate.every((field) => field.value && field.value.trim() !== '');
  };
  const handleContinue = () => {
    setSubmitAttemptedByStep((prev) => ({
      ...prev,
      [step]: true,
    }));
    const requiredFieldsValid = validateRequiredFields();
    if (requiredFieldsValid) {
      onCalculate?.();
    } else {
      onInvalid?.();
    }
  };
  return {
    handleContinue,
    submitAttempted,
  };
}
