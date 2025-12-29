import { STEPS_DATA } from './Stepper.constants';
import type { Step } from './Stepper.types';

export function mapStepsDataToSteps(currentStep: number): Step[] {
  return STEPS_DATA.map((stepData) => ({
    ...stepData,
    isActive: currentStep === stepData.number,
    isCompleted: currentStep > stepData.number,
  }));
}
