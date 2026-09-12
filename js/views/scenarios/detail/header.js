function scenarioDetailHeader(s) {
  const count = visibleSteps(s).length;
  return /* HTML */ `<div class="view-header">
    <div>
      <button class="btn-ghost btn btn-small back-link" onclick="goTo('scenarios')">
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
        ${count} étape${count > 1 ? 's' : ''} — clique sur le titre pour le renommer
      </p>
    </div>
    <div class="view-header-actions">
      ${scenarioStartDateField(s)} ${count > 0 ? scenarioMapToggleBtn() : ''}
      ${toolbarButton({
        icon: '+',
        label: 'Ajouter une étape',
        onclick: `openModal('step','${s.id}')`,
      })}
      ${toolbarMenu()}
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
