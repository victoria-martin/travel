import { ChosenStepCell } from '@/shared/cells/ChosenStepCell';
import { EditableTagsCell } from '@/shared/cells/EditableTagsCell';
import { EditableTextCell } from '@/shared/cells/EditableTextCell';
import { GoogleMapsCell } from '@/shared/cells/GoogleMapsCell';
import { LinkCell } from '@/shared/cells/LinkCell';
import { TextCell } from '@/shared/cells/TextCell';
import type { Column } from '@/shared/DataTable/types';
import { MissingAddressBadge } from '@/shared/MissingAddressBadge';
import type { Accommodation } from '@/store/types';
import { ActionsCell, FavoriteCell, NameCell, PriceCell, StatusBadge, TypeBadge } from '../cells';

// Both dates come from an <input type="date">, hence ISO: the cell makes them readable.
function availabilityDate(iso: string): string {
  const date = window.isoToDate(iso);
  return date ? window.formatStepDay(date) : '';
}

/*
  Port de js/views/accommodations/table/columns.js. Keys match the legacy COLUMN_SETS.hebergements,
  which still carries sorting, filtering and hidden-by-default (DataTable kind="hebergements").
*/
export const columns: Column<Accommodation>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    render: (accommodation) => <FavoriteCell accommodation={accommodation} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    render: (accommodation) => <NameCell accommodation={accommodation} />,
  },
  {
    key: 'chosenStep',
    label: 'Étape',
    render: (accommodation) => <ChosenStepCell place={{ accommodationId: accommodation.id }} />,
  },
  {
    key: 'type',
    label: 'Type',
    render: (accommodation) => <TypeBadge accommodation={accommodation} />,
  },
  {
    key: 'status',
    label: 'Statut',
    render: (accommodation) => <StatusBadge accommodation={accommodation} />,
  },
  {
    key: 'city',
    label: 'Ville',
    render: (accommodation) => <TextCell value={accommodation.city} />,
  },
  {
    key: 'county',
    label: 'Province',
    render: (accommodation) => <TextCell value={accommodation.county} />,
  },
  {
    key: 'region',
    label: 'Région',
    render: (accommodation) => <TextCell value={accommodation.region} />,
  },
  {
    key: 'country',
    label: 'Pays',
    render: (accommodation) => <TextCell value={accommodation.country} />,
  },
  {
    key: 'tags',
    label: 'Tags',
    render: (accommodation) => (
      <EditableTagsCell
        tags={accommodation.tags}
        vocabulary={window.allAccommodationTags()}
        addLabel="+ tag"
        onToggle={(tag) => {
          const index = accommodation.tags.indexOf(tag);
          if (index === -1) accommodation.tags.push(tag);
          else accommodation.tags.splice(index, 1);
          window.saveNow();
          window.render();
        }}
      />
    ),
  },
  {
    key: 'address',
    label: 'Adresse',
    render: (accommodation) => (
      <>
        <strong>{accommodation.address}</strong>
        <MissingAddressBadge address={accommodation.address} />
      </>
    ),
  },
  {
    key: 'price',
    label: 'Prix',
    render: (accommodation) => <PriceCell accommodation={accommodation} />,
  },
  {
    key: 'dates',
    label: 'Dates',
    render: (accommodation) => <TextCell value={accommodation.dates} />,
  },
  {
    key: 'availableFrom',
    label: 'Disponible du',
    render: (accommodation) => <TextCell value={availabilityDate(accommodation.availableFrom)} />,
  },
  {
    key: 'availableTo',
    label: 'Disponible au',
    render: (accommodation) => <TextCell value={availabilityDate(accommodation.availableTo)} />,
  },
  {
    key: 'notes',
    label: 'Notes',
    render: (accommodation) => (
      <EditableTextCell
        value={accommodation.notes}
        placeholder="Notes…"
        onSave={(notes) => {
          accommodation.notes = notes;
          window.saveNow();
        }}
      />
    ),
  },
  {
    key: 'createdAt',
    label: 'Créé le',
    render: (accommodation) => <TextCell value={window.createdAtDate(accommodation.createdAt)} />,
  },
  {
    key: 'updatedAt',
    label: 'Modifié le',
    render: (accommodation) => <TextCell value={window.createdAtDate(accommodation.updatedAt)} />,
  },
  {
    key: 'link',
    label: 'Lien',
    render: (accommodation) => <LinkCell link={accommodation.link} />,
  },
  {
    key: 'bookingLink',
    label: 'Booking',
    render: (accommodation) => <LinkCell link={accommodation.bookingLink} label="Booking" />,
  },
  {
    key: 'googleMaps',
    label: 'Google Maps',
    render: (accommodation) => (
      <GoogleMapsCell query={accommodation.address || accommodation.name} />
    ),
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    render: (accommodation) => <ActionsCell accommodation={accommodation} />,
  },
];
