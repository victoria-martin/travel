import { useState } from 'react';
import { Icon } from '../Icon';
import type { Column } from './types';

type SortDir = 'asc' | 'desc';
type Sort = { key: string; dir: SortDir } | null;

/*
  Chrome seul (docs/en-cours/react-migration-plan.md § 4) : tri un seul niveau, cycle asc → desc → aucun,
  sur le modèle de toggleSort (js/sort.js) mais en état local — pas encore persisté dans prefs, pas
  encore de tri multi-niveaux ni de colonnes masquables. Le contenu de chaque cellule est composé
  par l'appelant via `column.render`.
*/
export function DataTable<T extends { id: string }>({
  columns,
  items,
  onRowClick,
}: {
  columns: Column<T>[];
  items: T[];
  onRowClick?: (item: T) => void;
}) {
  const [sort, setSort] = useState<Sort>(null);

  function toggleSort(column: Column<T>) {
    if (!column.sortValue) return;
    if (sort?.key !== column.key) setSort({ key: column.key, dir: 'asc' });
    else if (sort.dir === 'asc') setSort({ key: column.key, dir: 'desc' });
    else setSort(null);
  }

  const sorted = sortItems(items, columns, sort);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.sortValue ? (
                  <button
                    className={`th-sort ${sort?.key === column.key ? 'active' : ''}`}
                    onClick={() => toggleSort(column)}
                    title={`Trier par ${column.label}`}
                  >
                    {column.label}
                    <span className="th-sort-arrow">
                      <Icon
                        name={
                          sort?.key !== column.key
                            ? 'arrow-up-down'
                            : sort.dir === 'asc'
                              ? 'arrow-up'
                              : 'arrow-down'
                        }
                      />
                    </span>
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
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
