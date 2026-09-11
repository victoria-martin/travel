function scenarioRow(s) {
  return /* HTML */ `<div class="scenario-row" onclick="openScenario('${s.id}')">
    <div style="display:flex; gap:10px; align-items:center;">
      <span onclick="event.stopPropagation();">
        ${favoriteStar(s.favorite, `toggleScenarioFavorite('${s.id}')`)}
      </span>
      <div>
        <h4>${escapeHtml(s.name)}</h4>
        <span
          >${s.steps.length} étape${s.steps.length > 1 ? 's' : ''} —
          ${nightsLabel(totalNights(s))}</span
        >
      </div>
    </div>
    <div style="display:flex; gap:6px;" onclick="event.stopPropagation();">
      ${duplicateButton(`duplicateScenario('${s.id}')`)} ${deleteButton('scenarios', s.id)}
    </div>
  </div>`;
}
