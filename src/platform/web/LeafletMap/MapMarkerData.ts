// Ce que LeafletMap reçoit pour un marqueur — jamais un objet Leaflet, voir LeafletMap.tsx.
export interface MapMarkerData {
  id: string;
  point: [number, number];
  icon: 'house' | 'map-pin' | 'dot';
  tooltip: string;
  popupHtml: string;
  favorite: boolean;
}
