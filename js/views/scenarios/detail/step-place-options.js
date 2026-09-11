function placeLocationLabel(place) {
  return [place.city, place.county, place.region].filter(Boolean).join(' · ');
}

function placeOptionLabel(place) {
  const location = placeLocationLabel(place);
  return escapeHtml(place.name) + (location ? ` — ${escapeHtml(location)}` : '');
}

function stepPlaceOptions(step) {
  const accommodations = ofCurrentTravel(state.accommodations);
  const cities = ofCurrentTravel(state.cities).sort((a, b) => a.name.localeCompare(b.name));
  return /* HTML */ `
    ${
      cities.length
        ? `<optgroup label="Villes">${cities
            .map(
              (c) =>
                `<option value="ville:${c.id}" ${step.cityId === c.id ? 'selected' : ''}>📍 ${placeOptionLabel(c)}</option>`,
            )
            .join('')}</optgroup>`
        : ''
    }
    ${
      accommodations.length
        ? `<optgroup label="Hébergements">${accommodations
            .map(
              (a) =>
                `<option value="heb:${a.id}" ${step.accommodationId === a.id ? 'selected' : ''}>${accType(a.type).emoji} ${placeOptionLabel(a)}</option>`,
            )
            .join('')}</optgroup>`
        : ''
    }
  `;
}
