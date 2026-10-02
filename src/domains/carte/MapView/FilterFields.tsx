import { Icon } from '../../../shared/Icon';
import { SwitchField } from '../../../shared/SwitchField';
import { MAP_KINDS } from './mapKinds';

/*
  Port partiel de filter-panel.js (mapFilterFields) : les interrupteurs show/hide + favoris
  uniquement. Pas encore porté : filterLevelsBlock (filtre par valeur de colonne, dans chaque
  collection affichée) — un mécanisme à part, pas encore construit côté React, aucun autre écran
  migré n'en a eu besoin jusqu'ici. Partagé par FilterPanel (colonne fixe) et FilterButton (menu
  d'en-tête) — mêmes champs, deux emplacements, comme en legacy.
*/
// TODO; rename to MapFilters et creer un FilterFields generique si besoin
export function FilterFields() {
  return (
    <>
      {MAP_KINDS.map((kind) => (
        <div className="map-filter-block" key={kind.key}>
          <SwitchField
            label={
              <>
                <span className="map-resource-icon">
                  <Icon name={kind.icon} />
                </span>
                <span className="map-resource-label">{kind.label}</span>
              </>
            }
            checked={window.mapFilters.shown[kind.key]}
            onChange={() => window.toggleMapKind(kind.key)}
          />
        </div>
      ))}
      <div className="map-filter-block map-filter-favorites">
        <SwitchField
          icon="star"
          iconFill
          label="Favoris uniquement"
          checked={window.mapFilters.favOnly}
          onChange={() => window.toggleMapFavOnly()}
        />
      </div>
    </>
  );
}
