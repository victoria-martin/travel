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
    <div class="view-header-actions">
      ${scenarioStartDateField(s)} ${s.steps.length > 0 ? scenarioMapToggleBtn() : ''}
      <button class="btn" onclick="openModal('step','${s.id}')">+ Ajouter une étape</button>
    </div>
  </div>`;
}

function scenarioStartDateField(s) {
  return /* HTML */ `<label class="header-field">
    Départ
    <input
      type="date"
      value="${s.startDate || ''}"
      onchange="setScenarioStartDate('${s.id}', this.value)"
    />
  </label>`;
}

function setScenarioStartDate(id, date) {
  getScenario(id).startDate = date;
  saveNow();
  render();
}
