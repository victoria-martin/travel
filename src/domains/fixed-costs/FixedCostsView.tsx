import { DataTable } from '@/shared/DataTable/DataTable';
import { HeaderActions } from '@/shared/header/HeaderActions';
import { TableHeaderActions } from '@/shared/header/TableHeaderActions';
import { normalizeSearch } from '@/shared/normalizeSearch';
import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/menu/ColumnPicker';
import type { FixedCost } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { columns } from './FixedCostsView/columns';

/*
  Porte js/views/fixed-costs/{fixed-costs,header,columns}.js sur DataTable — deuxième écran après
  Villes/Cities, toute l'infra (DataTable/SearchInput/ColumnPicker) est réutilisée telle quelle.
  Clé 'charges' (view/COLUMN_SETS/prefs) inchangée, pas de renommage anglais demandé pour cet
  écran. Pas encore portés : mode cartes (listModeToggle), notes éditables, catégories éditables,
  bouton Ajouter, actions de ligne, menu ⋮ — même scope réduit que Villes/Cities.
*/
function searchText(fixedCost: FixedCost): string {
  return [
    fixedCost.label,
    ...fixedCost.categories,
    window.expenseRecurrence(fixedCost.recurrence).label,
  ]
    .filter(Boolean)
    .join(' ');
}

export function FixedCostsView() {
  const fixedCosts = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.fixedCosts)),
  );

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? fixedCosts.filter((fixedCost) => normalizeSearch(searchText(fixedCost)).includes(wanted))
    : fixedCosts;
  const hidden = window.hiddenColumns('charges');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Charges fixes</h2>
          <span className="view-sub">
            Péages, assurances, abonnements liés au voyage — {items.length} enregistrée
            {items.length > 1 ? 's' : ''}
          </span>
        </div>
        <HeaderActions />
      </div>
      <TableHeaderActions>
        <SearchInput value={query} onChange={setQuery} />
        <ColumnPicker kind="charges" columns={columns} />
      </TableHeaderActions>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucune charge</strong>
          Ajoute un péage, une assurance ou un abonnement.
        </div>
      ) : (
        <div className="table-scroll">
          <DataTable columns={visibleColumns} items={items} />
        </div>
      )}
    </>
  );
}
