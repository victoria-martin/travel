import { MapFilterPanel } from '@/domains/carte/MapView/MapFilterPanel';
import { Icon } from '@/shared/Icon';
import { SettingsMenu } from '@/shared/toolbar/SettingsMenu';
import { useTravelStore } from '@/store/useTravelStore';
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { LeafletMap } from '../../platform/web/LeafletMap';
import { FilterButton } from './MapView/FilterButton';
import { Legend } from './MapView/Legend';
import { NewCityButton } from './MapView/NewCityButton';
import { RouteBuilderPanel } from './MapView/RouteBuilderPanel';
import { ScenarioPanel } from './MapView/ScenarioPanel';
import { SplitHandle } from './MapView/SplitHandle';
import { markerData } from './MapView/markers';

/*
  Porte js/views/map/{map,markers,leaflet-base}.js — premier découpage platform/web
  (docs/en-cours/react-migration-plan.md § 5), câblé dans src/shell/MainContent.tsx. Délégués au legacy, pas
  réimplémentés (RouteBuilderPanel, NewCityButton) : état+async dans des globales de module, drag
  HTML5 — dupliquer cette logique n'apporterait rien tant que ce mode n'est pas une priorité à part.
  Le tracé d'un scénario choisi (drawScenarioOnMap) reste aussi délégué : il dépend des
  étapes/groupes, à ne pas re-dériver avant que le détail d'un Scénario soit porté.
*/
export function MapView() {
  const accommodations = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.accommodations)),
  );
  const attractions = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.attractions)),
  );
  const villes = useTravelStore(useShallow((store) => window.ofCurrentTravel(store.data.villes)));
  const markers = markerData(accommodations, attractions, villes);
  const mapRef = useRef<any>(null);

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Carte</h2>
          <p className="view-sub">{window.ROUTE_HELP}</p>
        </div>
        {/* pas sur de cette implem mais laisson spr l instant */}
        {/* <HeaderActions>
          <FilterButton />
          <button
            type="button"
            className={`btn btn-outline btn-small ${window.routeBuilder.active ? 'active' : ''}`}
            title="Itinéraire"
            onClick={() => window.toggleRouteBuilderMode()}
          >
            <span className="toolbar-icon">
              <Icon name="compass" />
            </span>
            <span className="toolbar-label">Itinéraire</span>
          </button>
          <NewCityButton />
        </HeaderActions> */}
        <div className="view-header-actions">
          <FilterButton />
          <button
            type="button"
            className={`btn btn-outline btn-small ${window.routeBuilder.active ? 'active' : ''}`}
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
          <MapFilterPanel />
          <Legend />
        </div>
        <SplitHandle mapRef={mapRef} />
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
            mapRef.current = map;
            const scenario = window.mapFilters.scenarioId
              ? window.getScenario(window.mapFilters.scenarioId)
              : null;
            if (scenario)
              window.drawScenarioOnMap(map, scenario, 'route-notice', window.ROUTE_HELP);
            if (window.routeBuilder.active) window.drawRouteBuilderLine(map);
          }}
        />
      </div>
    </>
  );
}
