import type { Accommodation, Attraction, Ville } from '@/store/types';
import type { MapMarkerData } from '../../../platform/web/LeafletMap/MapMarkerData';
import { accommodationPopup } from '../popups/accommodationPopup';
import { attractionPopup } from '../popups/attractionPopup';
import { villePopup } from '../popups/villePopup';

// Port de initMap (js/views/map/markers.js) pour la partie donnée : « quels marqueurs », pas
// « comment les dessiner » (LeafletMap). Un scénario choisi restreint les hébergements à ceux
// de scenarioAccommodationIds (legacy) si mapFilters.scenarioOnly — attractions/villes inchangées,
// même règle que legacy (« Lieux du scénario » ne vaut que pour les hébergements).
export function markerData(
  accommodations: Accommodation[],
  attractions: Attraction[],
  villes: Ville[],
): MapMarkerData[] {
  const scenario = window.mapFilters.scenarioId
    ? window.getScenario(window.mapFilters.scenarioId)
    : null;
  const chosenAccommodationIds =
    scenario && window.mapFilters.scenarioOnly ? window.scenarioAccommodationIds(scenario) : null;

  const markers: MapMarkerData[] = [];

  accommodations.forEach((accommodation) => {
    if (!window.keptOnMap('hebergements', accommodation)) return;
    if (chosenAccommodationIds && !chosenAccommodationIds.has(accommodation.id)) return;
    if (!accommodation.lat || !accommodation.lng) return;
    markers.push({
      id: accommodation.id,
      point: [parseFloat(accommodation.lat), parseFloat(accommodation.lng)],
      icon: 'house',
      tooltip: accommodation.name,
      popupHtml: accommodationPopup(accommodation),
      favorite: accommodation.favorite,
    });
  });

  attractions.forEach((attraction) => {
    if (!window.keptOnMap('attractions', attraction)) return;
    if (!attraction.lat || !attraction.lng) return;
    markers.push({
      id: attraction.id,
      point: [parseFloat(attraction.lat), parseFloat(attraction.lng)],
      icon: 'dot',
      tooltip: attraction.name,
      popupHtml: attractionPopup(attraction),
      favorite: attraction.favorite,
    });
  });

  villes.forEach((ville) => {
    if (!ville.lat || !ville.lng) return;
    markers.push({
      id: ville.id,
      point: [parseFloat(ville.lat), parseFloat(ville.lng)],
      icon: 'map-pin',
      tooltip: ville.name,
      popupHtml: villePopup(ville),
      favorite: false,
    });
  });

  return markers;
}
