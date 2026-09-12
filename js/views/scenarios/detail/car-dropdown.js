function pickScenarioCar(scenarioId, carId) {
  openInlineMenu = null;
  setScenarioCar(scenarioId, carId);
}

function scenarioCarDropdown(scenario) {
  const cars = ofCurrentTravel(state.cars);
  const current = getScenarioCar(scenario);
  return inlineDropdown(
    `car:${scenario.id}`,
    'car-dropdown',
    /* HTML */ `<summary class="inline-tag">
        ${tagLabel('', current ? escapeHtml(carLabel(current)) : 'Aucune voiture')}
      </summary>
      <div class="inline-menu">
        <button class="inline-menu-item ${scenario.carId ? '' : 'selected'}"
          onclick="pickScenarioCar('${scenario.id}','')">Aucune voiture</button>
        ${cars
          .map(
            (c) => `<button
              class="inline-menu-item ${scenario.carId === c.id ? 'selected' : ''}"
              onclick="pickScenarioCar('${scenario.id}','${c.id}')"
            >
              <span class="inline-label">${escapeHtml(carLabel(c))}</span>
              ${c.pricePerDay ? `<span class="inline-menu-aside">${escapeHtml(carPriceLabel(c.pricePerDay, '/ jour'))}</span>` : ''}
            </button>`,
          )
          .join('')}
      </div>`,
  );
}
