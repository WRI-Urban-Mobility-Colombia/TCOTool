export interface EBusToggleProps {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: () => void;
  className?: string;
}

export interface ToggleButtonProps {
  checked: boolean;
  onClick: () => void;
}

export interface ToggleContainerProps {
  children: React.ReactNode;
  className?: string;
}
