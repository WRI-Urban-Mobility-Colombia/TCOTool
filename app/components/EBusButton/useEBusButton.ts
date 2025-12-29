import type { EBusButtonProps } from './EBusButton.types';
import { BUTTON_STYLES, EBUS_BUTTON_VARIANTS, ICON_POSITIONS } from './EBusButton.constants';
import { getVariantStyles, createIconElement, createButtonContent } from './EBusButton.utils';

export function useEBusButton({
  variant = EBUS_BUTTON_VARIANTS.PRIMARY,
  className,
  iconName,
  iconPosition = ICON_POSITIONS.LEFT,
  iconClassName,
  buttonLabel,
  ...buttonProps
}: EBusButtonProps) {
  const variantStyles = getVariantStyles(variant);
  const combinedClassName = `${BUTTON_STYLES.BASE} ${variantStyles} ${className ?? ''}`;
  const iconElement = createIconElement({ iconName, iconClassName });
  const content = createButtonContent({
    iconPosition,
    iconElement,
    buttonLabel,
  });

  return {
    combinedClassName,
    content,
    ...buttonProps,
  };
}
