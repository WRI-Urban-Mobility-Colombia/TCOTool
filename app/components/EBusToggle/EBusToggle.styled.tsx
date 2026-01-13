import React from 'react';
import { Button } from 'vizonomy';
import { TOGGLE_STYLES } from './EBusToggle.constants';
import type { ToggleButtonProps, ToggleContainerProps } from './EBusToggle.types';

export function ToggleButton({ checked, onClick }: ToggleButtonProps) {
  const buttonClassName = `${TOGGLE_STYLES.BUTTON} ${checked ? TOGGLE_STYLES.BUTTON_ACTIVE : TOGGLE_STYLES.BUTTON_INACTIVE}`;
  const switchClassName = `${TOGGLE_STYLES.SWITCH} ${checked ? TOGGLE_STYLES.SWITCH_ACTIVE : TOGGLE_STYLES.SWITCH_INACTIVE}`;

  return (
    <Button type="default" onClick={onClick} className={buttonClassName}>
      <span className={switchClassName} />
    </Button>
  );
}

export function ToggleLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className={TOGGLE_STYLES.LABEL_CONTAINER}>
      <span className={TOGGLE_STYLES.LABEL}>{children}</span>
    </div>
  );
}

export function ToggleContainer({ children, className }: ToggleContainerProps) {
  const combinedClassName = `${TOGGLE_STYLES.CONTAINER} ${className ?? ''}`.trim();
  return <div className={combinedClassName}>{children}</div>;
}
