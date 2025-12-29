export const ICON_NAMES = {
  SEARCH: 'search',
  EXPORT: 'export',
  CHEVRON_DOWN: 'chevronDown',
  CHECK: 'check',
  INFO: 'info',
} as const;

export const ICONS = {
  [ICON_NAMES.SEARCH]: {
    name: ICON_NAMES.SEARCH,
    alt: 'Search icon',
    src: '/search-icon.svg',
  },
  [ICON_NAMES.EXPORT]: {
    name: ICON_NAMES.EXPORT,
    alt: 'Export icon',
    src: '/export-icon.svg',
  },
  [ICON_NAMES.CHEVRON_DOWN]: {
    name: ICON_NAMES.CHEVRON_DOWN,
    alt: 'Chevron down',
    src: '/chevron-down.svg',
  },
  [ICON_NAMES.CHECK]: {
    name: ICON_NAMES.CHECK,
    alt: 'Check icon',
    src: '/check-icon.svg',
  },
  [ICON_NAMES.INFO]: {
    name: ICON_NAMES.INFO,
    alt: 'Information icon',
    src: '/info-icon.svg',
  },
} as const;
