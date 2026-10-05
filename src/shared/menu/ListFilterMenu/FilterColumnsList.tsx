// The columns that filter: a checked column keeps all its values until one of them is unticked.
export function FilterColumnsList({ kind }: { kind: string }) {
  const columns = window.filterableColumns(kind);
  const levels = window.filterLevels(kind);
  const allChecked = columns.length > 0 && levels.length === columns.length;
  return (
    <div className="filter-block">
      <p className="filter-title">Filtrer par</p>
      <label className="filter-option filter-select-all">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(event) => window.setAllFilterLevels(kind, event.target.checked)}
        />
        Tout cocher
      </label>
      {columns.map((column) => (
        <label key={column.key} className="filter-option">
          <input
            type="checkbox"
            checked={levels.some((level) => level.key === column.key)}
            onChange={() => window.toggleFilterLevel(kind, column.key)}
          />
          {window.columnLabel(column)}
        </label>
      ))}
    </div>
  );
}
