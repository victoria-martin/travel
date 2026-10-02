import { useEffect, type RefObject } from 'react';
import type { MapMarkerData } from '../LeafletMap';
import { addPinMarker } from './utils';

// Cycle de vie de la carte Leaflet (création/marqueurs/destruction) lié au montage du composant —
// pas de la donnée dérivée, pas de l'état d'action : un hook à part plutôt que dans le composant.
export function useLeafletMap(containerRef: RefObject<HTMLDivElement | null>, markers: MapMarkerData[]) {
  useEffect(() => {
    if (!containerRef.current) return;
    const map = window.createLeafletMap('map');
    const bounds: [number, number][] = [];

    markers.forEach((marker) => {
      bounds.push(marker.point);
      addPinMarker(map, marker);
    });
    window.fitToPoints(map, bounds);

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);
}
