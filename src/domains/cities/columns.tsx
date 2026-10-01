import { EditableTagsCell } from '../../shared/cells/EditableTagsCell';
import { TextCell } from '../../shared/cells/TextCell';
import { Icon } from '../../shared/Icon';
import type { Column } from '../../shared/DataTable/types';
import type { Attraction } from '../../store/types';
import { FavoriteCell, NameCell, StatusBadge, TypeBadge } from './cells';

export const columns: Column<Attraction>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    sortValue: (attraction) => (attraction.favorite ? 0 : 1),
    render: (attraction) => <FavoriteCell attraction={attraction} />,
  },
  {
    key: 'city',
    label: 'Ville',
    locked: true,
    sortValue: (attraction) => (attraction.city || '').toLowerCase(),
    render: (attraction) => <TextCell value={attraction.city} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    sortValue: (attraction) => (attraction.name || '').toLowerCase(),
    render: (attraction) => <NameCell attraction={attraction} />,
  },
  { key: 'type', label: 'Type', render: (attraction) => <TypeBadge attraction={attraction} /> },
  {
    key: 'status',
    label: 'Statut',
    render: (attraction) => <StatusBadge attraction={attraction} />,
  },
  {
    key: 'tags',
    label: 'Tags',
    render: (attraction) => (
      <EditableTagsCell
        tags={attraction.tags}
        vocabulary={window.allAttractionTags()}
        addLabel="+ tag"
        onToggle={(tag) => {
          const index = attraction.tags.indexOf(tag);
          if (index === -1) attraction.tags.push(tag);
          else attraction.tags.splice(index, 1);
          window.saveNow();
          window.render();
        }}
      />
    ),
  },
  {
    key: 'description',
    label: 'Description',
    render: (attraction) => <TextCell value={attraction.description} />,
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    render: (attraction) => (
      <>
        <button
          type="button"
          className="icon-btn"
          title="Modifier"
          aria-label={`Modifier ${attraction.name}`}
          onClick={() => window.openModal('attraction', attraction.id)}
        >
          <Icon name="pencil" />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Dupliquer"
          aria-label={`Dupliquer ${attraction.name}`}
          onClick={() => window.duplicateAttraction(attraction.id)}
        >
          ⧉
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Supprimer"
          aria-label={`Supprimer ${attraction.name}`}
          onClick={() => window.deleteItem('attractions', attraction.id)}
        >
          <Icon name="trash-2" />
        </button>
      </>
    ),
  },
];
