import type React from 'react';

export type ValidationState = 'default' | 'valid' | 'invalid';

export interface EBusFormFieldProps {
  title?: string;
  tooltipText?: string | React.ReactNode;
  required?: boolean;
  value: string;
  defaultValue?: string;
  children: React.ReactNode;
  submitAttempted?: boolean;
  disableTooltip?: boolean;
  requiredMessage?: string;
  variant?: 'default' | 'table';
}

export interface FormFieldWrapperProps {
  children: React.ReactNode;
  className: string;
}
