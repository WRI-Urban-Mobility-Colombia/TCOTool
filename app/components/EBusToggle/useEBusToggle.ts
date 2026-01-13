import { useCallback } from 'react';
import type { EBusToggleProps } from './EBusToggle.types';

export function useEBusToggle({ checked, onChange, onClick }: EBusToggleProps) {
  const handleToggle = useCallback(() => {
    if (onClick) {
      onClick();
    } else if (onChange) {
      onChange(!checked);
    }
  }, [checked, onChange, onClick]);

  return {
    handleToggle,
  };
}
