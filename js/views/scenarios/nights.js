const MAX_STEP_NIGHTS = 14;
const NIGHTS_OPTIONS = Array.from({ length: MAX_STEP_NIGHTS + 1 }, (_, n) => n);
window.NIGHTS_OPTIONS = NIGHTS_OPTIONS;

function nightsLabel(n) {
  const nights = parseInt(n) || 0;
  return `${nights} nuit${nights > 1 ? 's' : ''}`;
}

function stepNights(step) {
  return parseInt(step.nights) || 0;
}

function totalNights(scenario) {
  return visibleSteps(scenario).reduce((sum, st) => sum + stepNights(st), 0);
}

// Un séjour de N nuits dure N+1 jours : on arrive le premier et on repart le lendemain de la
// dernière. Sans nuit il n'y a pas de journée à compter.
function totalDays(scenario) {
  const nights = totalNights(scenario);
  return nights ? nights + 1 : 0;
}
