/*
  Le tronçon routier entre deux étapes se lit dans la bande qui les sépare. Il vient des `legs` du
  même appel OSRM que le tracé, donc il n'arrive qu'après le rendu : la bande porte un emplacement
  vide, rempli quand la réponse revient. Une bande le porte pour l'étape qui la suit.
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

function stepLegSlot(scenario, step) {
  const rank = stepLegRank(scenario, step);
  return rank === null ? '' : `<span class="step-leg" id="step-leg-${rank}"></span>`;
}

async function fillStepLegs() {
  const scenario = getScenario(activeScenarioId);
  if (!scenario) return;
  const points = visibleSteps(scenario).map(coordsFor).filter(Boolean);
  if (points.length < 2) return;

  try {
    const { legs } = await fetchRoute(points);
    legs.forEach((leg, i) =>
      setStepLeg(i, `🚗 ${distanceLabel(leg.distance)} · ${durationLabel(leg.duration)}`),
    );
  } catch (e) {
    console.warn('Tronçons routiers indisponibles', e);
    document.querySelectorAll('.step-leg').forEach((slot) => (slot.textContent = '⚠️'));
  }
}

function setStepLeg(index, text) {
  const slot = document.getElementById(`step-leg-${index}`);
  if (slot) slot.textContent = text;
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
