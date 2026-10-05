import { ChosenStepCell } from '@/shared/cells/ChosenStepCell';
import { EditableTagsCell } from '@/shared/cells/EditableTagsCell';
import { GoogleMapsCell } from '@/shared/cells/GoogleMapsCell';
import { LinkCell } from '@/shared/cells/LinkCell';
import { TextCell } from '@/shared/cells/TextCell';
import type { Column } from '@/shared/DataTable/types';
import { MissingAddressBadge } from '@/shared/MissingAddressBadge';
import type { Attraction } from '@/store/types';
import { ActionsCell, FavoriteCell, NameCell, StatusBadge, TypeBadge } from '../cells';

/*
  Port de js/views/attractions/columns.js. Keys match the legacy COLUMN_SETS.attractions, which
  still carries sorting and hidden-by-default (DataTable kind="attractions").
*/
export const columns: Column<Attraction>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    render: (attraction) => <FavoriteCell attraction={attraction} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    render: (attraction) => <NameCell attraction={attraction} />,
  },
  {
    key: 'chosenStep',
    label: 'Étape',
    render: (attraction) => <ChosenStepCell place={{ attractionId: attraction.id }} />,
  },
  { key: 'type', label: 'Type', render: (attraction) => <TypeBadge attraction={attraction} /> },
  {
    key: 'status',
    label: 'Statut',
    render: (attraction) => <StatusBadge attraction={attraction} />,
  },
  {
    key: 'price',
    label: 'Prix',
    render: (attraction) => <TextCell value={window.priceLabel(attraction)} />,
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
  { key: 'city', label: 'Ville', render: (attraction) => <TextCell value={attraction.city} /> },
  {
    key: 'county',
    label: 'Province',
    render: (attraction) => <TextCell value={attraction.county} />,
  },
  {
    key: 'region',
    label: 'Région',
    render: (attraction) => <TextCell value={attraction.region} />,
  },
  {
    key: 'country',
    label: 'Pays',
    render: (attraction) => <TextCell value={attraction.country} />,
  },
  {
    key: 'address',
    label: 'Adresse',
    render: (attraction) => (
      <>
        <strong>{attraction.address}</strong>
        <MissingAddressBadge address={attraction.address} />
      </>
    ),
  },
  {
    key: 'coords',
    label: 'Coordonnées',
    render: (attraction) => <>{window.coordsLabel(attraction)}</>,
  },
  {
    key: 'accommodation',
    label: 'Hébergement',
    render: (attraction) => (
      <TextCell value={window.getAccommodation(attraction.accommodationId)?.name ?? ''} />
    ),
  },
  {
    key: 'hours',
    label: 'Horaires',
    render: (attraction) => <TextCell value={attraction.hours} />,
  },
  {
    key: 'phone',
    label: 'Téléphone',
    render: (attraction) => <TextCell value={attraction.phone} />,
  },
  {
    key: 'createdAt',
    label: 'Créé le',
    render: (attraction) => <TextCell value={window.createdAtDate(attraction.createdAt)} />,
  },
  {
    key: 'updatedAt',
    label: 'Modifié le',
    render: (attraction) => <TextCell value={window.createdAtDate(attraction.updatedAt)} />,
  },
  { key: 'link', label: 'Lien', render: (attraction) => <LinkCell link={attraction.link} /> },
  {
    key: 'googleMaps',
    label: 'Google Maps',
    render: (attraction) => <GoogleMapsCell query={attraction.address || attraction.name} />,
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    render: (attraction) => <ActionsCell attraction={attraction} />,
  },
];
