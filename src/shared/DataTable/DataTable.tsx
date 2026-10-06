import { useState } from 'react';
import type { Column } from './types';
import { DataTableHeadRow } from './DataTableHeadRow';
import { useSyncedHead } from './useSyncedHead';

type SortDir = 'asc' | 'desc';
type Sort = { key: string; dir: SortDir } | null;

/*
  Chrome seul (docs/en-cours/react-migration-plan.md § 4) : le contenu de chaque cellule est composé
  par l'appelant via `column.render`. Avec un `kind`, le tri est celui du legacy (js/sort.js) :
  plusieurs niveaux gardés dans prefs.sort, tri par défaut (SORT_DEFAULTS), ordre de vocabulaire,
  et une colonne est triable quand sa colonne legacy (COLUMN_SETS[kind]) l'est. Sans `kind`, un tri
  à un niveau en état local.
*/
export function DataTable<T extends { id: string }>({
  columns,
  items,
  kind,
  onRowClick,
}: {
  columns: Column<T>[];
  items: T[];
  kind?: string;
  onRowClick?: (item: T) => void;
}) {
  const [localSort, setLocalSort] = useState<Sort>(null);
  const { headRef, headTableRef, bodyRef, bodyTableRef } = useSyncedHead();

  const legacySortable = kind
    ? new Set(window.sortableColumns(kind).map((column) => column.key))
    : null;
  const criteria = kind ? window.sortCriteria(kind) : localSort ? [localSort] : [];
  const isSortable = (column: Column<T>) =>
    legacySortable ? legacySortable.has(column.key) : !!column.sortValue;

  function toggleSort(column: Column<T>) {
    if (kind) return window.toggleSort(kind, column.key);
    if (localSort?.key !== column.key) setLocalSort({ key: column.key, dir: 'asc' });
    else if (localSort.dir === 'asc') setLocalSort({ key: column.key, dir: 'desc' });
    else setLocalSort(null);
  }

  const sorted = kind ? window.sortItems(kind, items) : sortItems(items, columns, localSort);

  return (
    <div className="table-wrap">
      <div className="table-head" ref={headRef}>
        <table ref={headTableRef}>
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} />
            ))}
          </colgroup>
          <thead>
            <DataTableHeadRow
              columns={columns}
              criteria={criteria}
              isSortable={isSortable}
              onSort={toggleSort}
            />
          </thead>
        </table>
      </div>
      <div className="table-body" ref={bodyRef}>
        <table ref={bodyTableRef}>
          <thead aria-hidden="true">
            <DataTableHeadRow
              columns={columns}
              criteria={criteria}
              isSortable={isSortable}
              onSort={toggleSort}
            />
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr
                key={item.id}
                className={onRowClick ? 'list-row row-openable' : 'list-row'}
                onClick={
                  onRowClick
                    ? (event) => {
                        if (
                          event.target instanceof Element &&
                          event.target.closest(
                            'button, a, input, textarea, select, summary, label, [contenteditable]',
                          )
                        ) {
                          return;
                        }
                        onRowClick(item);
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <td key={column.key}>{column.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function sortItems<T>(items: T[], columns: Column<T>[], sort: Sort): T[] {
  if (!sort) return items;
  const column = columns.find((candidate) => candidate.key === sort.key);
  if (!column?.sortValue) return items;
  const sortValue = column.sortValue;
  return [...items].sort((itemA, itemB) => {
    const left = sortValue(itemA);
    const right = sortValue(itemB);
    const diff =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right), 'fr');
    return sort.dir === 'desc' ? -diff : diff;
  });
}
