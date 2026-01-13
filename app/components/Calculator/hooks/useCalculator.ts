import { useState, useRef, useEffect } from 'react';
import { useCalculatorForm } from '../useCalculatorForm';
import { smoothScrollToTop, getRequiredFields, convertBusesDataToAcquisitionCosts } from '../CalculatorForm.utils';
import {
  STEP,
  DEFAULT_VALUES,
  DEFAULT_ACQUISITION_COSTS,
  Typology,
  TYPOLOGY_VALUES,
} from '../CalculatorForm.constants';
import { useEBusFormValidation } from './index';
import { useGetBusesDataByTypeAndTechnology } from '@/lib/hooks/useGetBusesDataByTypeAndTechnology';
import { renderForm } from '../CalculatorForm.render.utils';
import type { CalculatorProps, CalculatorHookReturn } from '../CalculatorForm.types';

export function useCalculator({ onResultsChange }: CalculatorProps): CalculatorHookReturn {
  const [currentStep, setCurrentStep] = useState<number>(STEP.CAPEX_FORM);
  const [insertDefaultValues, setInsertDefaultValues] = useState(true);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const { form, submit } = useCalculatorForm({ onResultsChange, initialValues: DEFAULT_VALUES });
  const formRef = useRef(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const typology = TYPOLOGY_VALUES[form.values.typology as Typology];
  const busesData = useGetBusesDataByTypeAndTechnology(typology);

  useEffect(() => {
    if (insertDefaultValues) {
      formRef.current.setValue('acquisitionCosts', convertBusesDataToAcquisitionCosts(busesData));
    } else {
      formRef.current.setValue('acquisitionCosts', DEFAULT_ACQUISITION_COSTS);
    }
  }, [insertDefaultValues, busesData]);

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

  const componentToRender = renderForm({
    currentStep,
    form,
    handleContinue,
    submitAttempted,
    insertDefaultValues,
    handleAcquisitionCostsToggle: setInsertDefaultValues,
    handlePreviousStep,
    busesData,
  });

  return {
    currentStep,
    formContainerRef,
    setCurrentStep,
    componentToRender,
  };
}
