import { EditableTagsCell } from '@/shared/cells/EditableTagsCell';
import { LinkCell } from '@/shared/cells/LinkCell';
import { TextCell } from '@/shared/cells/TextCell';
import type { Column } from '@/shared/DataTable/types';
import type { Attraction } from '@/store/types';
import { ActionsCell, FavoriteCell, NameCell, StatusBadge, TypeBadge } from '../cells';

/*
  Port de js/views/attractions/columns.js, scope réduit comme Cities/Charges fixes/Transports :
  reste à porter — chosenStep (dérivation scénario), prix, region/country/address/coords/
  accommodation/hours/phone, Google Maps, et le tri sur vocabulaire (ordre de déclaration).
*/
export const columns: Column<Attraction>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    sortValue: (attraction) => (attraction.favorite ? 0 : 1),
    render: (attraction) => <FavoriteCell attraction={attraction} />,
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
    key: 'city',
    label: 'Ville',
    sortValue: (attraction) => (attraction.city || '').toLowerCase(),
    render: (attraction) => <TextCell value={attraction.city} />,
  },
  {
    key: 'county',
    label: 'Province',
    sortValue: (attraction) => (attraction.county || '').toLowerCase(),
    render: (attraction) => <TextCell value={attraction.county} />,
  },
  {
    key: 'link',
    label: 'Lien',
    render: (attraction) => <LinkCell link={attraction.link} />,
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    render: (attraction) => <ActionsCell attraction={attraction} />,
  },
];
