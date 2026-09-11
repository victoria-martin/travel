// Le départ du scénario donne la date de la première étape, les nuits des précédentes décalent les suivantes.
function stepArrival(scenario, idx) {
  if (!scenario.startDate) return null;
  const [y, m, d] = scenario.startDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  const nightsBefore = scenario.steps
    .slice(0, idx)
    .reduce((sum, st) => sum + (parseInt(st.nights) || 0), 0);
  return new Date(y, m - 1, d + nightsBefore);
}

function formatStepDate(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatStepDay(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function stepDateRange(scenario, idx) {
  const arrival = stepArrival(scenario, idx);
  if (!arrival) return '';
  const nights = parseInt(scenario.steps[idx].nights) || 0;
  if (nights === 0) return escapeHtml(formatStepDate(arrival));
  const departure = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate() + nights);
  return escapeHtml(`${formatStepDate(arrival)} → ${formatStepDate(departure)}`);
}

function stepArrivalDay(scenario, idx) {
  const arrival = stepArrival(scenario, idx);
  return arrival ? escapeHtml(formatStepDay(arrival)) : '';
}
