/*
  Le tronçon routier entre deux étapes se lit dans la bande qui les sépare. Il vient des `legs` du
  même appel OSRM que le tracé, donc il n'arrive qu'après le rendu : la bande porte un emplacement
  vide, rempli quand la réponse revient.
*/

// Position de chaque étape dans les waypoints envoyés à OSRM, `null` si elle n'y est pas.
function stepWaypointRanks(scenario) {
  let rank = 0;
  return scenario.steps.map((st) => (!st.hidden && coordsFor(st) ? rank++ : null));
}

// Un tronçon qui enjamberait une étape masquée ou sans lieu ne dirait pas la distance des deux
// cartes qu'on lit : seules deux cartes voisines, toutes deux sur le tracé, en portent un.
function stepLegRank(scenario, index) {
  const ranks = stepWaypointRanks(scenario);
  if (ranks[index - 1] === null || ranks[index] === null) return null;
  return ranks[index - 1];
}

function stepLegSlot(scenario, index) {
  if (stepLegRank(scenario, index) === null) return '';
  return /* HTML */ `<span class="step-leg" id="step-leg-${index}"></span>`;
}

async function fillStepLegs() {
  const scenario = getScenario(activeScenarioId);
  if (!scenario) return;
  const points = visibleSteps(scenario).map(coordsFor).filter(Boolean);
  if (points.length < 2) return;

  try {
    const { legs } = await fetchRoute(points);
    scenario.steps.forEach((st, i) => {
      const rank = stepLegRank(scenario, i);
      const leg = rank === null ? null : legs[rank];
      if (leg) setStepLeg(i, `🚗 ${distanceLabel(leg.distance)} · ${durationLabel(leg.duration)}`);
    });
  } catch (e) {
    console.warn('Tronçons routiers indisponibles', e);
    scenario.steps.forEach((st, i) => setStepLeg(i, '⚠️'));
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
