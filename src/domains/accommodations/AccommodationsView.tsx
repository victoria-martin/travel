import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { DataTable } from '@/shared/DataTable/DataTable';
import { HeaderActions } from '@/shared/header/HeaderActions';
import { TableHeaderActions } from '@/shared/header/TableHeaderActions';
import { ColumnPicker } from '@/shared/menu/ColumnPicker';
import { ListFilterMenu } from '@/shared/menu/ListFilterMenu';
import { SortMenu } from '@/shared/menu/SortMenu';
import { normalizeSearch } from '@/shared/normalizeSearch';
import { SearchInput } from '@/shared/SearchInput';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AccommodationAddMenu } from './AccommodationsView/AccommodationAddMenu';
import { AccommodationCard } from './AccommodationsView/AccommodationCard';
import { columns } from './AccommodationsView/columns';
import { ListModeToggle } from '@/shared/toolbar/ListModeToggle';
import { searchAccommodation } from './searchAccommodation';

const KIND = 'hebergements';

// Porte js/views/accommodations.js, header.js, table/columns.js et cards/.
export function AccommodationsView() {
  const accommodations = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.accommodations)),
  );
  const [query, setQuery] = useState('');
  const mode = window.listViewMode[KIND];
  const wanted = normalizeSearch(query);
  const items = accommodations
    .filter((accommodation) => !window.favOnly || accommodation.favorite)
    .filter((accommodation) => window.keptByFilters(KIND, accommodation))
    .filter(
      (accommodation) =>
        !wanted || normalizeSearch(searchAccommodation(accommodation)).includes(wanted),
    );
  const hidden = window.hiddenColumns(KIND);
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));
  const types = Object.values(window.ACCOMMODATION_TYPES)
    .map((type) => type.label)
    .join(' · ');

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Hébergements</h2>
          <span className="view-sub">
            {types} — {items.length} enregistré{items.length > 1 ? 's' : ''}
          </span>
        </div>
        <HeaderActions />
      </div>
      <TableHeaderActions>
        <SearchInput value={query} onChange={setQuery} />
        {mode === 'table' && <SortMenu kind={KIND} />}
        <ListFilterMenu kind={KIND} />
        {mode === 'table' && <ColumnPicker kind={KIND} columns={columns} />}
        <span className="toolbar-separator" />
        <ToolbarButton
          icon="star"
          label="Favoris"
          className={window.favOnly ? 'active' : ''}
          onClick={() => window.toggleFavOnly()}
        />
        <ListModeToggle kind={KIND} />
        <span className="toolbar-separator" />
        {!window.syncActive() && (
          <ToolbarButton
            icon="clipboard-list"
            label="Importer"
            onClick={() => window.openModal('paste-import')}
          />
        )}
        <AccommodationAddMenu />
      </TableHeaderActions>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun hébergement</strong>
          Ajoute tes premiers hébergements pour pouvoir les rattacher à tes étapes.
        </div>
      ) : mode === 'card' ? (
        <div className="card-grid">
          {window.sortItems(KIND, items).map((accommodation) => (
            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
          ))}
        </div>
      ) : (
        <div className="table-scroll">
          <DataTable
            kind={KIND}
            columns={visibleColumns}
            items={items}
            onRowClick={(accommodation) => window.openSheet('accommodation', accommodation.id)}
          />
        </div>
      )}
    </>
  );
}
