import React from 'react';
import { Button } from 'vizonomy';
import type {
  InformationTooltipContainerProps,
  InformationTooltipTriggerProps,
  InformationTooltipContentProps,
  InformationTooltipBridgeProps,
} from './InformationTooltip.types';

export function InformationTooltipContainer({
  children,
  onMouseEnter,
  onMouseLeave,
}: InformationTooltipContainerProps) {
  return (
    <div className="information-tooltip-container" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
}

export function InformationTooltipTrigger({ children, onMouseEnter, onMouseLeave }: InformationTooltipTriggerProps) {
  return (
    <Button
      className="information-tooltip-trigger"
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Button>
  );
}

export function InformationTooltipContent({ children, onMouseEnter, onMouseLeave }: InformationTooltipContentProps) {
  return (
    <div className="information-tooltip-content" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} lang="es">
      {children}
    </div>
  );
}

export function InformationTooltipBridge({ onMouseEnter, onMouseLeave }: InformationTooltipBridgeProps) {
  return (
    <div
      className="information-tooltip-bridge"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ pointerEvents: 'auto' }}
    />
  );
}

export function InformationTooltipArrow() {
  return <div className="information-tooltip-arrow" />;
}
