import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import type { BusRow } from '@/app/components/Results/ResultsSection.types';

export function getDataDir(): string {
  return path.join(process.cwd(), 'data');
}

export type CsvRecord = Record<string, string>;

export function readCsvAsObjects(csvAbsolutePath: string): CsvRecord[] {
  const fileContent = fs.readFileSync(csvAbsolutePath, 'utf8');
  const records = parse(fileContent, {
    columns: (header: string[]) => header.map((h) => (h ?? '').trim()),
    skip_empty_lines: true,
    trim: true,
  });

  return records as CsvRecord[];
}

export function toNumberLoose(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value == null) return 0;
  const str = String(value).trim();
  if (str === '' || str === '-' || str === '–' || str === '—') return 0;
  const normalized = str.replace(/,/g, '');
  const num = +normalized;
  return Number.isFinite(num) ? num : 0;
}

export function getConsumptionTechnologyCsvPath(): string {
  return path.join(getDataDir(), 'supuestos_buses_consumo_tecnologia.csv');
}

export function getBusesCsvPath(): string {
  return path.join(getDataDir(), 'supuestos_buses.csv');
}

function normalizeValue(value: string | undefined): string {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed === '' ? '' : trimmed;
}

function transformCsvRowToBusRow(row: CsvRecord): BusRow {
  return {
    technology: normalizeValue(row['technology']),
    typology: normalizeValue(row['typology']),
    usefulLife: normalizeValue(row['useful-life']),
    busCostUSD: normalizeValue(row['bus-cost-usd']),
    infrastructureUSD: normalizeValue(row['infrastructure-usd']),
    batteryUSD: normalizeValue(row['battery-usd']),
    consumptionKmUnitDefault: normalizeValue(row['consumption-km-unit-default']),
    maintenanceUSDKm: normalizeValue(row['maintenance-usd-km']),
  };
}

export function loadBuses(typology?: string): BusRow[] {
  const csvPath = getBusesCsvPath();

  const rows = readCsvAsObjects(csvPath);

  const filtered = rows
    .filter((r) => {
      const rowTypology = normalizeValue(r['typology']).toLowerCase();

      const matchesTypology = typology ? rowTypology === typology.trim().toLowerCase() : true;

      return matchesTypology;
    })
    .map(transformCsvRowToBusRow)
    .filter((row) => row.technology !== '' && row.typology !== '');

  return filtered;
}
