const MAX_STEP_NIGHTS = 14;
const NIGHTS_OPTIONS = Array.from({ length: MAX_STEP_NIGHTS + 1 }, (_, n) => n);

function nightsLabel(n) {
  const nights = parseInt(n) || 0;
  return `${nights} nuit${nights > 1 ? 's' : ''}`;
}

function totalNights(scenario) {
  return scenario.steps.reduce((sum, st) => sum + (parseInt(st.nights) || 0), 0);
}
