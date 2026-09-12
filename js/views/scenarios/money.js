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

// Un montant se garde en deux monnaies séparées : elles ne s'additionnent jamais.
const NO_COST = { euros: 0, guestPoints: 0 };

function addCosts(a, b) {
  return { euros: a.euros + b.euros, guestPoints: a.guestPoints + b.guestPoints };
}

// Le budget saisi sur l'étape remplace le prix de l'hébergement, et se compte toujours en euros.
function stepCost(step) {
  if (hasStepBudget(step)) return { euros: priceNumber(step.budget), guestPoints: 0 };
  const acc = getAccommodation(step.accommodationId);
  const amount = nightPrice(acc) * (parseInt(step.nights) || 0);
  return isGuestPointsAccommodation(acc)
    ? { euros: 0, guestPoints: amount }
    : { euros: amount, guestPoints: 0 };
}

function placeCost(row) {
  return row.steps.reduce((total, step) => addCosts(total, stepCost(step)), NO_COST);
}

// Un home exchange se paie en GuestPoints : ces montants ne s'additionnent jamais aux euros.
function isGuestPointsAccommodation(acc) {
  return !!acc && acc.type === 'homeExchange';
}

// Nuits et montant par monnaie, pour les additionner séparément.
function accommodationTotals(scenario) {
  return scenario.steps.reduce(
    (totals, step) => {
      const cost = stepCost(step);
      const bucket = cost.guestPoints ? totals.guestPoints : totals.euros;
      bucket.amount += cost.euros + cost.guestPoints;
      bucket.nights += parseInt(step.nights) || 0;
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

function formatCosts(cost) {
  return (
    [
      cost.euros ? formatEuros(cost.euros) : '',
      cost.guestPoints ? formatGuestPoints(cost.guestPoints) : '',
    ]
      .filter(Boolean)
      .join(' + ') || '—'
  );
}

function carTotal(scenario) {
  const car = getScenarioCar(scenario);
  return car ? priceNumber(car.price) * totalNights(scenario) : 0;
}

// Le montant d'une charge est pris tel quel, sans multiplication.
function fixedCostsTotal(scenario) {
  return scenario.costIds
    .map(getFixedCost)
    .filter(Boolean)
    .reduce((sum, c) => sum + priceNumber(c.amount), 0);
}

function scenarioTotal(scenario) {
  const acc = accommodationTotals(scenario);
  return {
    euros: acc.euros.amount + carTotal(scenario) + fixedCostsTotal(scenario),
    guestPoints: acc.guestPoints.amount,
  };
}
