'use client';

import React from 'react';
import { Stepper } from './components/Stepper';
import type { CalculatorProps } from './CalculatorForm.types';
import { useCalculator } from './hooks/useCalculator';
import { CalculatorContainer, CalculatorStepperContainer } from './Calculator.styled';

export function Calculator({ onResultsChange }: CalculatorProps) {
  const { currentStep, formContainerRef, setCurrentStep, componentToRender } = useCalculator({ onResultsChange });

  return (
    <CalculatorContainer containerRef={formContainerRef}>
      <CalculatorStepperContainer>
        <Stepper currentStep={currentStep} onStepClick={setCurrentStep} />
      </CalculatorStepperContainer>
      {componentToRender}
    </CalculatorContainer>
  );
}
