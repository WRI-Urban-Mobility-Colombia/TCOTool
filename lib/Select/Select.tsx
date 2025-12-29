'use client';

import { SelectProvider } from './context/SelectContext';
import useSelect from './hooks/useSelect';
import type { SelectContextType, SelectProps } from './Select.d';

function Select({
  options,
  selected,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  isMulti = false,
  maxItems,
  autocomplete = false,
  onSearch,
  children,
  ...rest
}: SelectProps) {
  const hookProps = {
    options,
    selected,
    onChange,
    disabled,
    isMulti,
    maxItems,
    autocomplete,
    onSearch,
  };
  const selectState = useSelect(hookProps);

  const { isOpen, toggleOpen, selectRef, isSelected, searchTerm, setSearchTerm, filteredOptions } = selectState;

  const contextValue: SelectContextType = {
    options,
    selected,
    isOpen,
    isMulti,
    disabled,
    toggleOption: selectState.toggleOption,
    toggleOpen,
    closeSelect: selectState.closeSelect,
    isSelected,
    searchTerm,
    setSearchTerm,
    filteredOptions,
    autocomplete,
    placeholder,
  };

  return (
    <SelectProvider value={contextValue}>
      <div ref={selectRef} {...rest}>
        {children ? children(contextValue) : null}
      </div>
    </SelectProvider>
  );
}

export default Select;
