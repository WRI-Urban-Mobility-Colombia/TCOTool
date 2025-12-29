import { ReactNode } from 'react';

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setError: <K extends keyof T>(name: K, error: string) => void;
  setFieldTouched: <K extends keyof T>(name: K) => void;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  [key: string]: unknown;
}

export interface FormProps<T extends Record<string, unknown>> {
  children: ReactNode | ((form: UseFormReturn<T>) => ReactNode);
  form: UseFormReturn<T>;
  className?: string;
  widthFull?: boolean;
  gap?: number;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
  onSubmit?: (values: T) => void;
}

export interface FormFooterProps {
  children: ReactNode;
  className?: string;
}
