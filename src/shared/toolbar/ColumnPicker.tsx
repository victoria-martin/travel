import type { Column } from '../DataTable/types';
import { ToolbarPanel } from '../select/ToolbarPanel';

/*
  Port de columnPicker (js/columns.js), délégué au getter/setter legacy (prefs.hiddenColumns,
  toggleColumn) plutôt que réimplémenté : une seule source pour la préférence, qu'elle soit touchée
  depuis cet écran ou (plus tard) depuis le legacy encore en place sur d'autres pages.
*/
export function ColumnPicker<T>({ kind, columns }: { kind: string; columns: Column<T>[] }) {
  const hidden = window.hiddenColumns(kind);
  const options = columns.filter((column) => !column.locked);
  return (
    <ToolbarPanel
      icon="columns-3"
      label="Colonnes"
      // count={options.filter((column) => hidden.includes(column.key)).length}
    >
      {options.map((column) => (
        <label className="filter-option" key={column.key}>
          <input
            type="checkbox"
            checked={!hidden.includes(column.key)}
            onChange={() => window.toggleColumn(kind, column.key)}
          />
          {column.label}
        </label>
      ))}
    </ToolbarPanel>
  );
}
