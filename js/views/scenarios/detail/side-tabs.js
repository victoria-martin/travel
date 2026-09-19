/*
  La colonne de droite montre une chose à la fois, ou rien : la table dit laquelle, sous quelle
  icône et ce qu'elle rend. Le toggle-group du header en est la bascule, sur le patron des autres
  groupes « lire la vue » — recliquer celui qui est allumé referme le panneau, d'où un seul état
  retenu d'une session à l'autre, `null` quand rien n'est ouvert. Sous 640px, où la colonne de
  droite n'a plus la place de s'afficher à côté des étapes, le même bouton ouvre le contenu en
  sheet plutôt que de le pousser en dessous.
*/
const SCENARIO_SIDE_TABS = [
  {
    key: 'map',
    icon: svgIcon('map'),
    label: 'Carte',
    body: (s) => scenarioMapBlock(s, 'scenario-side-map'),
  },
  {
    key: 'transports',
    icon: svgIcon('plane'),
    label: 'Transports',
    body: (s) => scenarioTransportsRecap(s),
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

// Des boutons séparés, pas un toggle-group : la pilule soudée de toolbarToggleGroup dit « un seul
// choix parmi N, toujours actif » (Tableau/Cartes) — ici recliquer l'actif referme le panneau, un
// état de plus qu'un toggle-group ne sait pas montrer.
function scenarioSideTabsButtons(scenarioId) {
  return SCENARIO_SIDE_TABS.map((tab) =>
    toolbarButton({
      icon: tab.icon,
      label: tab.label,
      active: tab.key === prefs.scenarioSidePanel,
      onclick: `onScenarioPanelToggle('${scenarioId}','${tab.key}')`,
    }),
  ).join('');
}

// Rail vertical, dupliqué du toggle-group du header pour comparer les deux emplacements à l'usage
// — bord droit de la page, toujours visible, sur le même state que le header.
function scenarioSideTabsRail(scenarioId) {
  return /* HTML */ `<nav class="scenario-side-rail">
    ${SCENARIO_SIDE_TABS.map(
      (tab) =>
        /* HTML */ `<button
          class="toolbar-btn ${tab.key === prefs.scenarioSidePanel ? 'active' : ''}"
          onclick="onScenarioPanelToggle('${scenarioId}','${tab.key}')"
          title="${escapeHtml(tab.label)}"
          aria-label="${escapeHtml(tab.label)}"
        >
          <span class="toolbar-icon">${tab.icon}</span>
        </button>`,
    ).join('')}
  </nav>`;
}

// En dessous de 640px, la grille du détail n'a plus de colonne de droite (elle repasse à une
// seule colonne) : le même bouton ouvre alors le panneau en sheet plutôt que de le pousser sous
// les étapes.
function onScenarioPanelToggle(scenarioId, key) {
  if (window.matchMedia('(max-width: 639px)').matches) openSheet('scenario-panel', scenarioId, key);
  else toggleScenarioSidePanel(key);
}

function toggleScenarioSidePanel(key) {
  prefs.scenarioSidePanel = prefs.scenarioSidePanel === key ? null : key;
  persistPrefs();
  renderWithTransition();
}

function scenarioPanelSheet(m) {
  const scenario = getScenario(m.scenarioId);
  const tab = SCENARIO_SIDE_TABS.find((t) => t.key === m.payload.key);
  return /* HTML */ `<h3>${escapeHtml(tab.label)}</h3>
    ${tab.body(scenario)}
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Fermer</button>
    </div>`;
}
