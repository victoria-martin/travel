/*
  Bloc de localisation partagé par les modales hébergement et ville : une seule modale est
  ouverte à la fois, les ids sont donc fixes.
*/
function locateFields(p) {
  return /* HTML */ `
    <div class="field">
      <label>Adresse à localiser</label>
      <div class="locate-row">
        <input
          id="geo-address"
          type="text"
          value="${escapeHtml(p.geoAddress)}"
          placeholder="Piazza del Campo, Siena"
        />
        <button type="button" class="btn btn-ghost btn-small" onclick="locateAddress()">
          Localiser
        </button>
      </div>
    </div>
    <div id="geocode-status" class="geocode-status">${locateSummary(p)}</div>
    <div id="geocode-matches" class="geocode-matches"></div>
    <div class="field-row">
      <div class="field">
        <label>Latitude</label
        ><input id="geo-lat" type="text" value="${escapeHtml(p.lat)}" placeholder="43.3188" />
      </div>
      <div class="field">
        <label>Longitude</label
        ><input id="geo-lng" type="text" value="${escapeHtml(p.lng)}" placeholder="11.3308" />
      </div>
    </div>
    <input type="hidden" id="geo-city" value="${escapeHtml(p.city || '')}" />
    <div class="field-row">
      <div class="field">
        <label>Province</label
        ><input
          id="geo-county"
          type="text"
          list="geo-county-options"
          value="${escapeHtml(p.county || '')}"
          placeholder="Sienne"
        />
        ${locateOptions('geo-county-options', 'county')}
      </div>
      <div class="field">
        <label>Région</label
        ><input
          id="geo-region"
          type="text"
          list="geo-region-options"
          value="${escapeHtml(p.region || '')}"
          placeholder="Toscane"
        />
        ${locateOptions('geo-region-options', 'region')}
      </div>
    </div>
  `;
}

/* Existing values from both located collections, so a place can reuse one or introduce its own. */
function locateOptions(id, key) {
  const values = new Set();
  [...state.accommodations, ...state.cities].forEach((place) => {
    if (place[key]) values.add(place[key]);
  });
  return /* HTML */ `<datalist id="${id}">
    ${Array.from(values)
      .sort()
      .map((value) => `<option value="${escapeHtml(value)}"></option>`)
      .join('')}
  </datalist>`;
}

function locateSummary(p) {
  if (p.lat && p.lng)
    return `📍 ${[p.city, p.county, p.region].filter(Boolean).join(' · ') || 'Position enregistrée'}`;
  if (p.geoAddress) return '⚠️ Aucune position — clique sur Localiser, ou saisis les coordonnées.';
  return "Localise une adresse, ou saisis les coordonnées si l'endroit est imprécis.";
}
