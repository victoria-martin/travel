/*
  Un groupe est ce qui reste de l'étape qui portait des options : ses colonnes et ses lignes
  communes, rien d'autre. Une colonne est une option — un nom et un drapeau — et les étapes qui la
  composent la désignent par leur `optionId`. Une seule colonne est retenue par groupe : l'aval ne
  voit que ses étapes, les autres sont des comparaisons.
*/
function scenarioGroups(scenario) {
  if (!Array.isArray(scenario.groups)) scenario.groups = [];
  return scenario.groups;
}

function getStepGroup(scenario, groupId) {
  return groupId ? scenarioGroups(scenario).find((g) => g.id === groupId) || null : null;
}

function groupOptions(group) {
  return (group && group.options) || [];
}

function getGroupOption(group, optionId) {
  return groupOptions(group).find((o) => o.id === optionId) || null;
}

function chosenGroupOption(group) {
  return groupOptions(group).find((o) => o.isSelected) || null;
}

// Le nom est facultatif : sans lui, une colonne se repère par son rang.
function groupOptionName(group, option) {
  return `Option ${groupOptions(group).indexOf(option) + 1}`;
}

// Les étapes d'une colonne, dans l'ordre du scénario : c'est lui qui donne l'ordre affiché.
function optionSteps(scenario, optionId) {
  return scenario.steps.filter((st) => st.optionId === optionId);
}

function groupSteps(scenario, group) {
  return scenario.steps.filter((st) => st.groupId === group.id);
}

// Une étape compte si elle n'appartient à aucune colonne, ou à la colonne retenue de son groupe.
function isStepRetained(scenario, step) {
  if (!step.optionId) return true;
  const chosen = chosenGroupOption(getStepGroup(scenario, step.groupId));
  return !!chosen && chosen.id === step.optionId;
}

function emptyGroupOption(isSelected) {
  return { id: uid(), name: '', isSelected };
}
