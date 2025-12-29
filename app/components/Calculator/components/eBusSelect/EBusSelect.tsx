'use client';

import Select from '@/lib/Select/Select';
import { EBusSelectProps } from './EBusSelect.types';
import { EBusSelectContent } from './EBusSelectContent';
import { useEBusSelect } from './useEBusSelect';

export function EBusSelect(props: EBusSelectProps) {
  const {
    selectOptions,
    selectedOptions,
    handleChange,
    placeholder,
    className,
    variant = 'default',
    isLastRow,
    validationState,
  } = useEBusSelect(props);

  return (
    <Select
      options={selectOptions}
      selected={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    >
      {(context) => (
        <EBusSelectContent
          context={context}
          hasSelection={!!selectedOptions.length}
          selectedOptions={selectedOptions}
          placeholder={placeholder}
          variant={variant}
          isLastRow={isLastRow}
          validationState={validationState}
        />
      )}
    </Select>
  );
}
