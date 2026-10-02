import type { RefObject } from 'react';

const MIN_PX = 180;
const MAX_PX = 480;

// Port de split.js : la largeur s'écrit directement sur l'élément pendant le geste (pas de
// useState par pixel), sans quoi Leaflet serait redessiné en boucle à chaque frame. `mapRef` vient
// du callback `afterMarkers` de LeafletMap (seule porte de sortie assumée vers l'instance Leaflet
// brute, voir platform/web/LeafletMap.tsx) : on y pioche juste invalidateSize(), jamais stocké ici.
export function SplitHandle({ mapRef }: { mapRef: RefObject<any> }) {
  return (
    <div
      className="map-split"
      role="separator"
      aria-orientation="vertical"
      onPointerDown={(event) => {
        const layout = event.currentTarget.closest('.map-layout') as HTMLElement | null;
        const side = layout?.querySelector('.map-side') as HTMLElement | null;
        if (!layout || !side) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
        const box = layout.getBoundingClientRect();
        const onMove = (move: PointerEvent) => {
          const width = Math.min(Math.max(move.clientX - box.left, MIN_PX), MAX_PX);
          window.prefs.mapSideWidth = width;
          side.style.width = `${width}px`;
          mapRef.current?.invalidateSize();
        };
        const onUp = () => {
          document.removeEventListener('pointermove', onMove);
          window.persistPrefs();
        };
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp, { once: true });
      }}
    />
  );
}
