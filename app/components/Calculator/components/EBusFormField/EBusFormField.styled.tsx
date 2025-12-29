import type { FormFieldWrapperProps } from './EBusFormField.types';

export function FormFieldWrapper({ children, className }: FormFieldWrapperProps) {
  return <div className={className}>{children}</div>;
}

export function RequiredMessage({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-[#a1a1a1] font-['Inter',sans-serif]">{children}</p>;
}
