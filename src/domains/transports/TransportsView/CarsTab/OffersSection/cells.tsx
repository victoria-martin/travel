import { Icon } from '../../../../../shared/Icon';
import { TagDropdown } from '../../../../../shared/TagDropdown';
import type { Offer } from '../../../../../store/types';

export function DefaultToggleCell({ offer }: { offer: Offer }) {
  return (
    <button
      type="button"
      className="icon-btn"
      style={{
        border: 'none',
        fontSize: 15,
        flexShrink: 0,
        color: offer.isDefault ? '#C98A3E' : 'var(--line)',
      }}
      title={offer.isDefault ? 'Ne plus être la voiture par défaut' : 'Voiture par défaut'}
      aria-label={offer.isDefault ? 'Ne plus être la voiture par défaut' : 'Voiture par défaut'}
      onClick={() => window.setDefaultOffer(offer.id)}
    >
      <Icon name={offer.isDefault ? 'circle-dot' : 'circle'} />
    </button>
  );
}

export function NotesCell({ offer }: { offer: Offer }) {
  return (
    <span
      className="editable"
      contentEditable
      suppressContentEditableWarning
      data-key={`offer:${offer.id}:notes`}
      data-placeholder="Notes…"
      onKeyDown={(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        event.currentTarget.blur();
      }}
      onBlur={(event) => window.setOfferNotes(offer.id, event.currentTarget.innerText)}
    >
      {offer.notes || ''}
    </span>
  );
}

export function ModelCell({ offer }: { offer: Offer }) {
  return (
    <>
      {window.offerModelName(offer) || '—'}
      <div className="row-notes">
        <NotesCell offer={offer} />
      </div>
    </>
  );
}

export function StatusDropdown({ offer }: { offer: Offer }) {
  return (
    <TagDropdown
      className="status-dropdown"
      dict={window.CAR_STATUSES}
      current={window.carStatus(offer.status)}
      onPick={(status) => window.setOfferStatus(offer.id, status)}
    />
  );
}

export function OptionsCell({ offer }: { offer: Offer }) {
  const options = window.offerOptions(offer);
  if (!options.length) return <>—</>;
  return (
    <>
      {options.map((option) => (
        <div className="provider-option" key={option.id}>
          {option.label}
        </div>
      ))}
    </>
  );
}

export function LinkCell({ offer }: { offer: Offer }) {
  if (!offer.link) return <>—</>;
  return (
    <a href={offer.link} target="_blank" rel="noreferrer" className="external-link">
      Voir
    </a>
  );
}

export function ActionsCell({ offer }: { offer: Offer }) {
  return (
    <>
      <button
        type="button"
        className="icon-btn"
        title="Modifier"
        aria-label={`Modifier l’offre ${window.offerModelName(offer)}`}
        onClick={() => window.openModal('voiture', offer.id)}
      >
        <Icon name="pencil" />
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Dupliquer"
        aria-label={`Dupliquer l’offre ${window.offerModelName(offer)}`}
        onClick={() => window.duplicateOffer(offer.id)}
      >
        ⧉
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Supprimer"
        aria-label={`Supprimer l’offre ${window.offerModelName(offer)}`}
        onClick={() => window.deleteItem('offers', offer.id)}
      >
        <Icon name="trash-2" />
      </button>
    </>
  );
}
