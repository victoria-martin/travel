/*
  Les dépenses d'un scénario se lisent en panneau de droite, par-dessus la liste des étapes : on
  les corrige sans quitter le trajet. Le panneau est celui des fiches — `openSheet` —, donc le
  fond, Échap et la fermeture au clic dehors sont ceux de l'app. Ce n'est pas un formulaire : le
  panneau n'édite rien de lui-même, chaque ligne écrit en place.
*/
MODAL_TYPES['scenario-expenses'] = {
  open: (scenarioId) => ({ scenarioId, payload: {} }),
  body: (m) => scenarioExpensesBlock(getScenario(m.scenarioId)),
};

function scenarioExpensesSheetBtn(scenario) {
  return toolbarButton({
    icon: '🧾',
    label: 'Dépenses',
    onclick: `openSheet('scenario-expenses','${scenario.id}')`,
    active: modal?.type === 'scenario-expenses',
  });
}
