import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { PdfData, JsPDFWithAutoTable } from '@/app/components/Results/ResultsSection.types';
import { currencyFormatChanger } from './formatters';

const TITLE = 'Reporte de Análisis de Costos';
const SUBTITLE = {
  PROPERTY_TOTAL_COST: 'Costo Total de Propiedad',
  COMPARISON_OPERATION_ANNUAL: 'Comparación Operación Anual',
  COST_PER_KILOMETER: 'Costo promedio por kilómetro',
};
const CATEGORIES = {
  PROPERTY_TOTAL_COST: [['Categoría', 'Diésel', 'GNV', 'Eléctricos']],
  COMPARISON_OPERATION_ANNUAL: [['Diferencial con Diésel', 'GNV', 'Eléctricos']],
  COST_PER_KILOMETER: [['Costo', 'Diésel', 'GNV', 'Eléctricos']],
};

const COLUMN_STYLES = {
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

const PDF = {
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

interface HeadStylesType {
  fillColor: [number, number, number];
  textColor: [number, number, number];
  fontStyle: 'bold' | 'normal';
  lineColor: [number, number, number];
}

const HEAD_STYLES: HeadStylesType = {
  fillColor: [246, 246, 246],
  textColor: [61, 59, 59],
  fontStyle: 'bold',
  lineColor: [231, 230, 230],
};

interface BodyStylesType {
  fontSize: number;
  cellPadding: number;
  lineColor: [number, number, number];
  lineWidth: number;
  fillColor: [number, number, number];
}

const BODY_STYLES: BodyStylesType = {
  fontSize: PDF.FONT_SIZE.BODY,
  cellPadding: 2,
  lineColor: [231, 230, 230],
  lineWidth: 0.2,
  fillColor: [255, 255, 255],
};

interface CellStylesType {
  lineColor: [number, number, number];
  fillColor: {
    main: [number, number, number];
    lightGreen: [number, number, number];
    darkGreen: [number, number, number];
    lightYellow: [number, number, number];
  };
  halign: {
    right: 'right';
  };
}

const CELL_STYLES: CellStylesType = {
  lineColor: [231, 230, 230],
  fillColor: {
    main: [255, 255, 255],
    lightGreen: [235, 245, 242],
    darkGreen: [194, 229, 220],
    lightYellow: [251, 247, 234],
  },
  halign: {
    right: 'right',
  },
};

interface CaptureChartProps {
  doc: jsPDF;
  chartId: string;
  yPosition: number;
  pageWidth: number;
  pageHeight: number;
  chartName: string;
}

const CHART_STYLES = {
  backgroundColor: '#ffffff',
  scale: 2,
  logging: false,
};

async function captureChart({
  doc,
  chartId,
  yPosition,
  pageWidth,
  pageHeight,
  chartName,
}: CaptureChartProps): Promise<number> {
  try {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      const canvas = await html2canvas(chartElement, CHART_STYLES);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - PDF.MARGIN.OFFSET_IMAGE * PDF.MARGIN.MAIN;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yPosition + imgHeight > pageHeight - PDF.MARGIN.MAIN) {
        doc.addPage();
        yPosition = PDF.MARGIN.MAIN;
      }

      doc.addImage(imgData, 'PNG', PDF.MARGIN.MAIN, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + PDF.SPACING.AFTER_IMAGE;
    }
  } catch (error) {
    console.warn(`No se pudo capturar el gráfico de ${chartName}:`, error);
  }
  return yPosition;
}

export async function generatePdf(data: PdfData): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4') as JsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition: number = PDF.MARGIN.MAIN;

  doc.setFontSize(PDF.FONT_SIZE.TITLE);
  doc.setFont(PDF.FONT_FAMILY, PDF.FONT_STYLE.BOLD);
  doc.text(TITLE, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  doc.setFontSize(PDF.FONT_SIZE.SUBTITLE);
  doc.setFont(PDF.FONT_FAMILY, PDF.FONT_STYLE.BOLD);
  doc.text(SUBTITLE.PROPERTY_TOTAL_COST, PDF.MARGIN.MAIN, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: CATEGORIES.PROPERTY_TOTAL_COST,
    body: data.totalCostPropertyData.map((row) => [
      row.category,
      currencyFormatChanger(row.diesel, data.currencyPrefix),
      currencyFormatChanger(row.gnv, data.currencyPrefix),
      currencyFormatChanger(row.electric, data.currencyPrefix),
    ]),
    headStyles: HEAD_STYLES,
    styles: BODY_STYLES,
    columnStyles: COLUMN_STYLES.PROPERTY_TOTAL_COST,
    didParseCell: (hookData) => {
      hookData.cell.styles.lineColor = CELL_STYLES.lineColor;
      if (hookData.section === 'body') {
        hookData.cell.styles.fillColor = CELL_STYLES.fillColor.main;
      }
      if (hookData.section === 'head' && hookData.column.index > 0) {
        hookData.cell.styles.halign = CELL_STYLES.halign.right;
      }
      if (hookData.section === 'body') {
        const row = data.totalCostPropertyData[hookData.row.index];
        if (row) {
          if (['total', 'additional-expenses', 'total-overhead'].includes(row.id)) {
            hookData.cell.styles.fontStyle = PDF.FONT_STYLE.BOLD;
          }
          if (['total', 'additional-expenses'].includes(row.id)) {
            hookData.cell.styles.fillColor = CELL_STYLES.fillColor.lightGreen;
          }
          if (row.id === 'total-overhead') {
            hookData.cell.styles.fillColor = CELL_STYLES.fillColor.darkGreen;
          }
        }
      }
    },
  });

  yPosition = (doc.lastAutoTable?.finalY ?? yPosition) + PDF.SPACING.AFTER_TABLE;

  yPosition = await captureChart({
    doc,
    chartId: 'chart-total-cost-ownership',
    yPosition,
    pageWidth,
    pageHeight,
    chartName: SUBTITLE.PROPERTY_TOTAL_COST,
  });

  doc.addPage();
  yPosition = PDF.MARGIN.SECOND;

  doc.setFontSize(PDF.FONT_SIZE.SUBTITLE);
  doc.setFont(PDF.FONT_FAMILY, PDF.FONT_STYLE.BOLD);
  doc.text(SUBTITLE.COMPARISON_OPERATION_ANNUAL, PDF.MARGIN.MAIN, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: CATEGORIES.COMPARISON_OPERATION_ANNUAL,
    body: data.comparisonOperationAnnualData.map((row) => [
      row.differential,
      currencyFormatChanger(row.gnv, data.currencyPrefix),
      currencyFormatChanger(row.electric, data.currencyPrefix),
    ]),
    headStyles: HEAD_STYLES,
    styles: BODY_STYLES,
    columnStyles: COLUMN_STYLES.COMPARISON_OPERATION_ANNUAL,
    didParseCell: (hookData) => {
      hookData.cell.styles.lineColor = CELL_STYLES.lineColor;
      if (hookData.section === 'head' && hookData.column.index > 0) {
        hookData.cell.styles.halign = CELL_STYLES.halign.right;
      }
      if (hookData.section === 'body') {
        if (hookData.column.index === 0) {
          hookData.cell.styles.fontStyle = PDF.FONT_STYLE.BOLD;
          hookData.cell.styles.fillColor = CELL_STYLES.fillColor.lightYellow;
        } else {
          hookData.cell.styles.fontStyle = PDF.FONT_STYLE.NORMAL;
          hookData.cell.styles.fillColor = CELL_STYLES.fillColor.lightGreen;
        }
      }
    },
  });

  yPosition = (doc.lastAutoTable?.finalY ?? yPosition) + PDF.SPACING.AFTER_TABLE;

  yPosition = await captureChart({
    doc,
    chartId: 'chart-comparison-operation-annual',
    yPosition,
    pageWidth,
    pageHeight,
    chartName: SUBTITLE.COMPARISON_OPERATION_ANNUAL,
  });

  doc.addPage();
  yPosition = PDF.MARGIN.SECOND;

  doc.setFontSize(PDF.FONT_SIZE.SUBTITLE);
  doc.setFont(PDF.FONT_FAMILY, PDF.FONT_STYLE.BOLD);
  doc.text(SUBTITLE.COST_PER_KILOMETER, PDF.MARGIN.MAIN, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: CATEGORIES.COST_PER_KILOMETER,
    body: data.costPerKilometerData.map((row) => [
      row.cost,
      currencyFormatChanger(row.diesel, data.currencyPrefix),
      currencyFormatChanger(row.gnv, data.currencyPrefix),
      currencyFormatChanger(row.electric, data.currencyPrefix),
    ]),
    headStyles: HEAD_STYLES,
    styles: BODY_STYLES,
    columnStyles: COLUMN_STYLES.COST_PER_KILOMETER,
    didParseCell: (hookData) => {
      hookData.cell.styles.lineColor = CELL_STYLES.lineColor;
      if (hookData.section === 'body') {
        hookData.cell.styles.fillColor = CELL_STYLES.fillColor.main;
      }
      if (hookData.section === 'head' && hookData.column.index > 0) {
        hookData.cell.styles.halign = CELL_STYLES.halign.right;
      }
      if (hookData.section === 'body') {
        const row = data.costPerKilometerData[hookData.row.index];
        if (row && row.id === 'total') {
          hookData.cell.styles.fontStyle = PDF.FONT_STYLE.BOLD;
          hookData.cell.styles.fillColor = CELL_STYLES.fillColor.darkGreen;
        }
      }
    },
  });

  yPosition = (doc.lastAutoTable?.finalY ?? yPosition) + PDF.SPACING.AFTER_TABLE;

  yPosition = await captureChart({
    doc,
    chartId: 'chart-cost-per-kilometer',
    yPosition,
    pageWidth,
    pageHeight,
    chartName: SUBTITLE.COST_PER_KILOMETER,
  });

  doc.save('reporte-analisis-costos.pdf');
}
