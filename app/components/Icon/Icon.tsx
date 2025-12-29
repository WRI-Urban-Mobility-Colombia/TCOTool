import Image from 'next/image';
import { ICONS } from './Icon.constants';
import type { IconProps } from './Icon.types';

export function Icon({ iconName, width, height, className }: IconProps) {
  const icon = ICONS[iconName as keyof typeof ICONS];

  if (!icon) {
    return null;
  }

  return <Image alt={icon.alt} src={icon.src} width={width} height={height} className={className} />;
}
