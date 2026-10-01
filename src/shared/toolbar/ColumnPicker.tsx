import { ToolbarPanel } from './ToolbarPanel';
import type { Column } from '../DataTable/types';

/*
  Port de columnPicker (js/columns.js), délégué au getter/setter legacy (prefs.hiddenColumns,
  toggleColumn) plutôt que réimplémenté : une seule source pour la préférence, qu'elle soit touchée
  depuis cet écran ou (plus tard) depuis le legacy encore en place sur d'autres pages.
*/
export function ColumnPicker<T>({ kind, columns }: { kind: string; columns: Column<T>[] }) {
  const hidden = window.hiddenColumns(kind);
  const options = columns.filter((c) => !c.locked);
  return (
    <ToolbarPanel icon="columns-3" label="Colonnes" count={options.filter((c) => hidden.includes(c.key)).length}>
      {options.map((c) => (
        <label className="filter-option" key={c.key}>
          <input
            type="checkbox"
            checked={!hidden.includes(c.key)}
            onChange={() => window.toggleColumn(kind, c.key)}
          />
          {c.label}
        </label>
      ))}
    </ToolbarPanel>
  );
}
