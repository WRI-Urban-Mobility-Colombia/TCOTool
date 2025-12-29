'use client';

import React, { useState } from 'react';
import { Icon } from '../Icon';
import { ICON_NAMES } from '../Icon';
import { DEFAULT_TOOLTIP_TEXT } from './InformationTooltip.constants';
import {
  InformationTooltipContainer,
  InformationTooltipTrigger,
  InformationTooltipContent,
  InformationTooltipArrow,
  InformationTooltipBridge,
} from './InformationTooltip.styled';
import type { InformationTooltipProps } from './InformationTooltip.types';

export function InformationTooltip({ text = DEFAULT_TOOLTIP_TEXT }: InformationTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!text || (typeof text === 'string' && text.trim() === '')) {
    return null;
  }

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <InformationTooltipContainer onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <InformationTooltipTrigger onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Icon iconName={ICON_NAMES.INFO} width={12} height={12} />
      </InformationTooltipTrigger>
      {isOpen && (
        <>
          <InformationTooltipBridge onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
          <InformationTooltipContent onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {typeof text === 'string' ? <p>{text}</p> : text}
          </InformationTooltipContent>
          <InformationTooltipArrow />
        </>
      )}
    </InformationTooltipContainer>
  );
}
