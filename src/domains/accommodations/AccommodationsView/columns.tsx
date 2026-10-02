import { EditableTagsCell } from '../../../shared/cells/EditableTagsCell';
import { LinkCell } from '../../../shared/cells/LinkCell';
import { TextCell } from '../../../shared/cells/TextCell';
import type { Column } from '../../../shared/DataTable/types';
import type { Accommodation } from '../../../store/types';
import { ActionsCell, FavoriteCell, NameCell, PriceCell, StatusBadge, TypeBadge } from '../cells';

// Port de availabilityDate (js/views/accommodations/table/columns.js) : les deux dates viennent
// d'un <input type="date">, donc en ISO — la cellule les rend lisibles.
function availabilityDate(iso: string): string {
  const date = window.isoToDate(iso);
  return date ? window.formatStepDay(date) : '';
}

/*
  Port de js/views/accommodations/table/columns.js, scope réduit comme Attractions/Cities/Charges
  fixes/Transports : reste à porter — chosenStep (dérivation scénario), region/country/address,
  notes en colonne à part (déjà éditable sous le nom), Google Maps, favoris seuls, mode cartes,
  panneau de filtres, bouton Importer, menu d'ajout, tri sur vocabulaire.
*/
export const columns: Column<Accommodation>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    sortValue: (accommodation) => (accommodation.favorite ? 0 : 1),
    render: (accommodation) => <FavoriteCell accommodation={accommodation} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    sortValue: (accommodation) => (accommodation.name || '').toLowerCase(),
    render: (accommodation) => <NameCell accommodation={accommodation} />,
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
    sortValue: (accommodation) => (accommodation.city || '').toLowerCase(),
    render: (accommodation) => <TextCell value={accommodation.city} />,
  },
  {
    key: 'county',
    label: 'Province',
    sortValue: (accommodation) => (accommodation.county || '').toLowerCase(),
    render: (accommodation) => <TextCell value={accommodation.county} />,
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
    sortValue: (accommodation) => accommodation.availableFrom || '',
    render: (accommodation) => <TextCell value={availabilityDate(accommodation.availableFrom)} />,
  },
  {
    key: 'availableTo',
    label: 'Disponible au',
    sortValue: (accommodation) => accommodation.availableTo || '',
    render: (accommodation) => <TextCell value={availabilityDate(accommodation.availableTo)} />,
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
    key: 'actions',
    label: '',
    locked: true,
    render: (accommodation) => <ActionsCell accommodation={accommodation} />,
  },
];
