import { useState } from 'react';
import { useTravelStore } from '../../store/useTravelStore';
import { DataTable } from '../../shared/DataTable/DataTable';
import { SearchField } from '../../shared/SearchField';
import { normalizeSearch } from '../../shared/normalizeSearch';
import { ColumnPicker } from '../../shared/toolbar/ColumnPicker';
import { FavoriteCell } from '../../shared/cells/FavoriteCell';
import { LinkCell } from '../../shared/cells/LinkCell';
import { TextCell } from '../../shared/cells/TextCell';
import { VocabularyDropdown } from '../../shared/VocabularyDropdown';
import type { Column } from '../../shared/DataTable/types';
import type { Transport } from '../../store/types';
import { EndpointCell, PriceCell, ProviderCell, ScheduleCell } from './cells';

/*
  Porte seulement l'onglet « Trajets » de js/views/transports/ (TRANSPORT_TABS, tab.js) — la page
  legacy en a deux autres, Loueurs & compagnies et Voitures, pas encore portés. PAS câblé dans
  REACT_VIEWS pour l'instant : le faire maintenant ferait disparaître ces deux onglets de la page
  #transports, une vraie régression — pas juste une fonctionnalité en moins comme sur Cities/Charges
  fixes. À brancher une fois les 3 onglets prêts et un composant d'onglets (TransportsView ne porte
  que le contenu, le shell à onglets reste à construire). Valide la réutilisation de l'infra sur
  une entité plus référencée (attraction via from/to, provider) — rien de neuf à construire côté
  DataTable/SearchField/ColumnPicker/VocabularyDropdown.
*/
function searchText(transport: Transport): string {
  return [
    window.transportMode(transport.mode).label,
    window.transportEndpointLabel(transport.fromAttractionId, transport.fromPrecision),
    window.transportEndpointLabel(transport.toAttractionId, transport.toPrecision),
    window.providerName(transport.providerId),
    transport.reference,
  ]
    .filter(Boolean)
    .join(' ');
}

const columns: Column<Transport>[] = [
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
    render: (transport) => (
      <VocabularyDropdown
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
    render: (transport) => (
      <ScheduleCell date={transport.departDate} time={transport.departTime} />
    ),
  },
  {
    key: 'arrival',
    label: 'Arrive le',
    render: (transport) => (
      <ScheduleCell date={transport.arriveDate} time={transport.arriveTime} />
    ),
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
      <VocabularyDropdown
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

export function TransportsListTab() {
  const transports = useTravelStore((store) => window.ofCurrentTravel(store.data.transports));

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? transports.filter((transport) => normalizeSearch(searchText(transport)).includes(wanted))
    : transports;
  const hidden = window.hiddenColumns('transports');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header-actions">
        <SearchField value={query} onChange={setQuery} />
        <ColumnPicker kind="transports" columns={columns} />
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun transport</strong>
          Ajoute un premier trajet.
        </div>
      ) : (
        <DataTable columns={visibleColumns} items={items} />
      )}
    </>
  );
}
