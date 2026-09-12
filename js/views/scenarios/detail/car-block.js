function scenarioCarBlock(scenario) {
  const car = getScenarioCar(scenario);
  const totalCarCost = carTotal(scenario);
  return /* HTML */ `<div class="scenario-extra">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Voiture</div>
      ${car ? `<strong>${totalCarCost ?? '-'}</strong>` : ''}
    </div>
    ${
      ofCurrentTravel(state.cars).length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucune voiture enregistrée — ajoute-la d'abord dans la liste Voitures.
          </div>`
        : scenarioCarDropdown(scenario)
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
