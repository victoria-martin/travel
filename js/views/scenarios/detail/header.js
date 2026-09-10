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
      <h2
        class="view-title"
        contenteditable="true"
        onblur="renameScenario('${s.id}', this.innerText)"
      >
        ${escapeHtml(s.name)}
      </h2>
      <p class="view-sub">
        ${s.steps.length} étape${s.steps.length > 1 ? 's' : ''} — clique sur le titre pour le
        renommer
      </p>
    </div>
    <button class="btn" onclick="openModal('step','${s.id}')">+ Ajouter une étape</button>
  </div>`;
}
