'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CapexForm } from './CapexForm';
import { FinexForm } from './FinexForm';
import { OpexForm } from './OpexForm';
import { ReferenceForm } from './ReferenceForm';
import { Stepper } from './components/Stepper';
import type { CalculatorProps } from './CalculatorForm.types';
import { useCalculatorForm } from './useCalculatorForm';
import { smoothScrollToTop, getRequiredFields, convertBusesDataToAcquisitionCosts } from './CalculatorForm.utils';
import {
  STEP,
  DEFAULT_VALUES,
  DEFAULT_EMPTY_ACQUISITION_COSTS,
  Typology,
  TYPOLOGY_VALUES,
} from './CalculatorForm.constants';
import { useEBusFormValidation } from './hooks';
import { useGetBusesDataByTypeAndTechnology } from '@/lib/hooks/useGetBusesDataByTypeAndTechnology';

export function Calculator({ onResultsChange }: CalculatorProps) {
  const [currentStep, setCurrentStep] = useState<number>(STEP.CAPEX_FORM);
  const [insertDefaultValues, setInsertDefaultValues] = useState(true);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const busesDataRef = useRef<typeof busesData>(null);

  const { form, submit } = useCalculatorForm({ onResultsChange, initialValues: DEFAULT_VALUES });

  const typology = TYPOLOGY_VALUES[form.values.typology as Typology];
  const busesData = useGetBusesDataByTypeAndTechnology(typology);

  useEffect(() => {
    const busesDataChanged = busesDataRef.current !== busesData;
    if (insertDefaultValues && busesDataChanged) {
      form.setValue('acquisitionCosts', convertBusesDataToAcquisitionCosts(busesData));
      busesDataRef.current = busesData;
    } else if (!insertDefaultValues && busesDataChanged) {
      form.setValue('acquisitionCosts', DEFAULT_EMPTY_ACQUISITION_COSTS);
      busesDataRef.current = busesData;
    }
  }, [insertDefaultValues, busesData, form]);

  useEffect(() => {
    if (formContainerRef.current) {
      smoothScrollToTop(formContainerRef.current);
    }
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < STEP.MAX) {
      setCurrentStep(currentStep + STEP.INCREMENT);
    } else {
      submit();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > STEP.INITIAL) {
      setCurrentStep(currentStep - STEP.INCREMENT);
    }
  };

  const requiredFields = getRequiredFields(currentStep, form.values);

  const { handleContinue, submitAttempted } = useEBusFormValidation({
    form,
    requiredFields,
    step: currentStep,
    onCalculate: handleNextStep,
    onInvalid: () => {
      if (formContainerRef.current) {
        smoothScrollToTop(formContainerRef.current);
      }
    },
  });

  const renderForm = () => {
    switch (currentStep) {
      case STEP.CAPEX_FORM:
        return (
          <CapexForm
            form={form}
            handleContinue={handleContinue}
            submitAttempted={submitAttempted}
            insertDefaultValues={insertDefaultValues}
            handleAcquisitionCostsToggle={setInsertDefaultValues}
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
            handleAcquisitionCostsToggle={setInsertDefaultValues}
          />
        );
    }
  };

  return (
    <div ref={formContainerRef} className="w-full rounded-[16px] px-4 py-6 bg-[#f6f6f6]">
      <div className="mb-4">
        <Stepper currentStep={currentStep} onStepClick={setCurrentStep} />
      </div>
      {renderForm()}
    </div>
  );
}
