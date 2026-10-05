import type { Column } from './types';

export function visibleColumns<T>(kind: string, columns: Column<T>[]): Column<T>[] {
  const hidden = window.hiddenColumns(kind);
  return columns.filter((column) => column.locked || !hidden.includes(column.key));
}
