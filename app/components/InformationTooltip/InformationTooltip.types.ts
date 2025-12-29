export interface InformationTooltipProps {
  text?: string | React.ReactNode;
}

export interface InformationTooltipBridgeProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export interface InformationTooltipContainerProps extends InformationTooltipBridgeProps {
  children: React.ReactNode;
}

export interface InformationTooltipTriggerProps extends InformationTooltipBridgeProps {
  children: React.ReactNode;
}

export interface InformationTooltipContentProps extends InformationTooltipBridgeProps {
  children: React.ReactNode;
}
