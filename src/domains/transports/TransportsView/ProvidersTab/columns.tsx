import type { Column } from '@/shared/DataTable/types';
import type { Provider } from '@/store/types';
import {
  ActionsCell,
  BookingLinkCell,
  LogoCell,
  ModeBadge,
  ModelsCell,
  OptionsCell,
  SiteLinkCell,
} from './cells';

export const columns: Column<Provider>[] = [
  {
    key: 'logo',
    label: '',
    locked: true,
    render: (provider) => <LogoCell provider={provider} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    sortValue: (provider) => provider.name.toLocaleLowerCase('fr'),
    render: (provider) => provider.name,
  },
  {
    key: 'mode',
    label: 'Mode',
    sortValue: (provider) => window.providerModeKey(provider.mode),
    render: (provider) => <ModeBadge provider={provider} />,
  },
  {
    key: 'options',
    label: 'Options',
    render: (provider) => <OptionsCell provider={provider} />,
  },
  {
    key: 'models',
    label: 'Modèles',
    render: (provider) => <ModelsCell provider={provider} />,
  },
  {
    key: 'site',
    label: 'Site',
    render: (provider) => <SiteLinkCell provider={provider} />,
  },
  {
    key: 'booking',
    label: 'Réservation',
    render: (provider) => <BookingLinkCell provider={provider} />,
  },
  {
    key: 'notes',
    label: 'Notes',
    render: (provider) => provider.notes || '—',
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    render: (provider) => <ActionsCell provider={provider} />,
  },
];
