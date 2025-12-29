import type { TableColumn } from 'vizonomy';

export interface EBusTableProps<T = Record<string, string | number | null | undefined>> {
  title?: string | null;
  data: T[];
  columns: TableColumn<T>[];
  rowKey?: string;
}

export interface TableStyledProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  rowKey?: string;
}
