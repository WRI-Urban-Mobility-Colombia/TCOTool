import React from 'react';

export interface ChartsTooltipContainerProps {
  children: React.ReactNode;
  x: number;
  y: number;
  color: string;
}

export function ChartsTooltipContainer({ children, x, y, color }: ChartsTooltipContainerProps) {
  return (
    <div
      className="charts-tooltip-container"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        className="charts-tooltip-content"
        style={{
          position: 'relative',
          backgroundColor: '#3d3b3b',
          color: '#f6f6f6',
          padding: '2px 8px 6px 8px',
          borderRadius: '4px',
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
          fontFamily: "'Acumin Pro', Arial, sans-serif",
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          textAlign: 'center',
          whiteSpace: 'normal',
          minWidth: '120px',
          maxWidth: '300px',
        }}
      >
        {/* Línea superior con el color de la serie */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: color,
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
          }}
        />
        {children}
        {/* Flecha apuntando hacia abajo */}
        <div
          className="charts-tooltip-arrow"
          style={{
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid #3d3b3b',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
