/*
  Le tronçon routier se lit dans la gouttière du scénario, à gauche de la liste : le trait y court
  d'un bout à l'autre, et l'écart entre deux étapes dit la route qui les sépare. C'est la bande qui
  porte cet écart — sa hauteur est la distance — et le chiffre se pose contre le trait. Le tronçon
  vient des `legs` du même appel OSRM que le tracé, donc il n'arrive qu'après le rendu : la bande
  porte un emplacement vide, rempli quand la réponse revient, pour l'étape qui la suit. Le récap
  pose les mêmes emplacements entre ses lignes, et plusieurs scénarios peuvent être à l'écran à la
  fois : un emplacement porte donc le scénario dont il lit la route, en plus du rang du tronçon, et
  ce qu'il en montre — la gouttière a la place du couple durée · distance, le récap n'en garde que
  le temps de conduite.
*/

// Position de chaque étape retenue dans les waypoints envoyés à OSRM, `null` si elle n'y est pas.
function stepWaypointRanks(scenario) {
  const ranks = {};
  let rank = 0;
  visibleSteps(scenario).forEach((st) => {
    ranks[st.id] = coordsFor(st) ? rank++ : null;
  });
  return ranks;
}

// Un tronçon qui enjamberait une étape sans lieu ne dirait pas la distance des deux cartes qu'on
// lit : seules deux étapes voisines sur le tracé en portent un.
function stepLegRank(scenario, step) {
  if (!step) return null;
  const visible = visibleSteps(scenario);
  const at = visible.indexOf(step);
  if (at < 1) return null;
  const ranks = stepWaypointRanks(scenario);
  const before = ranks[visible[at - 1].id];
  return before === null || ranks[step.id] === null ? null : before;
}

const LEG_LABELS = {
  full: (leg) => `${durationLabel(leg.duration)} · ${distanceLabel(leg.distance)}`,
  time: (leg) => durationLabel(leg.duration),
};

function legSlot(scenario, step, label) {
  const rank = stepLegRank(scenario, step);
  if (rank === null) return '';
  return `<span class="step-leg" data-leg="${scenario.id}:${rank}" data-leg-label="${label}"></span>`;
}

function stepLegSlot(scenario, step) {
  return legSlot(scenario, step, 'full');
}

function stepLegTimeSlot(scenario, step) {
  return legSlot(scenario, step, 'time');
}

function stepLegSlots(scenario, rank) {
  return document.querySelectorAll(`[data-leg="${scenario.id}:${rank}"]`);
}

async function fillStepLegs(scenario) {
  if (!scenario) return;
  const points = visibleSteps(scenario).map(coordsFor).filter(Boolean);
  if (points.length < 2) return;

  try {
    const { legs } = await fetchRoute(points);
    const longest = Math.max(...legs.map((leg) => leg.distance));
    legs.forEach((leg, i) => setStepLeg(scenario, i, leg, legHeight(leg.distance, longest)));
  } catch (e) {
    console.warn('Tronçons routiers indisponibles', e);
    document
      .querySelectorAll(`[data-leg^="${scenario.id}:"]`)
      .forEach((slot) => (slot.textContent = '⚠️'));
  }
}

/*
  Les écarts se mesurent entre eux et non sur une échelle absolue : le plus long tronçon du scénario
  tient la hauteur pleine, les autres s'y rapportent. Un plancher garde le plus court lisible.
*/
const LEG_MIN_HEIGHT = 26;
const LEG_MAX_HEIGHT = 34;

function legHeight(distance, longest) {
  const share = longest ? distance / longest : 0;
  return Math.round(LEG_MIN_HEIGHT + (LEG_MAX_HEIGHT - LEG_MIN_HEIGHT) * share);
}

// Seule la liste du scénario porte la gouttière : ailleurs — récap, colonne d'option — la bande
// garde sa hauteur naturelle et n'affiche que le chiffre.
function setStepLeg(scenario, index, leg, height) {
  stepLegSlots(scenario, index).forEach((slot) => {
    slot.textContent = LEG_LABELS[slot.dataset.legLabel](leg);
    const gap = slot.closest('.step-list > .step-gap');
    if (gap) gap.style.height = `${height}px`;
  });
}

function distanceLabel(metres) {
  const km = metres / 1000;
  return `${km < 10 ? km.toFixed(1).replace('.', ',') : Math.round(km)} km`;
}

function durationLabel(seconds) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`;
}
