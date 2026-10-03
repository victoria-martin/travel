import { DataTable } from '@/shared/DataTable/DataTable';
import { normalizeSearch } from '@/shared/normalizeSearch';
import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/toolbar/ColumnPicker';
import type { Transport } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { columns } from './TransportsListTab/columns';

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

export function TransportsListTab() {
  const transports = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.transports)),
  );

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const filtered = wanted
    ? transports.filter((transport) => normalizeSearch(searchText(transport)).includes(wanted))
    : transports;
  const modeOrder = Object.keys(window.TRANSPORT_MODES);
  const items = [...filtered].sort((transportA, transportB) => {
    const departureDifference = `${transportA.departDate} ${transportA.departTime}`.localeCompare(
      `${transportB.departDate} ${transportB.departTime}`,
    );
    if (departureDifference) return departureDifference;
    const modeA = modeOrder.indexOf(transportA.mode);
    const modeB = modeOrder.indexOf(transportB.mode);
    return (modeA < 0 ? modeOrder.length : modeA) - (modeB < 0 ? modeOrder.length : modeB);
  });
  const hidden = window.hiddenColumns('transports');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header-actions">
        <SearchInput value={query} onChange={setQuery} />
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
