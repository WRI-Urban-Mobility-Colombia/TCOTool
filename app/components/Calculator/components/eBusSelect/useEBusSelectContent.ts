import { useEffect } from 'react';
import type { EBusSelectContentProps } from './EBusSelect.types';

export const useEBusSelectContent = ({
  context,
  hasSelection,
  selectedOptions,
  placeholder,
  variant = 'default',
  isLastRow,
  validationState = 'default',
}: EBusSelectContentProps) => {
  const { isOpen, toggleOpen, filteredOptions, toggleOption, isSelected, setSearchTerm } = context;

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, setSearchTerm]);
  return {
    isOpen,
    toggleOpen,
    filteredOptions,
    toggleOption,
    isSelected,
    setSearchTerm,
    hasSelection,
    selectedOptions,
    placeholder,
    variant,
    isLastRow,
    validationState,
  };
};
