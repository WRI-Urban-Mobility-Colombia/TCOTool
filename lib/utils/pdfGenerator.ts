import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { PdfData, JsPDFWithAutoTable } from '@/app/components/Results/ResultsSection.types';
import { currencyFormatChanger } from './formatters';
import {
  PDF_TITLE,
  PDF_SUBTITLE,
  PDF_CATEGORIES,
  PDF_COLUMN_STYLES,
  PDF,
  PDF_HEAD_STYLES,
  PDF_BODY_STYLES,
  PDF_CELL_STYLES,
  PDF_CHART_STYLES,
  PDF_TITLE_SPACING,
  PDF_SUBTITLE_SPACING,
} from './pdfGenerator.constants';
import type { CaptureChartProps } from './pdfGenerator.types';

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
      const canvas = await html2canvas(chartElement, PDF_CHART_STYLES);
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
  doc.text(PDF_TITLE, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += PDF_TITLE_SPACING;

  doc.setFontSize(PDF.FONT_SIZE.SUBTITLE);
  doc.setFont(PDF.FONT_FAMILY, PDF.FONT_STYLE.BOLD);
  doc.text(PDF_SUBTITLE.PROPERTY_TOTAL_COST, PDF.MARGIN.MAIN, yPosition);
  yPosition += PDF_SUBTITLE_SPACING;

  autoTable(doc, {
    startY: yPosition,
    head: PDF_CATEGORIES.PROPERTY_TOTAL_COST,
    body: data.totalCostPropertyData.map((row) => [
      row.category,
      currencyFormatChanger(row.diesel, data.currencyPrefix),
      currencyFormatChanger(row.gnv, data.currencyPrefix),
      currencyFormatChanger(row.electric, data.currencyPrefix),
    ]),
    headStyles: PDF_HEAD_STYLES,
    styles: PDF_BODY_STYLES,
    columnStyles: PDF_COLUMN_STYLES.PROPERTY_TOTAL_COST,
    didParseCell: (hookData) => {
      hookData.cell.styles.lineColor = PDF_CELL_STYLES.lineColor;
      if (hookData.section === 'body') {
        hookData.cell.styles.fillColor = PDF_CELL_STYLES.fillColor.main;
      }
      if (hookData.section === 'head' && hookData.column.index > 0) {
        hookData.cell.styles.halign = PDF_CELL_STYLES.halign.right;
      }
      if (hookData.section === 'body') {
        const row = data.totalCostPropertyData[hookData.row.index];
        if (row) {
          if (['total', 'additional-expenses', 'total-overhead'].includes(row.id)) {
            hookData.cell.styles.fontStyle = PDF.FONT_STYLE.BOLD;
          }
          if (['total', 'additional-expenses'].includes(row.id)) {
            hookData.cell.styles.fillColor = PDF_CELL_STYLES.fillColor.lightGreen;
          }
          if (row.id === 'total-overhead') {
            hookData.cell.styles.fillColor = PDF_CELL_STYLES.fillColor.darkGreen;
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
    chartName: PDF_SUBTITLE.PROPERTY_TOTAL_COST,
  });

  doc.addPage();
  yPosition = PDF.MARGIN.SECOND;

  doc.setFontSize(PDF.FONT_SIZE.SUBTITLE);
  doc.setFont(PDF.FONT_FAMILY, PDF.FONT_STYLE.BOLD);
  doc.text(PDF_SUBTITLE.COMPARISON_OPERATION_ANNUAL, PDF.MARGIN.MAIN, yPosition);
  yPosition += PDF_SUBTITLE_SPACING;

  autoTable(doc, {
    startY: yPosition,
    head: PDF_CATEGORIES.COMPARISON_OPERATION_ANNUAL,
    body: data.comparisonOperationAnnualData.map((row) => [
      row.differential,
      currencyFormatChanger(row.gnv, data.currencyPrefix),
      currencyFormatChanger(row.electric, data.currencyPrefix),
    ]),
    headStyles: PDF_HEAD_STYLES,
    styles: PDF_BODY_STYLES,
    columnStyles: PDF_COLUMN_STYLES.COMPARISON_OPERATION_ANNUAL,
    didParseCell: (hookData) => {
      hookData.cell.styles.lineColor = PDF_CELL_STYLES.lineColor;
      if (hookData.section === 'head' && hookData.column.index > 0) {
        hookData.cell.styles.halign = PDF_CELL_STYLES.halign.right;
      }
      if (hookData.section === 'body') {
        if (hookData.column.index === 0) {
          hookData.cell.styles.fontStyle = PDF.FONT_STYLE.BOLD;
          hookData.cell.styles.fillColor = PDF_CELL_STYLES.fillColor.lightYellow;
        } else {
          hookData.cell.styles.fontStyle = PDF.FONT_STYLE.NORMAL;
          hookData.cell.styles.fillColor = PDF_CELL_STYLES.fillColor.lightGreen;
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
    chartName: PDF_SUBTITLE.COMPARISON_OPERATION_ANNUAL,
  });

  doc.addPage();
  yPosition = PDF.MARGIN.SECOND;

  doc.setFontSize(PDF.FONT_SIZE.SUBTITLE);
  doc.setFont(PDF.FONT_FAMILY, PDF.FONT_STYLE.BOLD);
  doc.text(PDF_SUBTITLE.COST_PER_KILOMETER, PDF.MARGIN.MAIN, yPosition);
  yPosition += PDF_SUBTITLE_SPACING;

  autoTable(doc, {
    startY: yPosition,
    head: PDF_CATEGORIES.COST_PER_KILOMETER,
    body: data.costPerKilometerData.map((row) => [
      row.cost,
      currencyFormatChanger(row.diesel, data.currencyPrefix),
      currencyFormatChanger(row.gnv, data.currencyPrefix),
      currencyFormatChanger(row.electric, data.currencyPrefix),
    ]),
    headStyles: PDF_HEAD_STYLES,
    styles: PDF_BODY_STYLES,
    columnStyles: PDF_COLUMN_STYLES.COST_PER_KILOMETER,
    didParseCell: (hookData) => {
      hookData.cell.styles.lineColor = PDF_CELL_STYLES.lineColor;
      if (hookData.section === 'body') {
        hookData.cell.styles.fillColor = PDF_CELL_STYLES.fillColor.main;
      }
      if (hookData.section === 'head' && hookData.column.index > 0) {
        hookData.cell.styles.halign = PDF_CELL_STYLES.halign.right;
      }
      if (hookData.section === 'body') {
        const row = data.costPerKilometerData[hookData.row.index];
        if (row && row.id === 'total') {
          hookData.cell.styles.fontStyle = PDF.FONT_STYLE.BOLD;
          hookData.cell.styles.fillColor = PDF_CELL_STYLES.fillColor.darkGreen;
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
    chartName: PDF_SUBTITLE.COST_PER_KILOMETER,
  });

  doc.save('reporte-analisis-costos.pdf');
}
