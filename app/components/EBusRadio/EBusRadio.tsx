'use client';

import type { EBusRadioProps } from './EBusRadio.types';
import { useEBusRadio } from './useEBusRadio';
import { RadioContainer } from './EBusRadio.styled';

export function EBusRadio(props: EBusRadioProps) {
  const { radioButtons, combinedClassName } = useEBusRadio(props);

  return <RadioContainer className={combinedClassName}>{radioButtons}</RadioContainer>;
}
