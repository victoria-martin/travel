import type { Column } from '../../../../../shared/DataTable/types';
import type { CarModel } from '../../../../../store/types';
import { FuelDropdown, GearboxDropdown } from '../cells';
import { ActionsCell, ConsumptionCell, OffersCell, ProvidersCell } from './cells';

export const columns: Column<CarModel>[] = [
  {
    key: 'name',
    label: 'Modèle',
    locked: true,
    sortValue: (model) => model.name.toLocaleLowerCase('fr'),
    render: (model) => model.name,
  },
  {
    key: 'fuel',
    label: 'Motorisation',
    sortValue: (model) => model.fuel,
    render: (model) => <FuelDropdown model={model} />,
  },
  {
    key: 'gearbox',
    label: 'Boîte',
    sortValue: (model) => model.gearbox,
    render: (model) => <GearboxDropdown model={model} />,
  },
  {
    key: 'consumption',
    label: 'Conso',
    sortValue: (model) => window.priceNumber(model.consumption),
    render: (model) => <ConsumptionCell model={model} />,
  },
  {
    key: 'providers',
    label: 'Loueurs',
    sortValue: (model) => window.carModelProviders(model.id).length,
    render: (model) => <ProvidersCell model={model} />,
  },
  {
    key: 'offers',
    label: 'Offres',
    sortValue: (model) => window.carModelOffers(model.id).length,
    render: (model) => <OffersCell model={model} />,
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    render: (model) => <ActionsCell model={model} />,
  },
];
