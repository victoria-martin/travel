/*
  Le détail de la famille Route : les kilomètres du tracé, puis ce qu'ils brûlent et ce qu'ils
  coûtent en péage. Chaque ligne redit le taux dont vient son montant — c'est ce qui rend une
  estimation relisable, et les deux taux se changent dans la fiche du voyage.
*/
function roadDetailRows(scenario) {
  const km = scenarioRoadKm(scenario);
  if (km === null) return roadRow('Distance', 'le tracé arrive…', '—');
  return (
    roadRow('Distance', '', distanceLabel(km * 1000)) +
    roadFuelCostRow(scenario) +
    roadTollCostRow(scenario)
  );
}

function roadFuelCostRow(scenario) {
  const consumption = scenarioFuelConsumption(scenario);
  const note = consumption
    ? `${formatRate(consumption)} L/100 · ${formatRate(travelFuelPrice())} €/L`
    : 'consommation du modèle non renseignée';
  return roadCostRow(scenario, 'fuelBudget', 'Essence', note, scenarioFuelCalc(scenario));
}

function roadTollCostRow(scenario) {
  return roadCostRow(
    scenario,
    'tollBudget',
    'Péages',
    `${formatRate(travelTollRate())} €/km`,
    scenarioTollCalc(scenario),
  );
}

function roadRow(label, note, amount) {
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${recapIconLabel('', label)}</span>
    <span class="acc-recap-nights">${escapeHtml(note)}</span>
    <strong>${amount}</strong>
  </div>`;
}

// Essence et péages portent un budget qui remplace le calcul, comme sur une étape : le calcul
// reste affiché en gris tant que rien n'est saisi à la main.
function roadCostRow(scenario, field, label, note, calculated) {
  const budget = scenario[field];
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub acc-recap-row-cost">
    <span>${recapIconLabel('', label)}</span>
    <span class="acc-recap-nights">${escapeHtml(note)}</span>
    <span class="step-total">
      ${
        hasPriceValue(budget) ? '' : `<span class="step-total-auto">${formatEuros(calculated)}</span>`
      }
      <span class="step-budget"
        >${editableText(
          budget,
          `setScenarioRoadBudget('${scenario.id}','${field}', this.innerText)`,
          { key: `scenario:${scenario.id}:${field}`, placeholder: 'budget' },
        )}${hasPriceValue(budget) ? ' €' : ''}</span
      >
    </span>
  </div>`;
}

function setScenarioRoadBudget(scenarioId, field, value) {
  getScenario(scenarioId)[field] = value.trim();
  saveNow();
  render();
}
