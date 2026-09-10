function stepPlaceOptions(step) {
  const cities = [...state.cities].sort((a, b) => a.name.localeCompare(b.name));
  return /* HTML */ `
    ${
      cities.length
        ? `<optgroup label="Villes">${cities
            .map(
              (c) =>
                `<option value="ville:${c.id}" ${step.cityId === c.id ? 'selected' : ''}>📍 ${escapeHtml(c.name)}</option>`,
            )
            .join('')}</optgroup>`
        : ''
    }
    ${
      state.accommodations.length
        ? `<optgroup label="Hébergements">${state.accommodations
            .map(
              (a) =>
                `<option value="heb:${a.id}" ${step.accommodationId === a.id ? 'selected' : ''}>${accType(a.type).emoji} ${escapeHtml(a.name)} (${escapeHtml(a.city)})</option>`,
            )
            .join('')}</optgroup>`
        : ''
    }
  `;
}
