import { useRef } from 'react';
import { useLeafletMap } from './LeafletMap/useLeafletMap';

export interface MapMarkerData {
  id: string;
  point: [number, number];
  icon: 'house' | 'dot';
  tooltip: string;
  popupHtml: string;
  favorite: boolean;
}

/*
  Port de leaflet-base.js + markers.js (addMapPinMarker) — frontière RN (docs/react-migration-plan.md
  § 5) : ce fichier est le seul de l'app à toucher `L` (Leaflet, global chargé par CDN dans
  index.html). Les hooks/domaines qui l'appellent ne lui donnent que des données (points, icônes,
  popups en HTML), jamais un objet Leaflet. Pas encore porté : clic sur un marqueur pendant le mode
  "itinéraire" (routeBuilder), actions de popup liées à un scénario (dropdowns d'étape) — popup en
  contenu statique pour ce lot.
*/
export function LeafletMap({ markers }: { markers: MapMarkerData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLeafletMap(containerRef, markers);

  // id fixe pour l'instant (`#map` : même CSS que la carte legacy) — à généraliser (prop `id`) le
  // jour où un deuxième consommateur (ex. carte du détail scénario) coexiste sur la même page.
  return <div id="map" ref={containerRef} />;
}
