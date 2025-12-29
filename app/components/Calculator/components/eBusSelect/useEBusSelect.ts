import { EBusSelectProps } from './EBusSelect.types';
import { Option } from '@/lib/Select/Select.d';
import { optionsParser, selectedOptionsParser } from './EBusSelect.utils';
import { DEFAULT_PLACEHOLDER } from './EBusSelect.constants';

import type { ValidationState } from './EBusSelect.types';

function getValidationState(
  hasSelection: boolean,
  required: boolean | undefined,
  value: string,
  defaultValue: string | undefined
): ValidationState {
  if (defaultValue && value === defaultValue) {
    return 'default';
  }
  if (!hasSelection && required) {
    return 'invalid';
  }
  if (hasSelection) {
    return 'valid';
  }
  return 'default';
}

export const useEBusSelect = ({
  value,
  onChange,
  options,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  variant = 'default',
  isLastRow,
  required = false,
  defaultValue,
}: EBusSelectProps) => {
  const selectOptions: Option[] = optionsParser(options);
  const selectedOptions: Option[] = selectedOptionsParser(value, selectOptions);
  const hasSelection = selectedOptions.length > 0;
  const validationState = getValidationState(hasSelection, required, value, defaultValue);

  const handleChange = (selected: Option[]) => {
    const newValue = selected.length > 0 ? `${selected[0].value}` : '';
    onChange(newValue);
  };

  return {
    selectOptions,
    selectedOptions,
    handleChange,
    placeholder,
    className,
    variant,
    isLastRow,
    validationState,
  };
};
