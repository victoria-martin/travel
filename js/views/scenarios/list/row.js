function scenarioRow(s) {
  return /* HTML */ `<div class="scenario-row" onclick="openScenario('${s.id}')">
    <div>
      <h4>${escapeHtml(s.name)}</h4>
      <span
        >${s.steps.length} étape${s.steps.length > 1 ? 's' : ''} —
        ${nightsLabel(totalNights(s))}</span
      >
    </div>
    <div style="display:flex; gap:6px;" onclick="event.stopPropagation();">
      <button class="icon-btn" onclick="duplicateScenario('${s.id}')" title="Dupliquer">⧉</button>
      <button class="icon-btn" onclick="deleteItem('scenarios','${s.id}')" title="Supprimer">
        🗑
      </button>
    </div>
  </div>`;
}
