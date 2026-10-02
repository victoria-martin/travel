import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DataTable } from '../../shared/DataTable/DataTable';
import { normalizeSearch } from '../../shared/normalizeSearch';
import { SearchField } from '../../shared/SearchField';
import { ColumnPicker } from '../../shared/toolbar/ColumnPicker';
import { SettingsMenu } from '../../shared/toolbar/SettingsMenu';
import { useTravelStore } from '../../store/useTravelStore';
import { columns } from './AttractionsView/columns';
import { searchAttraction } from './searchAttraction';

/*
  Porte js/views/attractions/{attractions,header,columns}.js sur DataTable, même scope réduit que
  Cities/Charges fixes/Transports : tri/recherche/colonnes masquables/édition en place faits.
  Restent, pas bloquants : bouton Ajouter, mode cartes (listModeToggle), favoris uniquement, menu ⋮.
*/
export function AttractionsView() {
  const attractions = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.attractions)),
  );

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? attractions.filter((attraction) =>
        normalizeSearch(searchAttraction(attraction)).includes(wanted),
      )
    : attractions;
  const hidden = window.hiddenColumns('attractions');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Lieux &amp; activités</h2>
          <p className="view-sub">
            {items.length} lieu{items.length > 1 ? 'x' : ''}
          </p>
        </div>
        <div className="view-header-actions">
          <SearchField value={query} onChange={setQuery} />
          <ColumnPicker kind="attractions" columns={columns} />
          <SettingsMenu />
        </div>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun lieu</strong>
          Ajoute une ville, un village, un premier lieu à visiter.
        </div>
      ) : (
        <DataTable
          columns={visibleColumns}
          items={items}
          onRowClick={(attraction) => window.openAttractionSheet(attraction.id)}
        />
      )}
    </>
  );
}
