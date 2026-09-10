/*
  Un prix d'hébergement se saisit à la main ("120", "1 200,50 €") : on n'en garde que le nombre,
  compris par nuit.
*/

function priceNumber(value) {
  const n = parseFloat(
    String(value == null ? '' : value)
      .replace(',', '.')
      .replace(/[^0-9.]/g, ''),
  );
  return Number.isFinite(n) ? n : 0;
}

function nightPrice(acc) {
  return acc ? priceNumber(acc.price) : 0;
}

function placeCost(row) {
  return nightPrice(row.acc) * row.nights;
}

function accommodationsTotal(scenario) {
  return nightsByPlace(scenario).reduce((sum, r) => sum + placeCost(r), 0);
}

function formatEuros(amount) {
  return `${Math.round(amount).toLocaleString('fr-FR')} €`;
}

function carCost(scenario) {
  const car = getScenarioCar(scenario);
  return car ? priceNumber(car.price) : 0;
}
