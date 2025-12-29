import type { Option, SelectContextType } from '@/lib/Select/Select.d';
import type React from 'react';
import type { SelectOption } from '../../CalculatorForm.types';

export type { SelectOption };

export interface EBusSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'table';
  isLastRow?: boolean;
  required?: boolean;
  defaultValue?: string;
}

export type ValidationState = 'default' | 'valid' | 'invalid';

export interface ButtonSelectTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
  hasSelectedOption: boolean;
  variant?: 'default' | 'table';
  validationState?: ValidationState;
}

export interface SelectDropdownProps {
  children: React.ReactNode;
  isLastRow?: boolean;
  variant?: 'default' | 'table';
}

export interface ButtonSelectOptionProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
  variant?: 'default' | 'table';
}

export interface ChevronDownIconProps {
  isOpen?: boolean;
  width?: number;
  height?: number;
}

export interface SelectTriggerLabelProps {
  children: React.ReactNode;
  variant?: 'default' | 'table';
}

export interface SelectEmptyMessageProps {
  children: React.ReactNode;
}

export interface EBusSelectContentProps {
  context: SelectContextType;
  hasSelection: boolean;
  selectedOptions: Option[];
  placeholder: string;
  variant?: 'default' | 'table';
  isLastRow?: boolean;
  validationState?: ValidationState;
}
