function scenarioCarBlock(scenario) {
  const car = getScenarioCar(scenario);
  const nbOfDays = totalNights(scenario);
  const totalCarCost = carCost(scenario) * nbOfDays;
  return /* HTML */ `<div class="scenario-extra">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Voiture</div>
      ${car ? `<strong>${totalCarCost ?? '-'}</strong>` : ''}
    </div>
    ${
      state.cars.length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucune voiture enregistrée — ajoute-la d'abord dans la liste Voitures.
          </div>`
        : /* HTML */ `<select onchange="setScenarioCar('${scenario.id}', this.value)">
            <option value="">— Aucune voiture —</option>
            ${state.cars
              .map(
                (c) =>
                  `<option value="${c.id}" ${scenario.carId === c.id ? 'selected' : ''}>${escapeHtml(carLabel(c))}${c.price ? ` · ${escapeHtml(c.price)} €` : ''}</option>`,
              )
              .join('')}
          </select>`
    }
  </div>`;
}

function setScenarioCar(scenarioId, carId) {
  getScenario(scenarioId).carId = carId || null;
  saveNow();
  render();
}

function carLabel(car) {
  return [car.name, car.model].filter(Boolean).join(' · ') || 'Sans nom';
}
