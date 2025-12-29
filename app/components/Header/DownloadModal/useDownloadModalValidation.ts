import { useState } from 'react';
import type { UseFormReturn } from '@/lib/Form/Form.types';
import type { DownloadModalFormData } from './DownloadModal.types';

const REQUIRED_FIELDS: Array<keyof DownloadModalFormData> = ['email', 'firstName', 'lastName', 'sector'];

export function useDownloadModalValidation(form: UseFormReturn<DownloadModalFormData>) {
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateRequiredFields = (): boolean => {
    return REQUIRED_FIELDS.every((field) => {
      const value = form.values[field];
      const stringValue = typeof value === 'string' ? value : '';
      if (field === 'sector') {
        return stringValue && stringValue.trim() !== '' && stringValue !== '';
      }
      return stringValue && stringValue.trim() !== '';
    });
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    const isValid = validateRequiredFields();
    return isValid;
  };

  return {
    submitAttempted,
    handleSubmit,
  };
}
