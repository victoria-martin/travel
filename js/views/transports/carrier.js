/*
  Le mode décide de qui transporte : une compagnie et sa référence de réservation pour l'avion,
  le train, le bus et le ferry ; l'entrée de location pour la voiture, référencée et jamais
  recopiée.
*/

function transportCarName(t) {
  const car = getCar(t.carId);
  return car ? car.name : '';
}

function transportCarrierCell(t) {
  if (isCarTransport(t)) return textCell(transportCarName(t));
  if (!t.carrier) return textCell(t.reference);
  return `${escapeHtml(t.carrier)}${t.reference ? `<div class="row-notes">${escapeHtml(t.reference)}</div>` : ''}`;
}
