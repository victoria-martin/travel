import { Icon } from '../../shared/Icon';
import { SettingsMenu } from '../../shared/toolbar/SettingsMenu';
import { LeafletMap } from '../../platform/web/LeafletMap';
import { useTravelStore } from '../../store/useTravelStore';
import { FilterButton } from './MapView/FilterButton';
import { FilterPanel } from './MapView/FilterPanel';
import { Legend } from './MapView/Legend';
import { NewCityButton } from './MapView/NewCityButton';
import { RouteBuilderPanel } from './MapView/RouteBuilderPanel';
import { ScenarioPanel } from './MapView/ScenarioPanel';
import { SplitHandle } from './MapView/SplitHandle';
import { markerData } from './MapView/markers';

/*
  Porte js/views/map/{map,markers,leaflet-base}.js — premier découpage platform/web
  (docs/react-migration-plan.md § 5). Pas encore câblé dans REACT_VIEWS : vérifié à l'écran
  d'abord (voir le lot précédent). Délégués au legacy, pas réimplémentés (RouteBuilderPanel,
  NewCityButton) : état+async dans des globales de module, drag HTML5 — dupliquer cette logique
  n'apporterait rien tant que ce mode n'est pas une priorité à part. Le tracé d'un scénario choisi
  (drawScenarioOnMap) reste aussi délégué : il dépend des étapes/groupes, à ne pas re-dériver avant
  que le détail d'un Scénario soit porté.
*/
export function MapView() {
  const accommodations = useTravelStore((store) =>
    window.ofCurrentTravel(store.data.accommodations),
  );
  const attractions = useTravelStore((store) => window.ofCurrentTravel(store.data.attractions));
  const villes = useTravelStore((store) => window.ofCurrentTravel(store.data.villes));
  const markers = markerData(accommodations, attractions, villes);

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Carte</h2>
          <p className="view-sub">{window.ROUTE_HELP}</p>
        </div>
        <div className="view-header-actions">
          <FilterButton />
          <button
            type="button"
            className={`toolbar-btn ${window.routeBuilder.active ? 'active' : ''}`}
            title="Itinéraire"
            onClick={() => window.toggleRouteBuilderMode()}
          >
            <span className="toolbar-icon">
              <Icon name="compass" />
            </span>
            <span className="toolbar-label">Itinéraire</span>
          </button>
          <NewCityButton />
          <SettingsMenu />
        </div>
      </div>
      <div className="map-layout">
        <div className="map-side" style={{ width: `${window.prefs.mapSideWidth}px` }}>
          <RouteBuilderPanel />
          <ScenarioPanel />
          <FilterPanel />
          <Legend />
        </div>
        <SplitHandle />
        <LeafletMap
          markers={markers}
          onMarkerClick={
            window.routeBuilder.active
              ? (marker) =>
                  window.addRouteBuilderPoint(
                    marker.point[0],
                    marker.point[1],
                    marker.tooltip,
                    marker.id,
                    marker.icon === 'house' ? 'accommodation' : 'attraction',
                  )
              : undefined
          }
          afterMarkers={(map) => {
            const scenario = window.mapFilters.scenarioId
              ? window.getScenario(window.mapFilters.scenarioId)
              : null;
            if (scenario) window.drawScenarioOnMap(map, scenario, 'route-notice', window.ROUTE_HELP);
            if (window.routeBuilder.active) window.drawRouteBuilderLine(map);
          }}
        />
      </div>
    </>
  );
}
