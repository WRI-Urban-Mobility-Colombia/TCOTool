export const TOGGLE_STYLES = {
  CONTAINER: 'flex items-center gap-2',
  BUTTON:
    'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors focus:outline-none p-[2.7px]',
  BUTTON_ACTIVE: 'bg-[#F0AB00]',
  BUTTON_INACTIVE: 'bg-[#c9c9c9]',
  SWITCH: 'absolute inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform',
  SWITCH_ACTIVE: 'translate-x-[13px]',
  SWITCH_INACTIVE: 'translate-x-0',
  LABEL: 'text-sm text-[#3d3b3b] whitespace-nowrap',
  LABEL_CONTAINER: 'flex items-center gap-1 min-w-0',
} as const;
