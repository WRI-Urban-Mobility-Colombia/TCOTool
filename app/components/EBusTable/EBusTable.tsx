'use client';

import { When } from 'vizonomy';
import type { EBusTableProps } from './EBusTable.types';
import { TableContainer, TitleContainer, TableWrapper, TableStyled } from './EBusTable.styled';

export function EBusTable<T = Record<string, string | number | null | undefined>>({
  title,
  data,
  columns,
  rowKey = 'id',
}: EBusTableProps<T>) {
  return (
    <TableContainer>
      <When condition={!!title}>
        <TitleContainer>{title}</TitleContainer>
      </When>
      <TableWrapper>
        <TableStyled data={data} columns={columns} rowKey={rowKey} />
      </TableWrapper>
    </TableContainer>
  );
}
