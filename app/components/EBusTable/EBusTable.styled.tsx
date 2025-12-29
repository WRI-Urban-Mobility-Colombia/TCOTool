import React from 'react';
import { Table } from 'vizonomy';
import type { TableStyledProps } from './EBusTable.types';

export function TableContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-full overflow-x-auto">{children}</div>;
}

export function TitleContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-0 rounded-t-sm bg-[#cae6f8] px-2 sm:px-3 py-2 text-center font-['Inter',sans-serif]
      text-sm sm:text-sm font-bold text-[#3d3b3b] border border-[#e7e6e6] border-b-0"
    >
      {children}
    </div>
  );
}

export function TableWrapper({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto [&_*]:border-[#e7e6e6]">{children}</div>;
}

export function TableStyled<T = Record<string, string | number | null | undefined>>({
  data,
  columns,
  rowKey = 'id',
}: TableStyledProps<T>) {
  return (
    <Table
      data={data}
      columns={columns}
      rowKey={rowKey}
      size="small"
      className="ebus-table w-full min-w-full [&_th]:font-['Inter',sans-serif]
      [&_th]:text-xs sm:[&_th]:text-sm [&_th]:font-bold [&_th]:text-[#3d3b3b]
      [&_th]:text-center [&_td]:px-1 sm:[&_td]:px-2 [&_td]:py-1.5 sm:[&_td]:py-2
      [&_th]:px-1 sm:[&_th]:px-2 [&_table]:w-full [&_table]:table-fixed
      [&_table]:min-w-[600px] [&_table]:border-0 [&_th]:border-[1px]
      [&_th]:border-[#e7e6e6] [&_td]:border-[1px] [&_td]:border-[#e7e6e6]
      [&_td]:text-xs sm:[&_td]:text-sm [&_input]:text-xs sm:[&_input]:text-sm"
    />
  );
}
