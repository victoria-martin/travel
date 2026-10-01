import { Icon } from '../../shared/Icon';
import { InlineDropdown } from '../../shared/InlineDropdown';
import { TagLabel } from '../../shared/TagLabel';
import type { Attraction } from '../../store/types';

/*
  Type et statut éditables (InlineDropdown) depuis ce lot. Pas encore portés : le tri par
  vocabulaire (ordre de déclaration, pas alphabétique — CitiesView ne rend pas ces colonnes
  triables), « Ouvrir la ressource » et « ＋ Ajouter un type/statut » dans le menu (askNewWord est
  tout un flux à part), et les tags/actions (modale). Prochain lot.
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

export function TypeBadge({ attraction }: { attraction: Attraction }) {
  const current = window.attractionType(attraction.type);
  return (
    <InlineDropdown
      className="type-dropdown"
      trigger={<TagLabel emoji={current.emoji} label={current.label} />}
    >
      {Object.entries(window.ATTRACTION_TYPES).map(([key, t]) => (
        <button
          key={key}
          type="button"
          className={`inline-menu-item ${t === current ? 'selected' : ''}`}
          onClick={() => window.setAttractionType(attraction.id, key)}
        >
          <TagLabel emoji={t.emoji} label={t.label} />
        </button>
      ))}
    </InlineDropdown>
  );
}

export function StatusBadge({ attraction }: { attraction: Attraction }) {
  const current = window.attractionStatus(attraction.status);
  return (
    <InlineDropdown
      className="status-dropdown"
      trigger={<TagLabel emoji={current.emoji} label={current.label} />}
    >
      {Object.entries(window.ATTRACTION_STATUSES).map(([key, s]) => (
        <button
          key={key}
          type="button"
          className={`inline-menu-item ${s === current ? 'selected' : ''}`}
          onClick={() => window.setAttractionStatus(attraction.id, key)}
        >
          <TagLabel emoji={s.emoji} label={s.label} />
        </button>
      ))}
    </InlineDropdown>
  );
}
