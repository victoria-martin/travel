import { DataTable } from '@/shared/DataTable/DataTable';
import { Icon } from '@/shared/Icon';
import { normalizeSearch } from '@/shared/normalizeSearch';
import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/toolbar/ColumnPicker';
import type { Provider } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { columns } from './ProvidersTab/columns';

function providerSearchText(provider: Provider): string {
  return [
    provider.name,
    window.providerMode(provider.mode).label,
    ...provider.options.map((option) => option.label),
    ...window.providerCarModels(provider.id).map((model) => model.name),
  ]
    .filter(Boolean)
    .join(' ');
}

export function ProvidersTab() {
  const providers = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.providers)),
  );
  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const modeOrder = Object.keys(window.PROVIDER_MODES);
  const items = providers
    .filter((provider) => !wanted || normalizeSearch(providerSearchText(provider)).includes(wanted))
    .sort((providerA, providerB) => {
      const orderA = modeOrder.indexOf(providerA.mode);
      const orderB = modeOrder.indexOf(providerB.mode);
      const modeDifference =
        (orderA < 0 ? modeOrder.length : orderA) - (orderB < 0 ? modeOrder.length : orderB);
      return modeDifference || providerA.name.localeCompare(providerB.name, 'fr');
    });
  const hidden = window.hiddenColumns('prestataires');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header-actions test-red">
        <SearchInput value={query} onChange={setQuery} />
        <ColumnPicker kind="prestataires" columns={columns} />
        <button
          type="button"
          className="btn btn-small"
          title="Ajouter un prestataire"
          onClick={() => window.openModal('prestataire')}
        >
          <span className="toolbar-icon">
            <Icon name="plus" />
          </span>
          <span className="toolbar-label">Ajouter</span>
        </button>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun loueur ni compagnie</strong>
          Ajoute un premier prestataire, ou crée-le depuis un trajet.
        </div>
      ) : (
        <DataTable
          columns={visibleColumns}
          items={items}
          onRowClick={(provider) => window.openSheet('prestataire', provider.id)}
        />
      )}
    </>
  );
}
