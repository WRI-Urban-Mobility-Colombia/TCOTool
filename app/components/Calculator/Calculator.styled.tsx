import React from 'react';
import type { CalculatorContainerProps } from './CalculatorForm.types';

export function CalculatorContainer({ children, containerRef }: CalculatorContainerProps) {
  return (
    <div ref={containerRef} className="w-full rounded-[16px] px-4 py-6 bg-[#f6f6f6]">
      {children}
    </div>
  );
}

export function CalculatorStepperContainer({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}
