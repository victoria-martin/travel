/*
  La colonne de droite : ses onglets, le panneau de celui qui est ouvert, et le pied qui porte le
  total — il reste là quel que soit l'onglet, puisque c'est le chiffre qu'on vient chercher.
*/
function scenarioSidePanel(scenario) {
  const active = activeSideTab();
  return /* HTML */ `<aside class="scenario-detail-side">
    <div class="side-tabs">${SCENARIO_SIDE_TABS.map((tab) => sideTab(tab, active)).join('')}</div>
    <div class="side-panel">${active.body(scenario)}</div>
    <div class="side-foot">
      <span class="side-foot-nights">${nightsLabel(totalNights(scenario))}</span>
      <strong>${formatCosts(scenarioTotal(scenario))}</strong>
    </div>
  </aside>`;
}

function sideTab(tab, active) {
  return /* HTML */ `<button
    class="side-tab${tab === active ? ' side-tab-on' : ''}"
    onclick="setScenarioSideTab('${tab.key}')"
  >
    <span class="side-tab-icon">${tab.icon}</span>${tab.label}
  </button>`;
}

function scenarioSidePanelToggleBtn() {
  return toolbarButton({
    icon: '🗺️',
    label: prefs.showScenarioSidePanel ? 'Masquer le panneau' : 'Afficher le panneau',
    onclick: 'toggleScenarioSidePanel()',
    active: prefs.showScenarioSidePanel,
  });
}

function toggleScenarioSidePanel() {
  prefs.showScenarioSidePanel = !prefs.showScenarioSidePanel;
  persistPrefs();
  render();
}
