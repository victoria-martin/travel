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
  flashOnNextRender(`option-column-${second.id}`);
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
  flashOnNextRender(`option-column-${option.id}`);
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

// Masquer le groupe sort toutes ses colonnes du voyage d'un geste : c'est l'étape entière qu'on met
// de côté, pas l'une de ses options.
function toggleGroupHidden(scenarioId, groupId) {
  const group = getStepGroup(getScenario(scenarioId), groupId);
  group.hidden = !group.hidden;
  saveNow();
  render();
}

// Le groupe porte le nom de l'étape qui s'est ouverte en options ; ses colonnes gardent le leur.
function renameStepGroup(scenarioId, groupId, name) {
  getStepGroup(getScenario(scenarioId), groupId).name = name.trim();
  saveNow();
}

/*
  La comparaison se termine par le choix d'une colonne : les autres se replient, puis le groupe se
  défait au profit de celle-ci. C'est le seul retrait proposé quand il ne reste que deux colonnes —
  y retirer une colonne défaisait le groupe sans le dire.
*/
function keepGroupOption(scenarioId, groupId, optionId) {
  const scenario = getScenario(scenarioId);
  const group = getStepGroup(scenario, groupId);
  const dropped = groupOptions(group).filter((o) => o.id !== optionId);
  const name = groupOptionName(group, getGroupOption(group, optionId));
  if (!confirm(`Ne garder que ${name} ? Les autres options et leurs étapes seront supprimées.`))
    return;
  openInlineMenu = null;
  collapseThen(
    dropped.map((o) => `option-column-${o.id}`),
    () => {
      scenario.steps = scenario.steps.filter(
        (st) => st.groupId !== groupId || st.optionId === optionId,
      );
      dissolveGroup(scenario, group);
      saveNow();
      render();
    },
  );
}

/*
  Retirer une colonne emporte ses étapes. Elle ne s'offre qu'à partir de trois : à deux, c'est
  « Garder celle-ci » qui termine la comparaison. Une colonne qui se vide autrement défait tout de
  même le groupe — ses étapes redeviennent ordinaires et ses lignes communes rejoignent la première
  d'entre elles, seul endroit où elles peuvent tenir.
*/
function removeGroupOption(scenarioId, groupId, optionId) {
  openInlineMenu = null;
  const scenario = getScenario(scenarioId);
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
    flashOnNextRender(`step-card-${steps[0].id}`);
  }
  steps.forEach((st) => {
    st.groupId = '';
    st.optionId = '';
  });
  scenario.groups = scenarioGroups(scenario).filter((g) => g.id !== group.id);
}
