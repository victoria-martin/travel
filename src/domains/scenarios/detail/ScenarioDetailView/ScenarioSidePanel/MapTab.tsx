import { LeafletMap } from '@/platform/web/LeafletMap';
import type { Scenario } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useId } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { scenarioMapMarkers } from './MapTab/scenarioMapMarkers';

export function MapTab({ scenario }: { scenario: Scenario }) {
  const attractions = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.attractions)),
  );
  // The side panel and the mobile sheet can both hold a map, each with its own route notice.
  const noticeId = `scenario-route-notice-${useId().replace(/:/g, '')}`;
  const hasPlaces = window.visibleSteps(scenario).some((step) => window.coordsFor(step));

  if (!hasPlaces)
    return (
      <div className="scenario-map-block">
        <div className="scenario-map-empty">
          Rattache à tes étapes des lieux géolocalisés pour voir le trajet.
        </div>
      </div>
    );

  const markers = scenarioMapMarkers(attractions);
  return (
    <div className="scenario-map-block">
      <LeafletMap
        className="scenario-map-canvas"
        markers={markers}
        afterMarkers={(map) => {
          const routePoints = window.drawScenarioOnMap(map, scenario, noticeId, '');
          window.fitToPoints(map, [...routePoints, ...markers.map((marker) => marker.point)]);
        }}
      />
      <div id={noticeId} className="scenario-route-notice" />
    </div>
  );
}
