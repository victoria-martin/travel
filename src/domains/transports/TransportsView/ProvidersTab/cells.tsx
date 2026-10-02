import { Icon } from '../../../../shared/Icon';
import { TagLabel } from '../../../../shared/TagLabel';
import type { Provider } from '../../../../store/types';

export function LogoCell({ provider }: { provider: Provider }) {
  return provider.logo ? (
    <img className="provider-logo" src={provider.logo} alt={provider.name} />
  ) : (
    <span className="provider-logo provider-logo-empty">
      {(provider.name || '?').slice(0, 1).toUpperCase()}
    </span>
  );
}

export function ModeBadge({ provider }: { provider: Provider }) {
  const mode = window.providerMode(provider.mode);
  return (
    <span className="inline-tag inline-tag-static">
      <TagLabel emoji={mode.emoji} label={mode.label} />
    </span>
  );
}

export function OptionsCell({ provider }: { provider: Provider }) {
  if (!provider.options.length) return <>—</>;
  return (
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
  );
}

export function ModelsCell({ provider }: { provider: Provider }) {
  const models = window.providerCarModels(provider.id);
  if (!models.length) return <>—</>;
  return (
    <span className="tag-chips">
      {models.map((model) => (
        <span className="tag-chip" key={model.id}>
          {model.name}
        </span>
      ))}
    </span>
  );
}

export function SiteLinkCell({ provider }: { provider: Provider }) {
  if (!provider.site) return <>—</>;
  return (
    <a href={provider.site} target="_blank" rel="noreferrer" className="external-link">
      Voir
    </a>
  );
}

export function BookingLinkCell({ provider }: { provider: Provider }) {
  if (!provider.bookingUrl) return <>—</>;
  return (
    <a href={provider.bookingUrl} target="_blank" rel="noreferrer" className="external-link">
      Réserver
    </a>
  );
}

export function ActionsCell({ provider }: { provider: Provider }) {
  return (
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
  );
}
