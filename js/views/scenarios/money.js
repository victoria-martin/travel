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

function accommodationCost(step) {
  return nightPrice(getAccommodation(step.accommodationId)) * (parseInt(step.nights) || 0);
}

function hasStepBudget(step) {
  return String(step.budget == null ? '' : step.budget).trim() !== '';
}

function placeCost(row) {
  return nightPrice(row.acc) * row.nights;
}

// Un home exchange se paie en GuestPoints : ces montants ne s'additionnent jamais aux euros.
function isGuestPointsAccommodation(acc) {
  return !!acc && acc.type === 'homeExchange';
}

// Nuits et montant par monnaie, pour les additionner séparément.
function accommodationTotals(scenario) {
  return nightsByPlace(scenario).reduce(
    (totals, r) => {
      const bucket = isGuestPointsAccommodation(r.acc) ? totals.guestPoints : totals.euros;
      bucket.amount += placeCost(r);
      bucket.nights += r.nights;
      return totals;
    },
    { euros: { amount: 0, nights: 0 }, guestPoints: { amount: 0, nights: 0 } },
  );
}

function formatEuros(amount) {
  return `${Math.round(amount).toLocaleString('fr-FR')} €`;
}

function formatGuestPoints(amount) {
  return `${Math.round(amount).toLocaleString('fr-FR')} GP`;
}

// Le prix saisi à la main s'affiche tel quel : il ne manque que sa monnaie.
function accommodationPriceUnit(acc) {
  return isGuestPointsAccommodation(acc) ? 'GP' : '€';
}

function formatAccommodationCost(acc, amount) {
  return isGuestPointsAccommodation(acc) ? formatGuestPoints(amount) : formatEuros(amount);
}

function carCost(scenario) {
  const car = getScenarioCar(scenario);
  return car ? priceNumber(car.price) : 0;
}
