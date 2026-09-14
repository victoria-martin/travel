/*
  La colonne de droite montre une chose à la fois : la table dit laquelle, sous quelle icône et ce
  qu'elle rend. L'onglet ouvert est une préférence de vue, retenue d'une session à l'autre comme le
  dépli des familles du récap.
*/
const SCENARIO_SIDE_TABS = [
  { key: 'map', icon: '🗺', label: 'Carte', body: (s) => scenarioMapBlock(s) },
  {
    key: 'money',
    icon: '💶',
    label: 'Argent',
    body: (s) => scenarioCarBlock(s) + scenarioExpensesBlock(s) + scenarioTotalBlock(s),
  },
];

function activeSideTab() {
  return (
    SCENARIO_SIDE_TABS.find((tab) => tab.key === prefs.scenarioSideTab) || SCENARIO_SIDE_TABS[0]
  );
}

function setScenarioSideTab(key) {
  prefs.scenarioSideTab = key;
  persistPrefs();
  render();
}
