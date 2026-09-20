function scenariosHeader() {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Scénarios</h2>
      <p class="view-sub">Compare différentes versions de ton itinéraire</p>
    </div>
    <div class="view-header-actions">
      ${scenarioSearchField()}
      ${toolbarButton({
        icon: svgIcon('scale'),
        label: 'Comparer',
        onclick: 'toggleCompareMode()',
        active: compareMode,
      })}
      ${toolbarButton({
        icon: svgIcon('archive'),
        label: 'Archivés',
        onclick: 'toggleArchivedScenarios()',
        active: showArchivedScenarios,
      })}
      ${toolbarSeparator()}
      ${toolbarButton({ icon: svgIcon('plus'), label: 'Nouveau scénario', onclick: 'createScenario()' })}
    </div>
  </div>`;
}
