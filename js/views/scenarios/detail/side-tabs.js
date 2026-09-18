/*
  La colonne de droite montre une chose à la fois, ou rien : la table dit laquelle, sous quelle
  icône et ce qu'elle rend. Ses deux boutons vivent dans la barre de l'en-tête et sont aussi la
  bascule du panneau — recliquer celui qui est allumé le referme, d'où un seul état retenu d'une
  session à l'autre, `null` quand rien n'est ouvert.
*/
const SCENARIO_SIDE_TABS = [
  {
    key: 'map',
    icon: svgIcon('map'),
    label: 'Carte',
    body: (s) => scenarioMapBlock(s, 'scenario-side-map'),
  },
  {
    key: 'money',
    icon: svgIcon('euro'),
    label: 'Argent',
    body: (s) =>
      scenarioOfferBlock(s) +
      scenarioTransportsBlock(s) +
      scenarioExpensesBlock(s) +
      scenarioTotalBlock(s),
  },
  {
    key: 'valise',
    icon: svgIcon('luggage'),
    label: 'Valise',
    body: () => scenarioPackingBlock(),
  },
];

function activeSideTab() {
  return SCENARIO_SIDE_TABS.find((tab) => tab.key === prefs.scenarioSidePanel);
}

function scenarioSideTabsToggle() {
  return toolbarToggleGroup(
    SCENARIO_SIDE_TABS.map((tab) => ({
      icon: tab.icon,
      label: tab.label,
      onclick: `toggleScenarioSidePanel('${tab.key}')`,
      active: tab.key === prefs.scenarioSidePanel,
    })),
  );
}

function toggleScenarioSidePanel(key) {
  prefs.scenarioSidePanel = prefs.scenarioSidePanel === key ? null : key;
  persistPrefs();
  renderWithTransition();
}
