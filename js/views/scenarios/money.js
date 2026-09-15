// Le prix d'un hébergement est compris par nuit.
function nightPrice(acc) {
  return acc ? priceNumber(acc.price) : 0;
}

function stepAccommodationCost(step) {
  return nightPrice(getAccommodation(step.accommodationId)) * stepNights(step);
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
  const amount = stepAccommodationCost(step);
  return isGuestPointsAccommodation(acc)
    ? { euros: 0, guestPoints: amount }
    : { euros: amount, guestPoints: 0 };
}

// Ce que coûte une colonne : ses étapes et leurs lignes, qu'elle soit retenue ou non.
function optionCost(scenario, option) {
  return optionSteps(scenario, option.id).reduce(
    (total, st) =>
      addCosts(addCosts(total, stepCost(st)), { euros: extrasTotal(st), guestPoints: 0 }),
    NO_COST,
  );
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
  return visibleSteps(scenario).reduce(
    (totals, step) => {
      const cost = stepCost(step);
      const bucket = cost.guestPoints ? totals.guestPoints : totals.euros;
      bucket.amount += cost.euros + cost.guestPoints;
      bucket.nights += stepNights(step);
      return totals;
    },
    { euros: { amount: 0, nights: 0 }, guestPoints: { amount: 0, nights: 0 } },
  );
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

// Sur quoi une dépense rattachée à ce scénario se multiplie.
function scenarioSpan(scenario) {
  return {
    nights: totalNights(scenario),
    days: totalDays(scenario),
    travelers: travelerCount(),
  };
}

/*
  Une location se prend le jour de l'arrivée et se rend celui du départ : elle se compte en jours.
  Le prix du loueur se ramène au jour pour que le scénario le compte sur ses dates à lui, et ses
  options suivent la même durée — un forfait reste entier, un prix par jour se répète.
*/
function scenarioOfferTotal(scenario) {
  const offer = getScenarioOffer(scenario);
  if (!offer) return 0;
  const days = totalDays(scenario);
  return offerDayPrice(offer) * days + optionsTotal(scenarioOfferOptions(scenario), days);
}

function fixedCostsTotal(scenario) {
  const span = scenarioSpan(scenario);
  return scenario.costIds
    .map(getFixedCost)
    .filter(Boolean)
    .reduce((sum, c) => sum + expenseAmount(c, span), 0);
}

// Les dépenses du scénario et celles rattachées à ses étapes se comptent ensemble.
function scenarioExpensesTotal(scenario) {
  return fixedCostsTotal(scenario) + scenarioExtraCostsTotal(scenario);
}

function scenarioChargesTotal(scenario) {
  return scenarioOfferTotal(scenario) + scenarioExpensesTotal(scenario);
}

function scenarioTotal(scenario) {
  const acc = accommodationTotals(scenario);
  return {
    euros: acc.euros.amount + scenarioChargesTotal(scenario) + scenarioAttractionsTotal(scenario),
    guestPoints: acc.guestPoints.amount,
  };
}
