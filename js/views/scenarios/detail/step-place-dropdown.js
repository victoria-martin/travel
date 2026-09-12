function placeLocationLabel(place) {
  return [place.city, place.county, place.region].filter(Boolean).join(' · ');
}

function placeOptionLabel(place) {
  const location = placeLocationLabel(place);
  return escapeHtml(place.name) + (location ? ` — ${escapeHtml(location)}` : '');
}

function pickStepPlace(scenarioId, stepId, value) {
  openInlineMenu = null;
  setStepPlace(scenarioId, stepId, value);
}

function stepPlaceLabel(step) {
  const city = getCity(step.cityId);
  if (city) return tagLabel('📍', escapeHtml(city.name));
  const acc = getAccommodation(step.accommodationId);
  if (acc) return tagLabel(accType(acc.type).emoji, escapeHtml(acc.name));
  return tagLabel('', 'Aucun lieu choisi');
}

function stepPlaceDropdown(scenario, step) {
  const pick = (value) => `pickStepPlace('${scenario.id}','${step.id}','${value}')`;
  const cities = ofCurrentTravel(state.cities).sort((a, b) => a.name.localeCompare(b.name));
  const accommodations = ofCurrentTravel(state.accommodations);
  return inlineDropdown(
    `place:${step.id}`,
    'place-dropdown',
    /* HTML */ `<summary class="inline-tag">${stepPlaceLabel(step)}</summary>
      <div class="inline-menu">
        <button class="inline-menu-item ${!step.cityId && !step.accommodationId ? 'selected' : ''}"
          onclick="${pick('')}">Aucun lieu choisi</button>
        ${
          cities.length
            ? `<div class="inline-menu-group">Villes</div>
               ${cities
                 .map(
                   (c) => `<button
                     class="inline-menu-item ${step.cityId === c.id ? 'selected' : ''}"
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
                     class="inline-menu-item ${step.accommodationId === a.id ? 'selected' : ''}"
                     onclick="${pick(`heb:${a.id}`)}"
                   >
                     ${tagLabel(accType(a.type).emoji, placeOptionLabel(a))}
                   </button>`,
                 )
                 .join('')}`
            : ''
        }
      </div>`,
  );
}
