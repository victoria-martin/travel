/*
  Une case de disponibilité bornée d'un seul côté vaut quand même : « disponible du 25 » exclut
  tout ce qui est avant, même sans date de fin.
*/
function outOfAvailability(acc, start, end) {
  if (!acc || !start) return false;
  const from = isoToDate(acc.availableFrom);
  const to = isoToDate(acc.availableTo);
  if (!from && !to) return false;
  return (from && start < from) || (to && (end || start) > to);
}

function availabilityRangeLabel(acc) {
  if (acc.availableFrom && acc.availableTo)
    return ` (${formatStepDay(isoToDate(acc.availableFrom))} → ${formatStepDay(isoToDate(acc.availableTo))})`;
  if (acc.availableFrom) return ` (à partir du ${formatStepDay(isoToDate(acc.availableFrom))})`;
  return ` (jusqu'au ${formatStepDay(isoToDate(acc.availableTo))})`;
}

// La date de recherche vient du lien Google Maps collé sur la fiche — voir js/google-maps.js.
function accommodationSearchOutOfRange(acc) {
  if (!acc || !acc.searchDate) return null;
  const date = isoToDate(acc.searchDate);
  if (!outOfAvailability(acc, date, date)) return null;
  return `Recherchée le ${formatStepDay(date)}, hors disponibilité${availabilityRangeLabel(acc)}`;
}

function stepOutOfRange(acc, arrival, nights) {
  if (!acc || !arrival) return null;
  const departure = dateAfter(arrival, nights);
  if (!outOfAvailability(acc, arrival, departure)) return null;
  return `Étape ${dateRangeLabel(arrival, nights)}, hors disponibilité${availabilityRangeLabel(acc)}`;
}
