export const EBUS_BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  ONLY_TEXT: 'only-text',
} as const;

export const ICON_POSITIONS = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export const BUTTON_STYLES = {
  BASE: 'cursor-pointer flex items-center justify-center gap-2 rounded-full',
  PRIMARY: 'bg-[#F0AB00] text-black transition-opacity hover:opacity-90 px-8 py-2 text-sm md:px-10 md:text-base',
  SECONDARY: 'bg-white border border-[#E7E6E6] text-[#3D3B3B] px-4 py-2',
  ONLY_TEXT:
    'mb-6 flex w-full items-center justify-center gap-2 font-["Inter",sans-serif] ' +
    'font-bold text-[#332300] text-xs sm:text-sm break-words whitespace-normal',
} as const;

export const BUTTON_ICON_SIZE = {
  WIDTH: 16,
  HEIGHT: 16,
} as const;

export const ICON_BASE_CLASSES = 'shrink-0';
