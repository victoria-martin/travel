// Le départ du scénario donne la date de la première étape, les nuits des précédentes décalent les suivantes.
function scenarioStart(scenario) {
  return isoToDate(scenario.startDate);
}

function dateAfter(date, nights) {
  return date ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + nights) : null;
}

function stepArrival(scenario, idx) {
  const nightsBefore = visibleSteps(scenario)
    .slice(0, idx)
    .reduce((sum, st) => sum + stepNights(st), 0);
  return dateAfter(scenarioStart(scenario), nightsBefore);
}

// Un groupe commence quand s'achèvent les étapes retenues qui le précèdent : ses colonnes partent
// donc toutes de la même date, retenues ou non, sinon il n'y aurait rien à comparer.
function groupArrival(scenario, group) {
  const first = scenario.steps.findIndex((st) => st.groupId === group.id);
  const nightsBefore = scenario.steps
    .slice(0, first)
    .filter((st) => isStepVisible(scenario, st))
    .reduce((sum, st) => sum + stepNights(st), 0);
  return dateAfter(scenarioStart(scenario), nightsBefore);
}

function formatStepDate(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatStepDay(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function scenarioDateLabel(value) {
  const date = isoToDate(value);
  return date ? escapeHtml(formatStepDate(date)) : '';
}

function dateRangeLabel(arrival, nights) {
  if (!arrival) return '';
  if (nights === 0) return escapeHtml(formatStepDate(arrival));
  return escapeHtml(`${formatStepDate(arrival)} → ${formatStepDate(dateAfter(arrival, nights))}`);
}

function stepDateRange(scenario, idx) {
  return dateRangeLabel(stepArrival(scenario, idx), stepNights(visibleSteps(scenario)[idx]));
}

function stepArrivalDay(scenario, idx) {
  const arrival = stepArrival(scenario, idx);
  return arrival ? escapeHtml(formatStepDay(arrival)) : '';
}

// Un séjour se lit d'un bout à l'autre sans répéter ce qui ne change pas : le mois ne s'écrit deux
// fois que lorsque le séjour l'enjambe.
function stayRangeLabel(arrival, nights) {
  if (!arrival) return '';
  const departure = dateAfter(arrival, nights);
  if (nights === 0) return escapeHtml(formatStepDay(arrival));
  if (arrival.getMonth() === departure.getMonth())
    return escapeHtml(`${arrival.getDate()}-${formatStepDay(departure)}`);
  return escapeHtml(`${formatStepDay(arrival)} - ${formatStepDay(departure)}`);
}
