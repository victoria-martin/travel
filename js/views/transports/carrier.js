/*
  Le mode décide de qui transporte : une compagnie et sa référence de réservation pour l'avion,
  le train, le bus et le ferry ; l'entrée de location pour la voiture, référencée et jamais
  recopiée. Le loueur tient la place de la compagnie, le modèle celle de la référence.
*/

function transportCarLabel(car) {
  return [car.name, car.model].filter(Boolean).join(' — ');
}

function transportCarrierCell(t) {
  const lead = isCarTransport(t) ? (getCar(t.carId) || {}).name : t.carrier;
  const sub = isCarTransport(t) ? (getCar(t.carId) || {}).model : t.reference;
  if (!lead) return textCell(sub);
  return `${escapeHtml(lead)}${sub ? `<div class="row-notes">${escapeHtml(sub)}</div>` : ''}`;
}
