/*
  Un trajet part d'une ville et y arrive, mais un aéroport ou une gare n'est pas une ville :
  la précision libre se saisit à côté du cityId, et s'affiche sous le nom de la ville.
*/

function transportCityName(cityId) {
  const city = getCity(cityId);
  return city ? city.name : '';
}

function transportEndpointLabel(cityId, precision) {
  return [transportCityName(cityId), precision].filter(Boolean).join(' · ') || '—';
}

function transportEndpointCell(cityId, precision) {
  const city = transportCityName(cityId);
  if (!city) return textCell(precision);
  return `${escapeHtml(city)}${precision ? `<div class="row-notes">${escapeHtml(precision)}</div>` : ''}`;
}
