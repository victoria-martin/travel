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

