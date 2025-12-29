import { ICON_NAMES } from './Icon.constants';

export type IconName = (typeof ICON_NAMES)[keyof typeof ICON_NAMES];

export interface IconProps {
  iconName: IconName;
  width: number;
  height: number;
  className?: string;
}
