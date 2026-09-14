// Le détail de la ligne Hébergements du total, dans l'ordre du trajet.
function accommodationDetailRows(scenario) {
  const rows = nightsByPlace(scenario);
  if (rows.length === 0) return '';
  const steps = visibleSteps(scenario);
  return rows.map(scenarioRecapRow).join('') + scenarioLastDayRow(scenario, steps.length - 1);
}

// Une dernière étape sans nuit n'entre dans aucun lieu : elle ferme la liste avec sa seule date.
function scenarioLastDayRow(scenario, idx) {
  const step = visibleSteps(scenario)[idx];
  if (!step || stepNights(step) > 0) return '';
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${escapeHtml(step.name || 'Sans nom')}</span>
    <span class="acc-recap-nights">${stepArrivalDay(scenario, idx)}</span>
    <span></span>
  </div>`;
}
