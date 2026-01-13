export const PDF_TITLE = 'Reporte de Análisis de Costos';

export const PDF_SUBTITLE = {
  PROPERTY_TOTAL_COST: 'Costo Total de Propiedad',
  COMPARISON_OPERATION_ANNUAL: 'Comparación Operación Anual',
  COST_PER_KILOMETER: 'Costo promedio por kilómetro',
} as const;

export const PDF_CATEGORIES = {
  PROPERTY_TOTAL_COST: [['Categoría', 'Diésel', 'GNV', 'Eléctricos']],
  COMPARISON_OPERATION_ANNUAL: [['Diferencial con Diésel', 'GNV', 'Eléctricos']],
  COST_PER_KILOMETER: [['Costo promedio por kilómetro', 'Diésel', 'GNV', 'Eléctricos']],
};

export const PDF_COLUMN_STYLES = {
  PROPERTY_TOTAL_COST: {
    0: { cellWidth: 60 },
    1: { cellWidth: 40, halign: 'right' as const },
    2: { cellWidth: 40, halign: 'right' as const },
    3: { cellWidth: 40, halign: 'right' as const },
  },
  COMPARISON_OPERATION_ANNUAL: {
    0: { cellWidth: 80 },
    1: { cellWidth: 50, halign: 'right' as const },
    2: { cellWidth: 50, halign: 'right' as const },
  },
  COST_PER_KILOMETER: {
    0: { cellWidth: 60 },
    1: { cellWidth: 40, halign: 'right' as const },
    2: { cellWidth: 40, halign: 'right' as const },
    3: { cellWidth: 40, halign: 'right' as const },
  },
} as const;

export const PDF = {
  MARGIN: {
    MAIN: 15,
    SECOND: 25,
    OFFSET_IMAGE: 2,
  },
  SPACING: {
    AFTER_TABLE: 15,
    AFTER_IMAGE: 10,
  },
  FONT_FAMILY: 'helvetica',
  FONT_SIZE: {
    TITLE: 18,
    SUBTITLE: 14,
    BODY: 9,
  },
  FONT_STYLE: {
    BOLD: 'bold',
    NORMAL: 'normal',
  },
} as const;

export const PDF_HEAD_STYLES = {
  fillColor: [246, 246, 246] as [number, number, number],
  textColor: [61, 59, 59] as [number, number, number],
  fontStyle: 'bold' as const,
  lineColor: [231, 230, 230] as [number, number, number],
};

export const PDF_BODY_STYLES = {
  fontSize: PDF.FONT_SIZE.BODY,
  cellPadding: 2,
  lineColor: [231, 230, 230] as [number, number, number],
  lineWidth: 0.2,
  fillColor: [255, 255, 255] as [number, number, number],
};

export const PDF_CELL_STYLES = {
  lineColor: [231, 230, 230] as [number, number, number],
  fillColor: {
    main: [255, 255, 255] as [number, number, number],
    lightGreen: [235, 245, 242] as [number, number, number],
    darkGreen: [194, 229, 220] as [number, number, number],
    lightYellow: [251, 247, 234] as [number, number, number],
  },
  halign: {
    right: 'right' as const,
  },
};

export const PDF_CHART_STYLES = {
  backgroundColor: '#ffffff',
  scale: 2,
  logging: false,
} as const;

export const PDF_TITLE_SPACING = 15;
export const PDF_SUBTITLE_SPACING = 8;
