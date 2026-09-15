/*
  Où en est une étape : dérivé de son hébergement et de son groupe, jamais écrit — un statut posé
  sur l'étape divergerait du sien dès qu'on touche l'un des deux. L'ordre de déclaration est une
  échelle, du plus avancé au moins avancé : « à revoir » la ferme, puisque c'est l'étape qui appelle
  le geste, et `action` marque les deux qui attendent une main — la texture de
  [route-paint.js](js/views/scenarios/route-paint.js) les montre. Un lieu qui regroupe plusieurs étapes prend le moins avancé des leurs — une ville n'est
  pas réservée tant qu'il lui reste une nuit à trouver.
*/
const STEP_STATUSES = {
  booked: { label: 'Réservé', emoji: '🔒', color: '#7C8B5E' },
  toBook: { label: 'À réserver', emoji: '💳', color: '#DFA32C', action: true },
  comparing: { label: 'À l’étude', emoji: '⚖️', color: '#C98A3E' },
  searching: { label: 'En recherche', emoji: '🔎', color: '#C4B9A3' },
  none: { label: 'Sans hébergement', emoji: '❔', color: '#D9CFB8' },
  broken: { label: 'À revoir', emoji: '👎', color: '#A6462E', action: true },
};

const STEP_STATUS_LADDER = Object.keys(STEP_STATUSES);

// Décidé mais pas payé d'un côté, sorti du jeu de l'autre : entre les deux, la recherche est en
// cours.
const DECIDED_ACCOMMODATION_STATUSES = ['go', 'toBook'];
const OUT_ACCOMMODATION_STATUSES = ['rejected', 'notAvailable'];

/*
  Réservé d'abord : une colonne retenue et réservée est réservée, même si les autres options sont
  encore à l'écran. Un hébergement écarté ensuite : l'étape le montre encore, c'est une erreur à
  reprendre avant tout le reste.
*/
function stepStatus(scenario, step) {
  const acc = getAccommodation(step.accommodationId);
  if (isBookedAccommodation(acc)) return 'booked';
  if (acc && OUT_ACCOMMODATION_STATUSES.includes(accStatusKey(acc.status))) return 'broken';
  if (isComparedStep(scenario, step)) return 'comparing';
  if (!acc) return 'none';
  return DECIDED_ACCOMMODATION_STATUSES.includes(accStatusKey(acc.status)) ? 'toBook' : 'searching';
}

// Un groupe à une seule colonne n'est plus une comparaison : son étape est celle du fil.
function isComparedStep(scenario, step) {
  const group = getStepGroup(scenario, step.groupId);
  return !!group && groupOptions(group).length > 1;
}

function placeStatus(scenario, place) {
  return place.steps
    .map((st) => stepStatus(scenario, st))
    .reduce((a, b) => (STEP_STATUS_LADDER.indexOf(b) > STEP_STATUS_LADDER.indexOf(a) ? b : a));
}

function stepStatusInfo(key) {
  return STEP_STATUSES[key];
}
