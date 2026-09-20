function renderCountryInfoView() {
  const countries = travelCountries();
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Infos utiles</h2>
        <p class="view-sub">Numéros d'urgence et ambassade, par pays du voyage</p>
      </div>
    </div>
    ${countries.length
      ? /* HTML */ `<div class="country-info-grid">
          ${countries.map(countryInfoCardHtml).join('')}
        </div>`
      : '<p class="hint">Aucun pays repéré sur ce voyage encore.</p>'}
  `;
}

function countryInfoCardHtml(country) {
  const info = countryInfoDefaults(country);
  return /* HTML */ `
    <section class="country-info-card">
      <h3 class="country-info-title">${escapeHtml(country)}</h3>
      <div class="field-row">
        ${countryInfoField(country, 'police', 'Police', info.police)}
        ${countryInfoField(country, 'firefighters', 'Pompiers', info.firefighters)}
        ${countryInfoField(country, 'medical', 'Secours', info.medical)}
      </div>
      ${countryInfoField(country, 'emergencyNumber', "Numéro d'urgence unique", info.emergencyNumber)}
      ${countryInfoField(
        country,
        'embassy',
        'Ambassade / consulat (adresse, téléphone)',
        info.embassy,
        true,
      )}
      ${countryInfoField(country, 'note', 'Note', info.note, true)}
    </section>
  `;
}

function countryInfoField(country, field, label, value, isTextarea) {
  const escaped = escapeHtml(country).replace(/"/g, '&quot;');
  const oninput = `setCountryInfoField('${escaped}', '${field}', this.value)`;
  return /* HTML */ `
    <div class="field">
      <label>${label}</label>
      ${isTextarea
        ? /* HTML */ `<textarea oninput="${oninput}">${escapeHtml(value)}</textarea>`
        : /* HTML */ `<input type="text" value="${escapeHtml(value)}" oninput="${oninput}" />`}
    </div>
  `;
}
