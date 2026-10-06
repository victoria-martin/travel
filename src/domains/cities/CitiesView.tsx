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
  Column visibility and sort come from COLUMN_SETS.cities (js/views/villes/columns.js), the single
  source for prefs.hiddenColumns and prefs.sort.
  The 'cities' key names the route and the code; the visible label stays « Villes ».
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
