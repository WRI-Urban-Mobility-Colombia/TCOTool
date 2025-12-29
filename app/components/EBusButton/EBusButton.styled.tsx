import type { ButtonLabelProps } from './EBusButton.types';

export function ButtonLabel({ buttonLabel }: ButtonLabelProps) {
  return <span className="ebus-button-label">{buttonLabel}</span>;
}
