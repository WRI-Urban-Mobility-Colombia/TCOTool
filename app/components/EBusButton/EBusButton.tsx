'use client';

import { Button } from 'vizonomy';
import type { EBusButtonProps } from './EBusButton.types';
import { useEBusButton } from './useEBusButton';

export function EBusButton(props: EBusButtonProps) {
  const { combinedClassName, content, ...buttonProps } = useEBusButton(props);
  return (
    <Button type="default" className={combinedClassName} {...buttonProps}>
      {content}
    </Button>
  );
}
