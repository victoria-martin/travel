function scenarioDetailHeader(s) {
  return /* HTML */ `<div class="view-header">
    <div>
      <button
        class="btn-ghost btn btn-small"
        style="margin-bottom:10px;"
        onclick="goTo('scenarios')"
      >
        ← Tous les scénarios
      </button>
      <h2 class="view-title" style="display:flex; gap:10px; align-items:center;">
        ${favoriteStar(s.favorite, `toggleScenarioFavorite('${s.id}')`)}
        ${editableText(s.name, `renameScenario('${s.id}', this.innerText)`, {
          key: `scenario:${s.id}:name`,
          placeholder: 'nom du scénario…',
        })}
      </h2>
      <p class="view-sub">
        ${s.steps.length} étape${s.steps.length > 1 ? 's' : ''} — clique sur le titre pour le
        renommer
      </p>
    </div>
    <button class="btn" onclick="openModal('step','${s.id}')">+ Ajouter une étape</button>
  </div>`;
}
