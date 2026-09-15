/*
  La liste se lit en rangées : une étape ordinaire, ou le groupe dont les colonnes se comparent. Un
  groupe tient ses étapes d'affilée dans le scénario, donc la première ouvre sa rangée et les
  suivantes n'en ouvrent pas d'autre.
*/
function stepRows(scenario) {
  const opened = new Set();
  return scenario.steps.flatMap((step, index) => {
    const group = getStepGroup(scenario, step.groupId);
    if (!group) return [{ step, index }];
    if (opened.has(group.id)) return [];
    opened.add(group.id);
    return [{ group, index }];
  });
}

// Le tronçon qui précède une rangée mène à son étape retenue, qui n'est pas toujours la première
// de son bloc : une colonne écartée peut ouvrir le groupe.
function rowLeadStep(scenario, row) {
  if (row.step) return row.step;
  return groupSteps(scenario, row.group).find((st) => isStepRetained(scenario, st)) || null;
}

// Le rang d'une étape parmi les visibles : sa lettre et sa date en dépendent, `null` sinon.
function stepRanks(scenario) {
  const ranks = {};
  let rank = 0;
  scenario.steps.forEach((st) => {
    ranks[st.id] = isStepVisible(scenario, st) ? rank++ : null;
  });
  return ranks;
}
