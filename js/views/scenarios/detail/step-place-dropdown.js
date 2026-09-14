function placeOptionLabel(place) {
  const location = placeLevelsLabel(place);
  return escapeHtml(place.name) + (location ? ` — ${escapeHtml(location)}` : '');
}

function pickStepPlace(scenarioId, stepId, optionId, value) {
  openInlineMenu = null;
  setStepPlace(scenarioId, stepId, optionId, value);
}

function optionPlaceLabel(option) {
  const city = getCity(option.cityId);
  if (city) return tagLabel('📍', escapeHtml(city.name));
  const acc = getAccommodation(option.accommodationId);
  if (acc) return tagLabel(accType(acc.type).emoji, escapeHtml(acc.name));
  return tagLabel('', 'Aucun lieu choisi');
}

function stepPlaceDropdown(scenario, step, option) {
  const pick = (value) => `pickStepPlace('${scenario.id}','${step.id}','${option.id}','${value}')`;
  const cities = ofCurrentTravel(state.cities).sort((a, b) => a.name.localeCompare(b.name));
  const accommodations = ofCurrentTravel(state.accommodations).sort(
    (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name),
  );
  return inlineDropdown(
    `place:${option.id}`,
    'place-dropdown',
    /* HTML */ `<summary class="inline-tag">${optionPlaceLabel(option)}</summary>
      <div class="inline-menu">
        <button
          class="inline-menu-item ${!option.cityId && !option.accommodationId ? 'selected' : ''}"
          onclick="${pick('')}"
        >
          Aucun lieu choisi
        </button>
        ${
          cities.length
            ? `<div class="inline-menu-group">Villes</div>
               ${cities
                 .map(
                   (c) => `<button
                     class="inline-menu-item ${option.cityId === c.id ? 'selected' : ''}"
                     onclick="${pick(`ville:${c.id}`)}"
                   >
                     ${tagLabel('📍', placeOptionLabel(c))}
                   </button>`,
                 )
                 .join('')}`
            : ''
        }
        ${
          accommodations.length
            ? `<div class="inline-menu-group">Hébergements</div>
               ${accommodations
                 .map(
                   (a) => `<button
                     class="inline-menu-item ${option.accommodationId === a.id ? 'selected' : ''}"
                     onclick="${pick(`heb:${a.id}`)}"
                   >
                     ${tagLabel(accType(a.type).emoji, `${a.favorite ? '★ ' : ''}${placeOptionLabel(a)}`)}
                   </button>`,
                 )
                 .join('')}`
            : ''
        }
      </div>`,
  );
}
