import type { Accommodation, Attraction } from '../../store/types';

/*
  Port de accommodationPopup/attractionPopup/popupName (js/views/map/markers.js) en chaînes HTML
  (pas des composants React) : Leaflet bindPopup prend du HTML brut, pas un nœud React — même choix
  que le legacy, pas une concession. Pas encore porté : les actions d'ajout à un scénario
  (dropdowns d'étape), qui dépendent du scénario actif — prochain lot.
*/
function popupName(name: string, favorite: boolean, url: string): string {
  const label = `${favorite ? `${window.svgIcon('star', { fill: true })} ` : ''}${name}`;
  return url ? `<a href="${url}" target="_blank" rel="noreferrer" class="external-link">${label}</a>` : label;
}

export function accommodationPopup(accommodation: Accommodation): string {
  const place = [
    window.accTypeKey(accommodation.type) && window.accType(accommodation.type).label,
    accommodation.city,
  ]
    .filter(Boolean)
    .join(' · ');
  const price = accommodation.price
    ? `<br/>${accommodation.price} ${window.accommodationPriceUnit(accommodation)}`
    : '';
  const name = popupName(
    accommodation.name,
    accommodation.favorite,
    accommodation.link || accommodation.bookingLink,
  );
  return `<strong>${name}</strong><br/>${place}${price}`;
}

export function attractionPopup(attraction: Attraction): string {
  const type = window.attractionType(attraction.type);
  const place = [attraction.type && type.label, attraction.city].filter(Boolean).join(' · ');
  const price = window.priceRange(attraction);
  const priceLine = price ? `<br/>${price}` : '';
  const name = popupName(attraction.name, attraction.favorite, attraction.link);
  const googleMaps = `<a href="${window.googleMapsPlaceUrl(attraction.address || attraction.name)}" target="_blank" rel="noreferrer" class="external-link">Google Maps</a>`;
  return `<strong>${name}</strong><br/>${place}${priceLine}<div class="map-popup-links">${googleMaps}</div>`;
}
