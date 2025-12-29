import React from 'react';
import type { StepperProps } from './Stepper.types';
import { StepperContainer, StepperLabel, StepperCircle, StepperLine, StepperStepContainer } from './Stepper.styled';
import { mapStepsDataToSteps } from './Stepper.utils';

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  const steps = mapStepsDataToSteps(currentStep);

  const handleStepClick = (stepNumber: number) => {
    if (onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <StepperContainer>
      <StepperLine />

      {steps.map((step) => (
        <StepperStepContainer key={step.number}>
          <StepperCircle
            isActive={step.isActive}
            isCompleted={step.isCompleted}
            onClick={() => handleStepClick(step.number)}
            isClickable={!!onStepClick}
          >
            {step.number}
          </StepperCircle>

          <StepperLabel isActive={step.isActive}>
            <p>{step.label}</p>
          </StepperLabel>
        </StepperStepContainer>
      ))}
    </StepperContainer>
  );
}
