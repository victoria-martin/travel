import type { Accommodation } from '../../../store/types';
import { popupName } from './popupName';

// Port de accommodationPopup (js/views/map/markers.js) en chaîne HTML : Leaflet bindPopup prend du
// HTML brut, pas un nœud React — même choix que le legacy, pas une concession.
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
