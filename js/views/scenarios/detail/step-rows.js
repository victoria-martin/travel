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
