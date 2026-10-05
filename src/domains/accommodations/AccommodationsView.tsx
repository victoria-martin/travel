import { AddResourceButton } from '@/shared/buttons/AddResourceButton';
import { DataTable } from '@/shared/DataTable/DataTable';
import { HeaderActions } from '@/shared/header/HeaderActions';
import { TableHeaderActions } from '@/shared/header/TableHeaderActions';
import { normalizeSearch } from '@/shared/normalizeSearch';
import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/menu/ColumnPicker';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { columns } from './AccommodationsView/columns';
import { searchAccommodation } from './searchAccommodation';

/*
  Porte js/views/accommodations.js + table/columns.js sur DataTable, même scope réduit que
  Attractions/Cities/Charges fixes/Transports : tri/recherche/colonnes masquables/édition en place
  faits, ligne → fiche (openSheet, comme Attractions/Cities). Restent, pas bloquants : favoris
  seuls, mode cartes, panneau de filtres, bouton Importer, menu d'ajout à 5 portes (Booking/
  HomeExchange/Airbnb/Google Maps/à la main — un seul bouton « Ajouter » ouvre la saisie manuelle
  pour l'instant), menu ⋮.
*/
export function AccommodationsView() {
  const accommodations = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.accommodations)),
  );

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? accommodations.filter((accommodation) =>
        normalizeSearch(searchAccommodation(accommodation)).includes(wanted),
      )
    : accommodations;
  const hidden = window.hiddenColumns('hebergements');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Hébergements</h2>
          <span className="view-sub">
            {items.length} enregistré{items.length > 1 ? 's' : ''}
          </span>
        </div>
        <HeaderActions />
      </div>
      <TableHeaderActions>
        <SearchInput value={query} onChange={setQuery} />
        <ColumnPicker kind="hebergements" columns={columns} />
        <AddResourceButton
          title="Ajouter un hébergement"
          onClick={() => window.openModal('accommodation')}
          label="Ajouter"
        />
      </TableHeaderActions>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun hébergement</strong>
          Ajoute tes premiers hébergements pour pouvoir les rattacher à tes étapes.
        </div>
      ) : (
        <div className="table-scroll">
          <DataTable
            columns={visibleColumns}
            items={items}
            onRowClick={(accommodation) => window.openSheet('accommodation', accommodation.id)}
          />
        </div>
      )}
    </>
  );
}
