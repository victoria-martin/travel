import { Icon } from '@/shared/Icon';
import { SidePanel } from './SidePanel';

// Port de mapLegendPanel (js/views/map/legend.js).
export function Legend() {
  return (
    <SidePanel title="Légende">
      <div className="map-legend-row">
        <span className="map-type-pin">
          <Icon name="house" />
        </span>
        Hébergement
      </div>
      <div className="map-legend-row">
        <span className="map-dot-pin">
          <span />
        </span>
        Lieu &amp; activité
      </div>
      <div className="map-legend-row">
        <span className="map-type-pin">
          <Icon name="map-pin" />
        </span>
        Ville
      </div>
    </SidePanel>
  );
}
