import { accommodationPopup } from '@/domains/carte/popups/accommodationPopup';
import { attractionPopup } from '@/domains/carte/popups/attractionPopup';
import type { MapMarkerData } from '@/platform/web/LeafletMap/MapMarkerData';

// What the day concerns: its accommodation and planned activities, plus the places its text references.
export function journalMapMarkers(date: string): MapMarkerData[] {
  return window.journalMapPlaces(date).flatMap((item): MapMarkerData[] => {
    if (item.kind === 'accommodation') {
      const accommodation = window.getAccommodation(item.id);
      if (!accommodation?.lat || !accommodation.lng) return [];
      return [
        {
          id: accommodation.id,
          point: [parseFloat(accommodation.lat), parseFloat(accommodation.lng)],
          icon: 'house',
          tooltip: accommodation.name,
          popupHtml: accommodationPopup(accommodation),
          favorite: accommodation.favorite,
        },
      ];
    }
    const attraction = window.getAttraction(item.id);
    if (!attraction?.lat || !attraction.lng) return [];
    return [
      {
        id: attraction.id,
        point: [parseFloat(attraction.lat), parseFloat(attraction.lng)],
        icon: 'dot',
        tooltip: attraction.name,
        popupHtml: attractionPopup(attraction),
        favorite: attraction.favorite,
      },
    ];
  });
}
