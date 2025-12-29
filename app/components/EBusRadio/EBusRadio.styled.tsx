import React from 'react';
import type { RadioButtonProps } from './EBusRadio.types';
import { RADIO_STYLES } from './EBusRadio.constants';

export function RadioContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  const combinedClassName = `${RADIO_STYLES.CONTAINER} ${className ?? ''}`.trim();
  return <div className={combinedClassName}>{children}</div>;
}

export function RadioButton({ id, name, value, label, checked, onChange }: RadioButtonProps) {
  return (
    <label htmlFor={id} className={RADIO_STYLES.RADIO_BUTTON}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={RADIO_STYLES.INPUT}
      />
      <span className={RADIO_STYLES.LABEL}>{label}</span>
    </label>
  );
}
