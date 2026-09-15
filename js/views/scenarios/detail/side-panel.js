/*
  La colonne de droite : le panneau de l'onglet allumé dans l'en-tête, et le pied qui porte le
  total — il reste là quel que soit l'onglet, puisque c'est le chiffre qu'on vient chercher.
*/
function scenarioSidePanel(scenario) {
  const tab = activeSideTab();
  return /* HTML */ `<aside class="scenario-detail-side side-${tab.key}">
    <div class="side-panel">${tab.body(scenario)}</div>
    <div class="side-foot">
      <span class="side-foot-nights">${nightsLabel(totalNights(scenario))}</span>
      <strong>${formatCosts(scenarioTotal(scenario))}</strong>
    </div>
  </aside>`;
}
