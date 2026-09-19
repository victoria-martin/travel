/*
  La colonne de droite montre une chose à la fois, ou rien : la table dit laquelle, sous quelle
  icône et ce qu'elle rend. Ses boutons vivent en rail vertical contre le bord droit, toujours là
  — c'est aussi la bascule du panneau : recliquer celui qui est allumé le referme, d'où un seul
  état retenu d'une session à l'autre, `null` quand rien n'est ouvert.
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

function scenarioSideTabsRail() {
  return /* HTML */ `<nav class="scenario-side-rail">
    ${SCENARIO_SIDE_TABS.map((tab) => scenarioSideRailButton(tab)).join('')}
  </nav>`;
}

function scenarioSideRailButton(tab) {
  const active = tab.key === prefs.scenarioSidePanel;
  return /* HTML */ `<button
    class="scenario-side-rail-btn ${active ? 'active' : ''}"
    onclick="toggleScenarioSidePanel('${tab.key}')"
    title="${escapeHtml(tab.label)}"
  >
    <span class="scenario-side-rail-icon">${tab.icon}</span>
    <span class="scenario-side-rail-label">${escapeHtml(tab.label)}</span>
  </button>`;
}

function toggleScenarioSidePanel(key) {
  prefs.scenarioSidePanel = prefs.scenarioSidePanel === key ? null : key;
  persistPrefs();
  renderWithTransition();
}
