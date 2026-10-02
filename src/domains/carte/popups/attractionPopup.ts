import type { Attraction } from '../../../store/types';
import { popupName } from './popupName';

/*
  Port de attractionPopup (js/views/map/markers.js) en chaîne HTML. Pas encore porté : les actions
  d'ajout à un scénario (dropdowns d'étape), qui dépendent du scénario actif — prochain lot.
*/
export function attractionPopup(attraction: Attraction): string {
  const type = window.attractionType(attraction.type);
  const place = [attraction.type && type.label, attraction.city].filter(Boolean).join(' · ');
  const price = window.priceRange(attraction);
  const priceLine = price ? `<br/>${price}` : '';
  const name = popupName(attraction.name, attraction.favorite, attraction.link);
  const googleMaps = `<a href="${window.googleMapsPlaceUrl(attraction.address || attraction.name)}" target="_blank" rel="noreferrer" class="external-link">Google Maps</a>`;
  return `<strong>${name}</strong><br/>${place}${priceLine}<div class="map-popup-links">${googleMaps}</div>`;
}
