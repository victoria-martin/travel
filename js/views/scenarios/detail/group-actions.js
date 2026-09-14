/*
  Les écritures d'un groupe : ses colonnes. Une colonne se crée en copiant celle qui est retenue —
  on n'en change qu'un bout — et ses étapes se posent à la suite de celles du groupe, l'ordre du
  scénario étant l'ordre affiché.
*/
function insertOptionSteps(scenario, group, steps) {
  const last = scenario.steps.map((st) => st.groupId).lastIndexOf(group.id);
  scenario.steps.splice(last + 1, 0, ...steps);
}

function columnCopy(step, optionId) {
  return { ...copyStep(step), optionId };
}

// Une étape ordinaire devient la première colonne d'un groupe neuf, sa copie la seconde.
function makeStepGroup(scenarioId, stepId) {
  openInlineMenu = null;
  const scenario = getScenario(scenarioId);
  const step = getStep(scenarioId, stepId);
  if (step.groupId) return;
  const [first, second] = [emptyGroupOption(true), emptyGroupOption(false)];
  const group = { id: uid(), name: step.name, options: [first, second], extras: [] };
  scenarioGroups(scenario).push(group);
  step.groupId = group.id;
  step.optionId = first.id;
  insertOptionSteps(scenario, group, [{ ...columnCopy(step, second.id), groupId: group.id }]);
  saveNow();
  render();
}

function addGroupOption(scenarioId, groupId) {
  const scenario = getScenario(scenarioId);
  const group = getStepGroup(scenario, groupId);
  const option = emptyGroupOption(false);
  const chosen = chosenGroupOption(group);
  const copied = chosen ? optionSteps(scenario, chosen.id) : [];
  group.options.push(option);
  insertOptionSteps(
    scenario,
    group,
    (copied.length ? copied : [emptyStep()]).map((st) => ({
      ...columnCopy(st, option.id),
      groupId: group.id,
    })),
  );
  saveNow();
  render();
}

// Une seule colonne retenue par groupe : la choisir démarque les autres, la re-cliquer n'en laisse
// aucune — le groupe ne compte alors ni nuit, ni lieu, ni coût.
function chooseGroupOption(scenarioId, groupId, optionId) {
  const group = getStepGroup(getScenario(scenarioId), groupId);
  const wasSelected = !!getGroupOption(group, optionId).isSelected;
  groupOptions(group).forEach((o) => (o.isSelected = !wasSelected && o.id === optionId));
  saveNow();
  render();
}

// Le groupe porte le nom de l'étape qui s'est ouverte en options ; ses colonnes gardent le leur.
function renameStepGroup(scenarioId, groupId, name) {
  getStepGroup(getScenario(scenarioId), groupId).name = name.trim();
  saveNow();
}

/*
  Retirer une colonne emporte ses étapes. La dernière ne se retire pas : il ne resterait rien à
  comparer. Quand une seule subsiste, le groupe se défait — ses étapes redeviennent ordinaires et
  ses lignes communes rejoignent la première d'entre elles, seul endroit où elles peuvent tenir.
*/
function removeGroupOption(scenarioId, groupId, optionId) {
  openInlineMenu = null;
  const scenario = getScenario(scenarioId);
  if (groupOptions(getStepGroup(scenario, groupId)).length < 2) return;
  scenario.steps = scenario.steps.filter((st) => st.optionId !== optionId);
  pruneEmptyOption(scenario, groupId, optionId);
  saveNow();
  render();
}

// Une colonne vidée de ses étapes ne propose plus rien : elle se retire à son tour.
function pruneEmptyOption(scenario, groupId, optionId) {
  const group = getStepGroup(scenario, groupId);
  if (!group || optionSteps(scenario, optionId).length) return;
  group.options = groupOptions(group).filter((o) => o.id !== optionId);
  if (!chosenGroupOption(group) && group.options.length) group.options[0].isSelected = true;
  if (group.options.length < 2) dissolveGroup(scenario, group);
}

// Le groupe défait rend son nom à l'étape qui survit, sauf si elle en porte déjà un à elle.
function dissolveGroup(scenario, group) {
  const steps = groupSteps(scenario, group);
  if (steps.length) {
    holderExtras(steps[0]).push(...holderExtras(group));
    steps[0].name = steps[0].name || group.name || '';
  }
  steps.forEach((st) => {
    st.groupId = '';
    st.optionId = '';
  });
  scenario.groups = scenarioGroups(scenario).filter((g) => g.id !== group.id);
}
