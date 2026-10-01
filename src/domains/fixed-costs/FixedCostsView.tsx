import { useState } from 'react';
import { useTravelStore } from '../../store/useTravelStore';
import { DataTable } from '../../shared/DataTable/DataTable';
import { SearchField } from '../../shared/SearchField';
import { normalizeSearch } from '../../shared/normalizeSearch';
import { ColumnPicker } from '../../shared/toolbar/ColumnPicker';
import { TagsCell } from '../../shared/cells/TagsCell';
import type { Column } from '../../shared/DataTable/types';
import type { FixedCost } from '../../store/types';
import { AmountCell, LabelCell, RecurrenceBadge } from './cells';

/*
  Porte js/views/fixed-costs/{fixed-costs,header,columns}.js sur DataTable — deuxième écran après
  Villes/Cities, toute l'infra (DataTable/SearchField/ColumnPicker) est réutilisée telle quelle.
  Clé 'charges' (view/COLUMN_SETS/prefs) inchangée, pas de renommage anglais demandé pour cet
  écran. Pas encore portés : mode cartes (listModeToggle), notes éditables, catégories éditables,
  bouton Ajouter, actions de ligne, menu ⋮ — même scope réduit que Villes/Cities.
*/
function searchText(c: FixedCost): string {
  return [c.label, ...c.categories, window.expenseRecurrence(c.recurrence).label]
    .filter(Boolean)
    .join(' ');
}

const columns: Column<FixedCost>[] = [
  {
    key: 'label',
    label: 'Libellé',
    locked: true,
    sortValue: (c) => (c.label || '').toLowerCase(),
    render: (c) => <LabelCell cost={c} />,
  },
  {
    key: 'amount',
    label: 'Montant',
    sortValue: (c) => (c.amount || '').toLowerCase(),
    render: (c) => <AmountCell cost={c} />,
  },
  {
    key: 'categories',
    label: 'Catégories',
    render: (c) => <TagsCell tags={c.categories} />,
  },
  {
    key: 'recurrence',
    label: 'Récurrence',
    render: (c) => <RecurrenceBadge recurrence={c.recurrence} />,
  },
];

export function FixedCostsView() {
  const fixedCosts = useTravelStore((s) => window.ofCurrentTravel(s.data.fixedCosts));

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? fixedCosts.filter((c) => normalizeSearch(searchText(c)).includes(wanted))
    : fixedCosts;
  const hidden = window.hiddenColumns('charges');
  const visibleColumns = columns.filter((c) => c.locked || !hidden.includes(c.key));

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Charges fixes</h2>
          <p className="view-sub">
            Péages, assurances, abonnements liés au voyage — {items.length} enregistrée
            {items.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="view-header-actions">
          <SearchField value={query} onChange={setQuery} />
          <ColumnPicker kind="charges" columns={columns} />
        </div>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucune charge</strong>
          Ajoute un péage, une assurance ou un abonnement.
        </div>
      ) : (
        <DataTable columns={visibleColumns} items={items} />
      )}
    </>
  );
}
