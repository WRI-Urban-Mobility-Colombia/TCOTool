export const SPACE_BETWEEN_LABELS_AND_GRAPHIC = 20;

export const DEFAULT_MARGIN = {
  TOP: 60,
  RIGHT: 0,
  BOTTOM: 60,
  LEFT: 20,
} as const;

export const DEFAULT_DIMENSIONS = {
  width: 697,
  height: 396,
} as const;

export const FONT = {
  SIZE: 14,
  FAMILY: 'Inter, sans-serif',
  Y_AXIS_LABEL_SIZE: 12,
} as const;

export const AXIS = {
  MIN_WIDTH: 20,
  MIN_WIDTH_PADDING: 8,
  TEXT_OFFSET_X: -4,
  TEXT_LENGTH_ADJUSTMENT: 8,
  X_LABEL_OFFSET_Y: 15,
  Y_LABEL_OFFSET_Y: -1 / 3,
} as const;

export const GRID_LINE = {
  COLOR: '#e5e7eb',
  STROKE_WIDTH: 1,
} as const;

export const TEXT = {
  COLOR: '#000000',
} as const;

export const LINE = {
  STROKE_WIDTH: 2,
} as const;

export const MARKER = {
  CIRCLE_RADIUS: 4,
  SQUARE_SIZE: 11.32,
  SQUARE_OFFSET: 5.66,
  SQUARE_RX: 1,
  TRIANGLE_SIZE: 6,
  DIAMOND_SIZE: 6,
  HIT_AREA_RADIUS: 8,
  HIT_AREA_OFFSET_Y: 20,
} as const;

export const LEGEND = {
  OFFSET_Y: 20,
  ICON_WIDTH: 12,
  ICON_TO_TEXT_GAP: 4,
  ITEM_GAP: 18,
  CIRCLE_RADIUS: 6,
  SQUARE_SIZE: 12,
  SQUARE_RX: 2,
  TEXT_OFFSET_X: 16,
  TEXT_OFFSET_Y: 6,
} as const;

export const CALCULATION = {
  APPROXIMATE_STEP_FACTOR: 0.2,
  YEAR_PADDING_FACTOR: 0.01,
  DEFAULT_YEAR_PADDING: 0.5,
} as const;

export const MILLION_THRESHOLD = 1000000;
