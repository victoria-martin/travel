/*
  Le mode décide de qui transporte : une compagnie pour l'avion, le train, le bus et le ferry, un
  loueur pour la voiture. C'est le même prestataire dans les deux cas, référencé et jamais recopié,
  mais une voiture passe par sa location : le trajet référence la voiture, la voiture son loueur.
  Sans quoi les deux diraient chacun le sien et finiraient par diverger.
*/
function transportProviderId(t) {
  return isCarTransport(t) ? vehicleRental(getCar(t.carId) || {}).providerId : t.providerId;
}

function transportCarLabel(car) {
  return [providerName(vehicleRental(car).providerId), car.model].filter(Boolean).join(' — ');
}

function transportProviderCell(t) {
  const lead = providerName(transportProviderId(t));
  const sub = isCarTransport(t) ? (getCar(t.carId) || {}).model : t.reference;
  if (!lead) return textCell(sub);
  return `${escapeHtml(lead)}${sub ? `<div class="row-notes">${escapeHtml(sub)}</div>` : ''}`;
}
