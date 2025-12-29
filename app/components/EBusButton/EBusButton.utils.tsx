import React from 'react';
import { Icon } from '../Icon';
import type { EBusButtonVariant, CreateIconElementProps, CreateButtonContentProps } from './EBusButton.types';
import {
  BUTTON_STYLES,
  BUTTON_ICON_SIZE,
  EBUS_BUTTON_VARIANTS,
  ICON_POSITIONS,
  ICON_BASE_CLASSES,
} from './EBusButton.constants';
import { ButtonLabel } from './EBusButton.styled';

export function getVariantStyles(variant: EBusButtonVariant): string {
  switch (variant) {
    case EBUS_BUTTON_VARIANTS.PRIMARY:
      return BUTTON_STYLES.PRIMARY;
    case EBUS_BUTTON_VARIANTS.SECONDARY:
      return BUTTON_STYLES.SECONDARY;
    case EBUS_BUTTON_VARIANTS.ONLY_TEXT:
      return BUTTON_STYLES.ONLY_TEXT;
    default:
      return BUTTON_STYLES.PRIMARY;
  }
}

export function createIconElement({ iconName, iconClassName }: CreateIconElementProps): React.ReactElement | null {
  if (!iconName) {
    return null;
  }

  return (
    <Icon
      key={iconName}
      iconName={iconName}
      width={BUTTON_ICON_SIZE.WIDTH}
      height={BUTTON_ICON_SIZE.HEIGHT}
      className={`${ICON_BASE_CLASSES} ${iconClassName ?? ''}`}
    />
  );
}

export function createButtonContent({
  iconPosition,
  iconElement,
  buttonLabel,
}: CreateButtonContentProps): React.ReactElement[] {
  const labelElement = <ButtonLabel key="label" buttonLabel={buttonLabel} />;

  if (!iconElement) {
    return [labelElement];
  }

  return iconPosition === ICON_POSITIONS.LEFT ? [iconElement, labelElement] : [labelElement, iconElement];
}
