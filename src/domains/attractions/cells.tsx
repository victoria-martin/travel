import { FavoriteCell as SharedFavoriteCell } from '@/shared/cells/FavoriteCell';
import { Icon } from '@/shared/Icon';
import { AddWordMenuItem } from '@/shared/select/AddWordMenuItem';
import { TagDropdown } from '@/shared/select/TagDropdown';
import type { Attraction } from '@/store/types';

/*
  Cellules de l'entité Attraction — deux consommateurs, Cities (villes-table/columns.tsx) et
  AttractionsView, mêmes rendus (CLAUDE.md, journal 2026-09-20). Pas encore portés : le tri sur
  type/statut (ordre de vocabulaire, pas alphabétique) et « Ouvrir la ressource » dans le menu.
*/

export function FavoriteCell({ attraction }: { attraction: Attraction }) {
  return (
    <SharedFavoriteCell
      favorite={attraction.favorite}
      onToggle={() => window.toggleAttractionFavorite(attraction.id)}
    />
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
  return (
    <TagDropdown
      className="type-dropdown"
      dict={window.ATTRACTION_TYPES}
      current={window.attractionType(attraction.type)}
      afterItems={
        <AddWordMenuItem
          bank="attractionTypes"
          label="Ajouter un type"
          onCreate={(key) => window.setAttractionType(attraction.id, key)}
        />
      }
      onPick={(key) => window.setAttractionType(attraction.id, key)}
    />
  );
}

export function StatusBadge({ attraction }: { attraction: Attraction }) {
  return (
    <TagDropdown
      className="status-dropdown"
      dict={window.ATTRACTION_STATUSES}
      current={window.attractionStatus(attraction.status)}
      afterItems={
        <AddWordMenuItem
          bank="attractionStatuses"
          label="Ajouter un statut"
          onCreate={(key) => window.setAttractionStatus(attraction.id, key)}
        />
      }
      onPick={(key) => window.setAttractionStatus(attraction.id, key)}
    />
  );
}

export function ActionsCell({ attraction }: { attraction: Attraction }) {
  return (
    <>
      <button
        type="button"
        className="icon-btn"
        title="Modifier"
        aria-label={`Modifier ${attraction.name}`}
        onClick={() => window.openModal('attraction', attraction.id)}
      >
        <Icon name="pencil" />
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Dupliquer"
        aria-label={`Dupliquer ${attraction.name}`}
        onClick={() => window.duplicateAttraction(attraction.id)}
      >
        ⧉
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Supprimer"
        aria-label={`Supprimer ${attraction.name}`}
        onClick={() => window.deleteItem('attractions', attraction.id)}
      >
        <Icon name="trash-2" />
      </button>
    </>
  );
}
