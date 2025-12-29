import type { HTMLAttributes, ReactNode } from 'react';

export interface Option {
  id: string | number;
  label: string;
  value: string | number;
}

export interface UseSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  disabled?: boolean;
  isMulti?: boolean;
  maxItems?: number;
  autocomplete?: boolean;
  onSearch?: (searchTerm: string) => void;
}

export interface SelectProps
  extends HTMLAttributes<HTMLDivElement>, Omit<UseSelectProps, 'options' | 'selected' | 'onChange'> {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  children: (state: SelectContextType) => ReactNode;
}

export interface SelectContextType {
  options: Option[];
  selected: Option[];
  isOpen: boolean;
  isMulti: boolean;
  disabled: boolean;
  toggleOption: (option: Option) => void;
  toggleOpen: () => void;
  closeSelect: () => void;
  isSelected: (option: Option) => boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredOptions: Option[];
  autocomplete: boolean;
  placeholder?: string;
}

export interface ToggleProps {
  children?: ReactNode;
}

export interface OptionItemProps {
  option: Option;
  children?: ReactNode;
}

export interface OptionsListProps {
  children?: ReactNode;
}

export interface SelectedDisplayProps {
  children?: ReactNode;
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
