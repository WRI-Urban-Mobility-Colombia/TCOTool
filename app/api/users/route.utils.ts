import fs from 'node:fs';
import path from 'node:path';
import type { DownloadModalFormData } from '@/app/components/Header/DownloadModal/DownloadModal.types';
import { CSV_FILENAME, CSV_DELIMITER, CSV_BOM, CSV_HEADERS } from './route.constants';

export function getCsvFilePath(): string {
  return path.join(process.cwd(), 'data', CSV_FILENAME);
}

export function escapeCsvValue(value: string): string {
  if (!value) {
    return '';
  }

  const stringValue = String(value).trim();

  if (stringValue.includes(CSV_DELIMITER) || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function convertRowToCsv(row: (string | number)[]): string {
  return row.map((cell) => escapeCsvValue(String(cell))).join(CSV_DELIMITER);
}

export function ensureCsvFileExists(filePath: string): void {
  const dataDir = path.dirname(filePath);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const headerRow = convertRowToCsv([...CSV_HEADERS]);
    fs.writeFileSync(filePath, CSV_BOM + headerRow + '\n', 'utf8');
  }
}

export function appendUserToCsv(filePath: string, userData: DownloadModalFormData): void {
  const now = new Date();
  const date = now.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const row = convertRowToCsv([
    date,
    time,
    userData.email || '',
    userData.firstName || '',
    userData.lastName || '',
    userData.jobTitle || '',
    userData.organization || '',
    userData.sector || '',
    userData.rating || '',
    userData.comments || '',
  ]);

  fs.appendFileSync(filePath, row + '\n', 'utf8');
}
