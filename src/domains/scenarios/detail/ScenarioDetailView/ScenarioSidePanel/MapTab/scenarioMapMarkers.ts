import { attractionPopup } from '@/domains/carte/popups/attractionPopup';
import type { MapMarkerData } from '@/platform/web/LeafletMap/MapMarkerData';
import type { Attraction } from '@/store/types';

export function scenarioMapMarkers(attractions: Attraction[]): MapMarkerData[] {
  return attractions
    .filter((attraction) => attraction.lat && attraction.lng)
    .map((attraction) => ({
      id: attraction.id,
      point: [parseFloat(attraction.lat), parseFloat(attraction.lng)],
      icon: 'dot',
      tooltip: attraction.name,
      popupHtml: attractionPopup(attraction),
      favorite: attraction.favorite,
    }));
}
