'use client';

import {
  ButtonSelectOption,
  ButtonSelectTrigger,
  ChevronDownIcon,
  SelectContentContainer,
  SelectDropdown,
  SelectEmptyMessage,
  SelectTriggerLabel,
} from './EBusSelect.styled';
import { EBUS_SELECT_SIZES } from './EBusSelect.constants';
import { When } from 'vizonomy';
import type { EBusSelectContentProps } from './EBusSelect.types';
import { useEBusSelectContent } from './useEBusSelectContent';

export function EBusSelectContent(props: EBusSelectContentProps) {
  const {
    isOpen,
    toggleOpen,
    filteredOptions,
    toggleOption,
    isSelected,
    hasSelection,
    selectedOptions,
    placeholder,
    variant = 'default',
    isLastRow,
    validationState = 'default',
  } = useEBusSelectContent(props);

  const showChevron = true;

  return (
    <SelectContentContainer>
      <ButtonSelectTrigger
        onClick={toggleOpen}
        hasSelectedOption={hasSelection}
        variant={variant}
        validationState={validationState}
      >
        <SelectTriggerLabel variant={variant}>
          {hasSelection ? selectedOptions[0].label : placeholder}
        </SelectTriggerLabel>
        <When condition={showChevron}>
          <ChevronDownIcon
            isOpen={isOpen}
            width={EBUS_SELECT_SIZES.CHEVRON_ICON_WIDTH}
            height={EBUS_SELECT_SIZES.CHEVRON_ICON_HEIGHT}
          />
        </When>
      </ButtonSelectTrigger>

      <When condition={isOpen}>
        <SelectDropdown isLastRow={isLastRow} variant={variant}>
          <When condition={filteredOptions.length === 0}>
            <SelectEmptyMessage>No hay opciones disponibles</SelectEmptyMessage>
          </When>
          <When condition={filteredOptions.length > 0}>
            {filteredOptions.map((option) => (
              <ButtonSelectOption
                key={option.id}
                onClick={() => toggleOption(option)}
                isSelected={isSelected(option)}
                variant={variant}
              >
                {option.label}
              </ButtonSelectOption>
            ))}
          </When>
        </SelectDropdown>
      </When>
    </SelectContentContainer>
  );
}
