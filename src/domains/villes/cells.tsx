import { Icon } from '../../shared/Icon';
import type { Attraction } from '../../store/types';

/*
  Lecture seule pour ce lot (docs/react-migration-plan.md § 7, Phase 1) : même rendu que
  js/views/attractions/columns.js au repos, mais sans les menus déroulants (type, statut, tags) —
  ceux-là demandent le mécanisme d'inline-dropdown (js/views/inline-dropdown.js, positionnement
  viewport) et une modale pour les actions, pas encore portés. Prochain lot.
*/

export function FavoriteCell({ attraction }: { attraction: Attraction }) {
  return (
    <button
      className="icon-btn"
      style={{
        border: 'none',
        fontSize: 16,
        flexShrink: 0,
        color: attraction.favorite ? '#C98A3E' : 'var(--line)',
      }}
      onClick={() => window.toggleAttractionFavorite(attraction.id)}
      title={attraction.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Icon name="star" fill={attraction.favorite} />
    </button>
  );
}

export function NameCell({ attraction }: { attraction: Attraction }) {
  return (
    <>
      <strong>{attraction.name}</strong>
      {!attraction.address && (
        <span className="warning-badge" title="Pas d'adresse renseignée">
          <Icon name="triangle-alert" />
        </span>
      )}
    </>
  );
}

export function TextCell({ value }: { value: string }) {
  return <>{value || '—'}</>;
}

export function TypeBadge({ type }: { type: string }) {
  const current = window.attractionType(type);
  return (
    <span className="inline-tag">
      {current.emoji && <span className="inline-emoji">{current.emoji}</span>}
      <span className="inline-label">{current.label}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const current = window.attractionStatus(status);
  return (
    <span className="inline-tag">
      {current.emoji && <span className="inline-emoji">{current.emoji}</span>}
      <span className="inline-label">{current.label}</span>
    </span>
  );
}

export function TagsCell({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <span className="tag-chips">
      {tags.map((tag) => (
        <span className="tag-chip" key={tag}>
          {tag}
        </span>
      ))}
    </span>
  );
}
