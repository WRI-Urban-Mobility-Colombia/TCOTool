'use client';

import type { EBusToggleProps } from './EBusToggle.types';
import { useEBusToggle } from './useEBusToggle';
import { ToggleContainer, ToggleButton, ToggleLabel } from './EBusToggle.styled';

export function EBusToggle(props: EBusToggleProps) {
  const { label, checked, className } = props;
  const { handleToggle } = useEBusToggle(props);

  return (
    <ToggleContainer className={className}>
      <ToggleButton checked={checked} onClick={handleToggle} />
      <ToggleLabel>{label}</ToggleLabel>
    </ToggleContainer>
  );
}
