import type { Attraction } from '@/store/types';
import { popupName } from './popupName';

/*
  Port de attractionPopup (js/views/map/markers.js) en chaîne HTML — Leaflet rend les popups hors
  de l'arbre React (bindPopup), une chaîne est donc le bon format ici, pas du JSX. Les actions
  d'ajout à un scénario (dropdowns d'étape, « ajouter automatiquement », autre scénario) restent
  déléguées à mapAttractionScenarioActions : elles portent leurs propres onclick vers des globales
  legacy déjà chargées, aucune raison de les réécrire tant que ce mécanisme n'a pas besoin de
  changer.
*/
export function attractionPopup(attraction: Attraction): string {
  const type = window.attractionType(attraction.type);
  const place = [attraction.type && type.label, attraction.city].filter(Boolean).join(' · ');
  const price = window.priceRange(attraction);
  const priceLine = price ? `<br/>${price}` : '';
  const name = popupName(attraction.name, attraction.favorite, attraction.link);
  const googleMaps = `<a href="${window.googleMapsPlaceUrl(attraction.address || attraction.name)}" target="_blank" rel="noreferrer" class="external-link">Google Maps</a>`;
  const scenarioActions = window.mapAttractionScenarioActions(attraction.id);
  return `<strong>${name}</strong><br/>${place}${priceLine}<div class="map-popup-links">${googleMaps}${scenarioActions}</div>`;
}
