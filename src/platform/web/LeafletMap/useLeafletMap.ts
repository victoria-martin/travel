import { useEffect, type RefObject } from 'react';
import type { MapMarkerData } from './MapMarkerData';
import { addPinMarker } from './utils';

// Cycle de vie de la carte Leaflet (création/marqueurs/destruction) lié au montage du composant —
// pas de la donnée dérivée, pas de l'état d'action : un hook à part plutôt que dans le composant.
export function useLeafletMap(
  containerRef: RefObject<HTMLDivElement | null>,
  markers: MapMarkerData[],
  onMarkerClick?: (data: MapMarkerData) => void,
  afterMarkers?: (map: any) => void,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = window.createLeafletMap(container);
    const bounds: [number, number][] = [];

    markers.forEach((marker) => {
      bounds.push(marker.point);
      addPinMarker(map, marker, onMarkerClick);
    });
    window.fitToPoints(map, bounds);
    afterMarkers?.(map);

    // A split handle resizes the container without re-rendering: Leaflet must re-measure itself.
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);
}
