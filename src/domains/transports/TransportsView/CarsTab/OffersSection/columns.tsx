import type { Column } from '../../../../../shared/DataTable/types';
import type { CarModel, Offer } from '../../../../../store/types';
import { FuelDropdown, GearboxDropdown } from '../cells';
import { ActionsCell, DefaultToggleCell, LinkCell, ModelCell, OptionsCell, StatusDropdown } from './cells';

// Prend `carModels` en argument (pas un const à plat) : le fabricant/la boîte d'une offre
// dépendent du modèle qu'elle référence, pas de l'offre seule.
export function offerColumns(carModels: CarModel[]): Column<Offer>[] {
  return [
    {
      key: 'default',
      label: '',
      locked: true,
      render: (offer) => <DefaultToggleCell offer={offer} />,
    },
    {
      key: 'model',
      label: 'Modèle',
      locked: true,
      sortValue: (offer) => window.offerModelName(offer).toLocaleLowerCase('fr'),
      render: (offer) => <ModelCell offer={offer} />,
    },
    {
      key: 'provider',
      label: 'Loueur',
      sortValue: (offer) => window.providerName(offer.providerId).toLocaleLowerCase('fr'),
      render: (offer) => window.providerName(offer.providerId) || '—',
    },
    {
      key: 'place',
      label: 'Lieu',
      sortValue: (offer) => offer.location.toLocaleLowerCase('fr'),
      render: (offer) => offer.location || '—',
    },
    {
      key: 'dates',
      label: 'Dates',
      sortValue: (offer) => offer.pickupDate || '9999',
      render: (offer) => window.offerDatesLabel(offer).join(' · ') || '—',
    },
    {
      key: 'fuel',
      label: 'Motorisation',
      render: (offer) => (
        <FuelDropdown model={carModels.find((candidate) => candidate.id === offer.modelId)} />
      ),
    },
    {
      key: 'gearbox',
      label: 'Boîte',
      render: (offer) => (
        <GearboxDropdown model={carModels.find((candidate) => candidate.id === offer.modelId)} />
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (offer) => <StatusDropdown offer={offer} />,
    },
    {
      key: 'price',
      label: 'Prix',
      sortValue: (offer) => window.offerDayPrice(offer),
      render: (offer) => window.offerDayPriceLabel(offer),
    },
    {
      key: 'options',
      label: 'Options',
      render: (offer) => <OptionsCell offer={offer} />,
    },
    {
      key: 'link',
      label: 'Lien',
      render: (offer) => <LinkCell offer={offer} />,
    },
    {
      key: 'actions',
      label: '',
      locked: true,
      render: (offer) => <ActionsCell offer={offer} />,
    },
  ];
}
