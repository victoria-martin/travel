import { useState } from 'react';
import { DataTable } from '../../shared/DataTable/DataTable';
import { normalizeSearch } from '../../shared/normalizeSearch';
import { useTravelStore } from '../../store/useTravelStore';
import { columns } from './cities-table/columns';
import { CitiesHeader } from './CitiesView/CitiesHeader';
import { CitiesHeaderActions } from './CitiesView/CitiesHeaderActions';
import { searchAttraction } from './utils';

/*
  Porte js/views/villes/cities.js + columns.js sur DataTable. `hiddenColumns`/`toggleColumn`
  délégués au legacy (js/columns.js) : COLUMN_SETS.cities reste chargé et porte déjà
  `description: {hiddenByDefault: true}`, une seule source pour la préférence. Clé 'cities' choisie
  pour la route/le code — le libellé visible reste « Villes » (NAV_ITEMS, ce fichier).
  Édition en place (type/statut/tags), actions de ligne (ouvrir/dupliquer/supprimer, déléguées à
  openModal/duplicateAttraction/deleteItem legacy) faites. Reste : menu ⋮, tri sur type/statut
  (ordre de vocabulaire, pas encore porté).
*/
export function CitiesView() {
  const attractions = useTravelStore((store) => window.ofCurrentTravel(store.data.attractions));

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? attractions.filter((attraction) =>
        normalizeSearch(searchAttraction(attraction)).includes(wanted),
      )
    : attractions;
  const hidden = window.hiddenColumns('cities');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header">
        <CitiesHeader attractions={attractions} items={items} />
        <CitiesHeaderActions query={query} setQuery={setQuery} />
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun lieu</strong>
          Ajoute une ville, un village, un premier lieu depuis Lieux & activités.
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
