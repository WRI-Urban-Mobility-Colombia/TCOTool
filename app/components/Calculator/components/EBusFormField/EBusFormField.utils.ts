import type { ValidationState } from './EBusFormField.types';

export function getFieldValidationState(
  value: string,
  required: boolean,
  submitAttempted: boolean,
  defaultValue?: string
): ValidationState {
  const hasValue = value && value.trim() !== '';
  const isDefaultValue = defaultValue && value === defaultValue;

  if (isDefaultValue) {
    return 'default';
  }

  if (submitAttempted && required && !hasValue) {
    return 'invalid';
  }

  if (hasValue) {
    return 'valid';
  }

  return 'default';
}

export function getBorderClass(validationState: ValidationState, variant: 'default' | 'table' = 'default') {
  if (variant === 'table') {
    switch (validationState) {
      case 'valid':
        return 'bg-white';
      case 'invalid':
        return 'bg-[#ffe6e6]';
      default:
        return 'bg-white';
    }
  }

  switch (validationState) {
    case 'valid':
      return 'border-[2px] border-[#33b192] rounded-[6px]';
    case 'invalid':
      return 'border-[2px] border-[#f3817d] rounded-[6px]';
    default:
      return '';
  }
}
