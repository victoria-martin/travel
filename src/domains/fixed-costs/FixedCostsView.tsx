import { useState } from 'react';
import { useTravelStore } from '../../store/useTravelStore';
import { DataTable } from '../../shared/DataTable/DataTable';
import { SearchField } from '../../shared/SearchField';
import { normalizeSearch } from '../../shared/normalizeSearch';
import { ColumnPicker } from '../../shared/toolbar/ColumnPicker';
import { SettingsMenu } from '../../shared/toolbar/SettingsMenu';
import { EditableTagsCell } from '../../shared/cells/EditableTagsCell';
import { Icon } from '../../shared/Icon';
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
function searchText(fixedCost: FixedCost): string {
  return [fixedCost.label, ...fixedCost.categories, window.expenseRecurrence(fixedCost.recurrence).label]
    .filter(Boolean)
    .join(' ');
}

const columns: Column<FixedCost>[] = [
  {
    key: 'label',
    label: 'Libellé',
    locked: true,
    sortValue: (fixedCost) => (fixedCost.label || '').toLowerCase(),
    render: (fixedCost) => <LabelCell cost={fixedCost} />,
  },
  {
    key: 'amount',
    label: 'Montant',
    sortValue: (fixedCost) => (fixedCost.amount || '').toLowerCase(),
    render: (fixedCost) => <AmountCell cost={fixedCost} />,
  },
  {
    key: 'categories',
    label: 'Catégories',
    render: (fixedCost) => (
      <EditableTagsCell
        tags={fixedCost.categories}
        vocabulary={window.allFixedCostCategories()}
        addLabel="+ catégorie"
        onToggle={(category) => {
          const index = fixedCost.categories.indexOf(category);
          if (index === -1) fixedCost.categories.push(category);
          else fixedCost.categories.splice(index, 1);
          window.saveNow();
          window.render();
        }}
      />
    ),
  },
  {
    key: 'recurrence',
    label: 'Récurrence',
    render: (fixedCost) => <RecurrenceBadge recurrence={fixedCost.recurrence} />,
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    render: (fixedCost) => (
      <>
        <button
          type="button"
          className="icon-btn"
          title="Modifier"
          aria-label={`Modifier ${fixedCost.label}`}
          onClick={() => window.openModal('charge', fixedCost.id)}
        >
          <Icon name="pencil" />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Dupliquer"
          aria-label={`Dupliquer ${fixedCost.label}`}
          onClick={() => window.duplicateFixedCost(fixedCost.id)}
        >
          ⧉
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Supprimer"
          aria-label={`Supprimer ${fixedCost.label}`}
          onClick={() => window.deleteItem('fixedCosts', fixedCost.id)}
        >
          <Icon name="trash-2" />
        </button>
      </>
    ),
  },
];

export function FixedCostsView() {
  const fixedCosts = useTravelStore((store) => window.ofCurrentTravel(store.data.fixedCosts));

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
          <p className="view-sub">
            Péages, assurances, abonnements liés au voyage — {items.length} enregistrée
            {items.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="view-header-actions">
          <SearchField value={query} onChange={setQuery} />
          <ColumnPicker kind="charges" columns={columns} />
          <SettingsMenu />
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
