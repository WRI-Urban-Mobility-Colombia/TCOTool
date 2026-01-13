export interface ChartsTooltipProps {
  label: string;
  value: string;
  color: string;
  x: number;
  y: number;
  year?: number;
}

export interface ChartsTooltipContainerProps {
  children: React.ReactNode;
  x: number;
  y: number;
  color: string;
}
