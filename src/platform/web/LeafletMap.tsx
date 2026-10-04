import { useRef } from 'react';
import { useLeafletMap } from './LeafletMap/useLeafletMap';
import type { MapMarkerData } from './LeafletMap/MapMarkerData';

/*
  Port de leaflet-base.js + markers.js (addMapPinMarker) — frontière RN (docs/en-cours/react-migration-plan.md
  § 5) : ce fichier est le seul de l'app à toucher `L` (Leaflet, global chargé par CDN dans
  index.html). Les hooks/domaines qui l'appellent ne lui donnent que des données (points, icônes,
  popups en HTML) et des callbacks, jamais un objet Leaflet — `afterMarkers` est l'exception
  assumée : il donne l'instance Leaflet brute à l'appelant pour un dessin que LeafletMap n'a pas à
  connaître (tracé de scénario, ligne d'itinéraire), sur le modèle d'initMap() legacy.
*/
export function LeafletMap({
  id,
  className,
  markers,
  onMarkerClick,
  afterMarkers,
}: {
  id?: string;
  className?: string;
  markers: MapMarkerData[];
  onMarkerClick?: (data: MapMarkerData) => void;
  afterMarkers?: (map: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLeafletMap(containerRef, markers, onMarkerClick, afterMarkers);

  return <div id={id} className={className} ref={containerRef} />;
}
