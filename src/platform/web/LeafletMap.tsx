import { useEffect, useRef } from 'react';

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
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = window.createLeafletMap('map');
    mapRef.current = map;
    const bounds: [number, number][] = [];

    markers.forEach((marker) => {
      bounds.push(marker.point);
      addPinMarker(map, marker);
    });
    window.fitToPoints(map, bounds);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  // id fixe pour l'instant (`#map` : même CSS que la carte legacy) — à généraliser (prop `id`) le
  // jour où un deuxième consommateur (ex. carte du détail scénario) coexiste sur la même page.
  return <div id="map" ref={containerRef} />;
}

function markerDivIcon(icon: MapMarkerData['icon']) {
  if (icon === 'house') {
    return window.L.divIcon({
      className: 'map-type-pin',
      html: `<span>${window.svgIcon('house')}</span>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14],
    });
  }
  return window.L.divIcon({
    className: 'map-dot-pin',
    html: '<span></span>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

// Même geste que le legacy : survol ouvre, clic épingle (reste ouvert jusqu'à la croix ou un clic
// ailleurs), la fermeture au survol attend 120ms pour couvrir le passage marqueur -> popup.
function addPinMarker(map: any, data: MapMarkerData) {
  const marker = window.L.marker(data.point, { icon: markerDivIcon(data.icon) }).addTo(map);
  marker.bindTooltip(data.tooltip, {
    permanent: true,
    direction: 'right',
    offset: [8, 0],
    className: 'map-marker-label',
  });
  marker.bindPopup(data.popupHtml);
  marker.off('click');

  let pinned = false;
  let overMarker = false;
  let overPopup = false;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  const keepOpen = () => {
    if (closeTimer) clearTimeout(closeTimer);
  };
  const closeOnHoverEnd = () => {
    keepOpen();
    closeTimer = setTimeout(() => {
      if (!pinned && !overMarker && !overPopup) marker.closePopup();
    }, 120);
  };
  marker.on('mouseover', () => {
    overMarker = true;
    keepOpen();
    if (!pinned) marker.openPopup();
  });
  marker.on('mouseout', () => {
    overMarker = false;
    closeOnHoverEnd();
  });
  marker.on('popupopen', () => {
    const popupEl = marker.getPopup().getElement();
    if (!popupEl) return;
    popupEl.addEventListener('mouseenter', () => {
      overPopup = true;
      keepOpen();
    });
    popupEl.addEventListener('mouseleave', () => {
      overPopup = false;
      closeOnHoverEnd();
    });
  });
  marker.on('click', () => {
    pinned = true;
    marker.openPopup();
  });
  marker.on('popupclose', () => {
    pinned = false;
  });
}
