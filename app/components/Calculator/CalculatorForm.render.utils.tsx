import React from 'react';
import { CapexForm } from './CapexForm';
import { FinexForm } from './FinexForm';
import { OpexForm } from './OpexForm';
import { ReferenceForm } from './ReferenceForm';
import { STEP } from './CalculatorForm.constants';
import type { RenderFormParams } from '../Results/ResultsSection.types';

export function renderForm({
  currentStep,
  form,
  handleContinue,
  submitAttempted,
  insertDefaultValues,
  handleAcquisitionCostsToggle,
  handlePreviousStep,
  busesData,
}: RenderFormParams): React.ReactNode {
  switch (currentStep) {
    case STEP.CAPEX_FORM:
      return (
        <CapexForm
          form={form}
          handleContinue={handleContinue}
          submitAttempted={submitAttempted}
          insertDefaultValues={insertDefaultValues}
          handleAcquisitionCostsToggle={handleAcquisitionCostsToggle}
        />
      );
    case STEP.FINEX_FORM:
      return (
        <FinexForm
          form={form}
          handleContinue={handleContinue}
          submitAttempted={submitAttempted}
          onBack={handlePreviousStep}
        />
      );
    case STEP.OPEX_FORM:
      return (
        <OpexForm
          form={form}
          handleContinue={handleContinue}
          submitAttempted={submitAttempted}
          onBack={handlePreviousStep}
          busesData={busesData}
        />
      );
    case STEP.REFERENCE_FORM:
      return (
        <ReferenceForm
          form={form}
          handleContinue={handleContinue}
          submitAttempted={submitAttempted}
          onBack={handlePreviousStep}
        />
      );
    default:
      return (
        <CapexForm
          form={form}
          handleContinue={handleContinue}
          submitAttempted={submitAttempted}
          insertDefaultValues={insertDefaultValues}
          handleAcquisitionCostsToggle={handleAcquisitionCostsToggle}
        />
      );
  }
}
