'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { ChartsTooltipContainer } from './ChartsTooltip.styled';
import type { ChartsTooltipProps } from './ChartsTooltip.types';

export function ChartsTooltip({ label, value, color, x, y, year }: ChartsTooltipProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <ChartsTooltipContainer x={x} y={y - 10} color={color}>
      {year !== undefined && <div style={{ fontWeight: 600, marginBottom: '4px', paddingTop: '4px' }}>Año: {year}</div>}
      <div
        style={{
          fontWeight: 600,
          marginBottom: year !== undefined ? '4px' : '0',
          paddingTop: year === undefined ? '4px' : '0',
        }}
      >
        {label}
      </div>
      <div style={{ color: '#f6f6f6' }}>{value}</div>
    </ChartsTooltipContainer>,
    document.body
  );
}
