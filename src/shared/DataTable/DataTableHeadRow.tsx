import { Icon } from '../Icon';
import type { Column } from './types';

export function DataTableHeadRow<T>({
  columns,
  criteria,
  isSortable,
  onSort,
}: {
  columns: Column<T>[];
  criteria: { key: string; dir: 'asc' | 'desc' }[];
  isSortable: (column: Column<T>) => boolean;
  onSort: (column: Column<T>) => void;
}) {
  return (
    <tr>
      {columns.map((column) => {
        if (!isSortable(column)) return <th key={column.key}>{column.label}</th>;
        const index = criteria.findIndex((criterion) => criterion.key === column.key);
        const arrow =
          index < 0 ? 'arrow-up-down' : criteria[index].dir === 'asc' ? 'arrow-up' : 'arrow-down';
        return (
          <th key={column.key}>
            <button
              className={`th-sort ${index >= 0 ? 'active' : ''}`}
              onClick={() => onSort(column)}
              title={`Trier par ${column.label}`}
            >
              {column.label}
              <span className="th-sort-arrow">
                <Icon name={arrow} />
                {index >= 0 && criteria.length > 1 ? index + 1 : ''}
              </span>
            </button>
          </th>
        );
      })}
    </tr>
  );
}
