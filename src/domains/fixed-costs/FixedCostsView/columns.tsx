import { EditableTagsCell } from '@/shared/cells/EditableTagsCell';
import type { Column } from '@/shared/DataTable/types';
import { Icon } from '@/shared/Icon';
import type { FixedCost } from '@/store/types';
import { AmountCell, LabelCell, RecurrenceBadge } from '../cells';

export const columns: Column<FixedCost>[] = [
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
