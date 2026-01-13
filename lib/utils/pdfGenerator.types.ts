import jsPDF from 'jspdf';

export interface HeadStylesType {
  fillColor: [number, number, number];
  textColor: [number, number, number];
  fontStyle: 'bold' | 'normal';
  lineColor: [number, number, number];
}

export interface BodyStylesType {
  fontSize: number;
  cellPadding: number;
  lineColor: [number, number, number];
  lineWidth: number;
  fillColor: [number, number, number];
}

export interface CellStylesType {
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

export interface CaptureChartProps {
  doc: jsPDF;
  chartId: string;
  yPosition: number;
  pageWidth: number;
  pageHeight: number;
  chartName: string;
}
