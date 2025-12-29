import { FormFooterProps } from './Form.types';

export function FormFooter({ children, className = '' }: FormFooterProps) {
  return <div className={`flex justify-end gap-3 ${className}`}>{children}</div>;
}
