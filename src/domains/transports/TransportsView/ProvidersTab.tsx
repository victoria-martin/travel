import { useState } from 'react';
import { DataTable } from '../../../shared/DataTable/DataTable';
import type { Column } from '../../../shared/DataTable/types';
import { Icon } from '../../../shared/Icon';
import { normalizeSearch } from '../../../shared/normalizeSearch';
import { SearchField } from '../../../shared/SearchField';
import { TagLabel } from '../../../shared/TagLabel';
import { ColumnPicker } from '../../../shared/toolbar/ColumnPicker';
import type { Provider } from '../../../store/types';
import { useTravelStore } from '../../../store/useTravelStore';

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
  const providers = useTravelStore((store) => window.ofCurrentTravel(store.data.providers));
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
  const providerColumns: Column<Provider>[] = [
    {
      key: 'logo',
      label: '',
      locked: true,
      render: (provider) =>
        provider.logo ? (
          <img className="provider-logo" src={provider.logo} alt={provider.name} />
        ) : (
          <span className="provider-logo provider-logo-empty">
            {(provider.name || '?').slice(0, 1).toUpperCase()}
          </span>
        ),
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
      render: (provider) => {
        const mode = window.providerMode(provider.mode);
        return (
          <span className="inline-tag inline-tag-static">
            <TagLabel emoji={mode.emoji} label={mode.label} />
          </span>
        );
      },
    },
    {
      key: 'options',
      label: 'Options',
      render: (provider) =>
        provider.options.length ? (
          <>
            {provider.options.map((option) => {
              const unit = window.providerOptionUnit(option.unit);
              const amount = option.amount
                ? `${option.amount} €${unit.suffix ? ` ${unit.suffix}` : ''}`
                : '';
              return (
                <div className="provider-option" key={option.id}>
                  {[option.label, amount].filter(Boolean).join(' — ')}
                </div>
              );
            })}
          </>
        ) : (
          '—'
        ),
    },
    {
      key: 'models',
      label: 'Modèles',
      render: (provider) => {
        const models = window.providerCarModels(provider.id);
        return models.length ? (
          <span className="tag-chips">
            {models.map((model) => (
              <span className="tag-chip" key={model.id}>
                {model.name}
              </span>
            ))}
          </span>
        ) : (
          '—'
        );
      },
    },
    {
      key: 'site',
      label: 'Site',
      render: (provider) =>
        provider.site ? (
          <a href={provider.site} target="_blank" rel="noreferrer" className="external-link">
            Voir
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'booking',
      label: 'Réservation',
      render: (provider) =>
        provider.bookingUrl ? (
          <a href={provider.bookingUrl} target="_blank" rel="noreferrer" className="external-link">
            Réserver
          </a>
        ) : (
          '—'
        ),
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
      render: (provider) => (
        <>
          <button
            type="button"
            className="icon-btn"
            title="Modifier"
            aria-label={`Modifier ${provider.name}`}
            onClick={() => window.openModal('prestataire', provider.id)}
          >
            <Icon name="pencil" />
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Supprimer"
            aria-label={`Supprimer ${provider.name}`}
            onClick={() => window.deleteItem('providers', provider.id)}
          >
            <Icon name="trash-2" />
          </button>
        </>
      ),
    },
  ];
  const hidden = window.hiddenColumns('prestataires');
  const visibleColumns = providerColumns.filter(
    (column) => column.locked || !hidden.includes(column.key),
  );

  return (
    <>
      <div className="view-header-actions">
        <SearchField value={query} onChange={setQuery} />
        <ColumnPicker kind="prestataires" columns={providerColumns} />
        <button
          type="button"
          className="toolbar-btn"
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