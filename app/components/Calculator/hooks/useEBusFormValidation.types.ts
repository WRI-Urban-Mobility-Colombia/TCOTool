import type { UseFormReturn } from '@/lib/Form/Form.types';
import type { CalculatorFormData } from '../CalculatorForm.types';
import { STEP } from '../CalculatorForm.constants';

export interface RequiredFieldsByStep {
  [STEP.CAPEX_FORM]: string[];
  [STEP.FINEX_FORM]: string[];
  [STEP.OPEX_FORM]: string[];
  [STEP.REFERENCE_FORM]: string[];
}

export interface UseEBusFormValidationProps {
  form: UseFormReturn<CalculatorFormData>;
  requiredFields: RequiredFieldsByStep;
  step: number;
  onCalculate?: () => void;
  onInvalid?: () => void;
}

export interface UseEBusFormValidationReturn {
  handleContinue: () => void;
  submitAttempted: boolean;
}
