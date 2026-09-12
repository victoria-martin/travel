function scenariosHeader() {
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Scénarios</h2>
      <p class="view-sub">Compare différentes versions de ton itinéraire</p>
    </div>
    <div class="view-header-actions">
      ${toolbarButton({ icon: '+', label: 'Nouveau scénario', onclick: 'createScenario()' })}
      ${toolbarMenu()}
    </div>
  </div>`;
}
