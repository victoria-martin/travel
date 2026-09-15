/*
  Le détail de la ligne Hébergements du total suit le trajet, une ligne par arrêt : un lieu où l'on
  dort porte ses nuits et son montant, une étape de passage — le départ, le retour, une halte — n'a
  que sa date. Un lieu revisité reste sur une seule ligne, à sa première date : c'est ce séjour-là
  qui le place dans la liste. Chaque ligne est précédée de la route qui y mène.
*/
function accommodationDetailRows(scenario) {
  return recapStopEntries(scenario)
    .map(({ step, html }) => recapLegRow(scenario, step) + html)
    .join('');
}

function recapStopEntries(scenario) {
  const stays = nightsByPlace(scenario).map((r) => ({
    at: r.firstStay,
    step: r.steps[0],
    html: scenarioRecapRow(r),
  }));
  const passages = visibleSteps(scenario)
    .map((step, at) => ({ step, at }))
    .filter(({ step }) => stepNights(step) === 0)
    .map(({ step, at }) => ({ at, step, html: scenarioPassageRow(scenario, step, at) }));
  return stays.concat(passages).sort((a, b) => a.at - b.at);
}

// Une étape sans nuit n'entre dans aucun lieu : elle tient sa ligne avec sa seule date.
function scenarioPassageRow(scenario, step, idx) {
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${recapIconLabel('', escapeHtml(step.name || 'Sans nom'))}</span>
    <span class="acc-recap-nights">${stepArrivalDay(scenario, idx)}</span>
    <span></span>
  </div>`;
}
