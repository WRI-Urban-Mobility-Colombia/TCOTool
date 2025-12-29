import type { ButtonProps } from 'vizonomy';
import type { IconName } from '../Icon';
import React from 'react';

export type EBusButtonVariant = 'primary' | 'secondary' | 'only-text';
export type IconPosition = 'left' | 'right';

export interface EBusButtonProps extends Omit<ButtonProps, 'className' | 'children'> {
  variant?: EBusButtonVariant;
  className?: string;
  iconName?: IconName;
  iconPosition?: IconPosition;
  iconClassName?: string;
  buttonLabel: string;
}

export interface ButtonLabelProps {
  buttonLabel: string;
}

export interface CreateIconElementProps {
  iconName: IconName | undefined;
  iconClassName?: string;
}

export interface CreateButtonContentProps {
  iconPosition: IconPosition;
  iconElement: React.ReactElement | null;
  buttonLabel: string;
}
