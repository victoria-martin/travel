import { TagLabel } from '@/shared/TagLabel';
import { useState } from 'react';

const SEARCH_FROM = 8;

// OR within a column, AND between columns; a checked value stays visible whatever the search.
export function FilterValuesList({ kind }: { kind: string }) {
  const [search, setSearch] = useState('');
  const levels = window.filterLevels(kind);
  const groups = levels.flatMap((level, levelIndex) => {
    const column = window.filterColumn(kind, level.key);
    if (!column) return [];
    return [
      {
        levelIndex,
        column,
        values: window.filterValues(kind, column),
        checked: window.levelValues(kind, level),
      },
    ];
  });
  const total = groups.reduce((count, group) => count + group.values.length, 0);
  const checkedCount = groups.reduce((count, group) => count + group.checked.length, 0);
  const wanted = search.trim().toLowerCase();
  if (!groups.length) return null;

  return (
    <div className="filter-block">
      <p className="filter-title">Valeurs</p>
      <label className="filter-option filter-select-all">
        <input
          type="checkbox"
          checked={total > 0 && checkedCount === total}
          onChange={(event) => window.setAllFilterValuesEverywhere(kind, event.target.checked)}
        />
        Tout cocher
      </label>
      {total >= SEARCH_FROM && (
        <input
          className="filter-search"
          type="search"
          placeholder="Chercher…"
          value={search}
          onKeyDown={(event) => event.stopPropagation()}
          onChange={(event) => setSearch(event.target.value)}
        />
      )}
      {groups.map((group) => (
        <div key={group.column.key}>
          <div className="inline-menu-group">{window.columnLabel(group.column)}</div>
          {group.values.map((value, valueIndex) => {
            const isChecked = group.checked.includes(value);
            if (!isChecked && wanted && !value.toLowerCase().includes(wanted)) return null;
            const word = group.column.sortOrder?.dict[value];
            return (
              <label key={value} className="filter-option filter-value">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => window.toggleFilterValue(kind, group.levelIndex, valueIndex)}
                />
                {word ? <TagLabel emoji={word.emoji} label={word.label} /> : value}
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}
