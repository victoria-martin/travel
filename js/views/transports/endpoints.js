/*
  Un trajet part d'un lieu et y arrive, mais un aéroport ou une gare n'est pas un lieu du voyage :
  la précision libre se saisit à côté du lieu, et s'affiche sous son nom.
*/

function transportPlaceName(placeId) {
  const place = getAttraction(placeId);
  return place ? place.name : '';
}

function transportEndpointLabel(placeId, precision) {
  return [transportPlaceName(placeId), precision].filter(Boolean).join(' · ') || '—';
}
