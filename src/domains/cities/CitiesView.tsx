import { HeaderActions } from '@/shared/header/HeaderActions';
import { DataTable } from '@/shared/DataTable/DataTable';
import { normalizeSearch } from '@/shared/normalizeSearch';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { searchAttraction } from '../attractions/searchAttraction';
import { columns } from './cities-table/columns';
import { CitiesHeader } from './CitiesView/CitiesHeader';
import { CitiesHeaderActions } from './CitiesView/CitiesHeaderActions';

/*
  Porte js/views/villes/cities.js + columns.js sur DataTable. `hiddenColumns`/`toggleColumn`
  délégués au legacy (js/columns.js) : COLUMN_SETS.cities reste chargé et porte déjà
  `description: {hiddenByDefault: true}`, une seule source pour la préférence. Clé 'cities' choisie
  pour la route/le code — le libellé visible reste « Villes » (NAV_ITEMS, ce fichier).
  Édition en place (type/statut/tags), actions de ligne (ouvrir/dupliquer/supprimer, déléguées à
  openModal/duplicateAttraction/deleteItem legacy) faites. Tri délégué au legacy
  (DataTable kind="cities") : ville puis nom par défaut, ordre de vocabulaire sur type/statut.
*/
export function CitiesView() {
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
  const hidden = window.hiddenColumns('cities');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header">
        <CitiesHeader attractions={attractions} items={items} />
        <HeaderActions />
      </div>
      <CitiesHeaderActions query={query} setQuery={setQuery} />
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun lieu</strong>
          Ajoute une ville, un village, un premier lieu depuis Lieux & activités.
        </div>
      ) : (
        <div className="table-scroll">
          <DataTable
            kind="cities"
            columns={visibleColumns}
            items={items}
            onRowClick={(attraction) => window.openAttractionSheet(attraction.id)}
          />
        </div>
      )}
    </>
  );
}
