export interface EBusRadioOption {
  value: string;
  label: string;
}

export interface EBusRadioProps {
  name: string;
  value: string;
  options: readonly EBusRadioOption[];
  onChange: (value: string) => void;
  className?: string;
}

export interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}
