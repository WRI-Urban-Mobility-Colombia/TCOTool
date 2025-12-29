import React from 'react';

export interface Step {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface StepperProps {
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export interface StepperContainerProps {
  children: React.ReactNode;
}

export type StepperStepContainerProps = StepperContainerProps;

export interface StepperCircleProps extends StepperContainerProps {
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
  isClickable?: boolean;
}

export interface StepperLabelProps extends StepperContainerProps {
  isActive: boolean;
}
