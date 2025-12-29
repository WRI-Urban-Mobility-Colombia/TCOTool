import { BILLION_THRESHOLD, DECIMAL_PLACES, MILLION_THRESHOLD } from './utils.constants';

export const formatPercentage = (value: string | number): string => {
  const numValue = typeof value === 'string' ? value.replace(/[^\d.]/g, '') : `${value}`;

  if (!numValue || numValue === '') return '';

  const number = +numValue;
  if (isNaN(number)) return '';

  return `${number}%`;
};

export const formatCurrency = (value: string | number, prefix: string = '$', separator: string = ','): string => {
  const numValue = typeof value === 'string' ? value.replace(/[^\d.]/g, '') : `${value}`;

  if (!numValue || numValue === '') return '';

  const number = +numValue;
  if (isNaN(number)) return '';

  const parts = `${number}`.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return prefix === 'COP' ? `${prefix} ${parts.join('.')}` : `${prefix}${parts.join('.')}`;
};

export const extractCurrencyValue = (value: string): number => {
  const numValue = value.replace(/[^\d.]/g, '');
  return +numValue;
};

export const formatNumberThousands = (value: string | number, separator: string = ','): string => {
  const numValue = typeof value === 'string' ? value.replace(/[^\d.]/g, '') : `${value}`;

  if (!numValue || numValue === '') return '';

  const number = +numValue;
  if (isNaN(number)) return '';

  const parts = `${number}`.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return parts.join('.');
};

export const extractNumberValue = (value: string): number => {
  const numValue = value.replace(/[^\d.]/g, '');
  return +numValue;
};

export const formatConsumoKM = (value: string | number, suffix: 'Km/gal' | 'Km/m3' | 'Km/kWh'): string => {
  const numValue = typeof value === 'string' ? value.replace(/[^\d.]/g, '') : `${value}`;

  if (!numValue || numValue === '') return '';

  return `${numValue} ${suffix}`;
};

export const stringToValidNumber = (value: string | undefined | null): number => {
  if (!value) return 0;
  const numValue = value.replace(/[^\d]/g, '');
  return +numValue;
};

export const extractNumericValue = (value: string): string => {
  return value.replace(/[^\d.]/g, '');
};

export const extractNumericValueWithMax = (value: string, max: number = 100): string => {
  const numericValue = extractNumericValue(value);
  if (!numericValue || numericValue === '') return '';
  const number = +numericValue;
  if (isNaN(number)) return '';
  const limitedValue = number > max ? max : number;
  return `${limitedValue}`;
};

export const percentageToDecimal = (value: string): string => {
  const numValue = extractNumericValue(value);
  if (!numValue || numValue === '') return '';
  const number = +numValue;
  if (isNaN(number)) return '';
  const decimal = number / 100;
  return `${decimal}`;
};

export function currencyFormatChanger(value: number | null | undefined, currencyPrefix: string): string {
  if (value === null || value === undefined) {
    return '-';
  }
  const formatted = formatNumberThousands(value);
  return currencyPrefix === 'COP' ? `COP ${formatted}` : `${currencyPrefix}${formatted}`;
}

export function formatLargeValue(value: number, baseFormatter: (value: number) => string, maxValue: number): string {
  if (maxValue >= BILLION_THRESHOLD) {
    const originalFormat = baseFormatter(value);
    const prefixMatch = originalFormat.match(/^([^\d]*)/);
    const prefix = prefixMatch ? prefixMatch[1] : '$';

    const valueInBillions = value / BILLION_THRESHOLD;
    const parts = valueInBillions.toFixed(DECIMAL_PLACES).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = parts.join('.').replace(/\.?0+$/, '');
    return `${prefix}${formatted} B`;
  }

  if (maxValue > MILLION_THRESHOLD) {
    const originalFormat = baseFormatter(value);
    const prefixMatch = originalFormat.match(/^([^\d]*)/);
    const prefix = prefixMatch ? prefixMatch[1] : '$';

    const valueInMillions = value / MILLION_THRESHOLD;
    const parts = valueInMillions.toFixed(DECIMAL_PLACES).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = parts.join('.').replace(/\.?0+$/, '');
    return `${prefix}${formatted} M`;
  }

  return baseFormatter(value);
}

export function clampMinNumberString(value: string, min: number = 1): string {
  const trimmed = value.trim();

  if (trimmed === '') {
    return '';
  }

  const numericValue = +trimmed;

  if (Number.isNaN(numericValue)) {
    return '';
  }

  const clampedValue = numericValue < min ? min : numericValue;
  return `${clampedValue}`;
}

export function clampDecimalRange(value: string, min: number = 0, max: number = 1, maxDecimals: number = 2): string {
  const trimmed = value.trim();

  if (trimmed === '') return '';

  const numericValue = extractNumericValue(trimmed);

  if (!numericValue || numericValue === '') return '';

  const parts = numericValue.split('.');
  let processedValue = numericValue;

  if (parts.length > 1 && parts[1].length > maxDecimals) {
    processedValue = parts[0] + '.' + parts[1].substring(0, maxDecimals);
  }

  const number = +processedValue;

  if (Number.isNaN(number)) return '';

  const clampedValue = Math.max(min, Math.min(max, number));

  const formatted = clampedValue.toFixed(maxDecimals).replace(/\.?0+$/, '');

  return formatted;
}
