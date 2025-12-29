import type { EBusRadioProps } from './EBusRadio.types';
import { createRadioButtons } from './EBusRadio.utils';

export function useEBusRadio({ name, value, options, onChange, className }: EBusRadioProps) {
  const radioButtons = createRadioButtons({
    name,
    selectedValue: value,
    options,
    onChange,
  });

  const combinedClassName = className ?? '';

  return {
    radioButtons,
    combinedClassName,
  };
}
