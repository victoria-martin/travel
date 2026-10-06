import { Icon } from '@/shared/Icon';
import { SwitchField } from '@/shared/form-fields/SwitchField';
import { MapFilterLevels } from './FilterFields/MapFilterLevels';
import { MAP_KINDS } from './mapKinds';

// Shared by MapFilterPanel (side column) and FilterMenu (header menu): same fields, two places.
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
          {window.mapFilters.shown[kind.key] && (
            <MapFilterLevels scope={window.mapScope(kind.key)} />
          )}
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
