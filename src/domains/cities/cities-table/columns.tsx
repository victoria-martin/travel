import { EditableTagsCell } from '@/shared/cells/EditableTagsCell';
import { TextCell } from '@/shared/cells/TextCell';
import type { Column } from '@/shared/DataTable/types';
import type { Attraction } from '@/store/types';
import {
  ActionsCell,
  FavoriteCell,
  NameCell,
  StatusBadge,
  TypeBadge,
} from '../../attractions/cells';

export const columns: Column<Attraction>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    render: (attraction) => <FavoriteCell attraction={attraction} />,
  },
  {
    key: 'city',
    label: 'Ville',
    locked: true,
    render: (attraction) => <TextCell value={attraction.city} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
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
    render: (attraction) => <ActionsCell attraction={attraction} />,
  },
];
