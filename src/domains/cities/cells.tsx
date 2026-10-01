import { Icon } from '../../shared/Icon';
import { FavoriteCell as SharedFavoriteCell } from '../../shared/cells/FavoriteCell';
import { VocabularyDropdown } from '../../shared/VocabularyDropdown';
import type { Attraction } from '../../store/types';

/*
  Type et statut éditables (VocabularyDropdown, partagé avec Transports). Pas encore portés : le
  tri par vocabulaire (ordre de déclaration, pas alphabétique — CitiesView ne rend pas ces colonnes
  triables), « Ouvrir la ressource » et « ＋ Ajouter un type/statut » dans le menu (askNewWord est
  tout un flux à part), et les tags/actions (modale). Prochain lot.
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
    <VocabularyDropdown
      className="type-dropdown"
      dict={window.ATTRACTION_TYPES}
      current={window.attractionType(attraction.type)}
      onPick={(key) => window.setAttractionType(attraction.id, key)}
    />
  );
}

export function StatusBadge({ attraction }: { attraction: Attraction }) {
  return (
    <VocabularyDropdown
      className="status-dropdown"
      dict={window.ATTRACTION_STATUSES}
      current={window.attractionStatus(attraction.status)}
      onPick={(key) => window.setAttractionStatus(attraction.id, key)}
    />
  );
}
