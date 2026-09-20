/*
  Un pays n'a pas de saisie fiable à déduire en général (numéros d'urgence, ambassade dépendent de
  la nationalité) : contrairement à consumption-db.js, aucun pays n'est deviné — seuls ceux de
  COUNTRY_INFO_SEED (seed.js), vérifiés à la main un par un, ont une valeur de départ. Un
  enregistrement par pays et par voyage, créé à la demande à la première frappe.
*/

function travelCountries() {
  const travel = currentTravel();
  const seen = [];
  [
    ...((travel && travel.countries) || []).map(countryLabel),
    ...ofCurrentTravel(state.accommodations).map((a) => a.country),
    ...ofCurrentTravel(state.attractions).map((a) => a.country),
  ].forEach((country) => {
    const trimmed = (country || '').trim();
    if (trimmed && !seen.some((c) => c.toLowerCase() === trimmed.toLowerCase())) seen.push(trimmed);
  });
  return seen.sort((a, b) => a.localeCompare(b));
}

function getCountryInfo(country) {
  const travelId = currentTravelId();
  return state.countryInfos.find((c) => c.travelId === travelId && c.country === country) || null;
}

// Sans enregistrement encore, la carte montre le seed du pays (s'il en a un) plutôt que du vide.
function countryInfoDefaults(country) {
  return (
    getCountryInfo(country) || {
      police: '',
      firefighters: '',
      medical: '',
      emergencyNumber: '',
      embassy: '',
      note: '',
      ...(COUNTRY_INFO_SEED[country] || {}),
    }
  );
}

function setCountryInfoField(country, field, value) {
  const info = getCountryInfo(country);
  if (info) info[field] = value;
  else state.countryInfos.push({ id: uid(), travelId: currentTravelId(), country, ...countryInfoDefaults(country), [field]: value });
  saveNow();
}
