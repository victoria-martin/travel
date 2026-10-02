import { FavoriteCell } from '../../../../shared/cells/FavoriteCell';
import { LinkCell } from '../../../../shared/cells/LinkCell';
import { TextCell } from '../../../../shared/cells/TextCell';
import type { Column } from '../../../../shared/DataTable/types';
import { TagDropdown } from '../../../../shared/TagDropdown';
import type { Transport } from '../../../../store/types';
import { EndpointCell, PriceCell, ProviderCell, ScheduleCell } from './cells';

export const columns: Column<Transport>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    sortValue: (transport) => (transport.favorite ? 0 : 1),
    render: (transport) => (
      <FavoriteCell
        favorite={transport.favorite}
        onToggle={() => window.toggleTransportFavorite(transport.id)}
      />
    ),
  },
  {
    key: 'mode',
    label: 'Mode',
    locked: true,
    sortValue: (transport) => {
      const modes = Object.keys(window.TRANSPORT_MODES);
      const modeIndex = modes.indexOf(transport.mode);
      return modeIndex < 0 ? modes.length : modeIndex;
    },
    render: (transport) => (
      <TagDropdown
        className="type-dropdown"
        dict={window.TRANSPORT_MODES}
        current={window.transportMode(transport.mode)}
        onPick={(mode) => window.setTransportMode(transport.id, mode)}
      />
    ),
  },
  {
    key: 'from',
    label: 'Départ',
    render: (transport) => (
      <EndpointCell placeId={transport.fromAttractionId} precision={transport.fromPrecision} />
    ),
  },
  {
    key: 'to',
    label: 'Arrivée',
    render: (transport) => (
      <EndpointCell placeId={transport.toAttractionId} precision={transport.toPrecision} />
    ),
  },
  {
    key: 'departure',
    label: 'Part le',
    sortValue: (transport) => `${transport.departDate} ${transport.departTime}`,
    render: (transport) => <ScheduleCell date={transport.departDate} time={transport.departTime} />,
  },
  {
    key: 'arrival',
    label: 'Arrive le',
    render: (transport) => <ScheduleCell date={transport.arriveDate} time={transport.arriveTime} />,
  },
  {
    key: 'provider',
    label: 'Compagnie / loueur',
    render: (transport) => <ProviderCell transport={transport} />,
  },
  { key: 'price', label: 'Prix', render: (transport) => <PriceCell transport={transport} /> },
  {
    key: 'status',
    label: 'Statut',
    render: (transport) => (
      <TagDropdown
        className="status-dropdown"
        dict={window.TRANSPORT_STATUSES}
        current={window.transportStatus(transport.status)}
        onPick={(status) => window.setTransportStatus(transport.id, status)}
      />
    ),
  },
  { key: 'link', label: 'Lien', render: (transport) => <LinkCell link={transport.link} /> },
  { key: 'notes', label: 'Notes', render: (transport) => <TextCell value={transport.notes} /> },
];
