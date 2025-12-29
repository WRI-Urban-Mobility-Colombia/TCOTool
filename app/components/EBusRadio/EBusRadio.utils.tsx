import React from 'react';
import type { EBusRadioOption } from './EBusRadio.types';
import { RadioButton } from './EBusRadio.styled';

export function createRadioButtons({
  name,
  selectedValue,
  options,
  onChange,
}: {
  name: string;
  selectedValue: string;
  options: readonly EBusRadioOption[];
  onChange: (value: string) => void;
}): React.ReactElement[] {
  return options.map((option) => (
    <RadioButton
      key={option.value}
      id={`${name}-${option.value}`}
      name={name}
      value={option.value}
      label={option.label}
      checked={selectedValue === option.value}
      onChange={onChange}
    />
  ));
}

export function createNumericRadioOptions(maxNumber: number): EBusRadioOption[] {
  return Array.from({ length: maxNumber }, (_, index) => {
    const value = String(index + 1);
    return {
      value,
      label: value,
    };
  });
}
