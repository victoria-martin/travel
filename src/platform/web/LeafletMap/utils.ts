import type { MapMarkerData } from '../LeafletMap';

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
export function addPinMarker(map: any, data: MapMarkerData) {
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
