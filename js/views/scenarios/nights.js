function nightsLabel(n) {
  const nights = parseInt(n) || 0;
  return `${nights} nuit${nights > 1 ? 's' : ''}`;
}

function totalNights(scenario) {
  return scenario.steps.reduce((sum, st) => sum + (parseInt(st.nights) || 0), 0);
}
