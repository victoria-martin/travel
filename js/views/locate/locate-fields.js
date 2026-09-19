/*
  Bloc de localisation partagé par les modales hébergement, ville et activité : une seule modale est
  ouverte à la fois, les ids sont donc fixes. Les quatre niveaux viennent de `PLACE_LEVELS`, par
  rangées de deux.
*/
function locateFields(p) {
  return /* HTML */ `
    <div class="field">
      <label>Adresse</label>
      <div class="locate-row">
        <input
          id="geo-address"
          type="text"
          value="${escapeHtml(p.address || '')}"
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
        ><input id="geo-lat" type="text" value="${escapeHtml(p.lat)}" />
      </div>
      <div class="field">
        <label>Longitude</label
        ><input id="geo-lng" type="text" value="${escapeHtml(p.lng)}" />
      </div>
    </div>
    ${placeLevelRows(p)}
  `;
}

function placeLevelRows(p) {
  const rows = [];
  for (let i = 0; i < PLACE_LEVELS.length; i += 2) rows.push(PLACE_LEVELS.slice(i, i + 2));
  return rows
    .map(
      (row) =>
        `<div class="field-row">${row.map((level) => placeLevelField(p, level)).join('')}</div>`,
    )
    .join('');
}

function placeLevelField(p, level) {
  const listId = `geo-${level.key}-options`;
  return /* HTML */ `<div class="field">
    <label>${level.label}</label
    ><input
      id="geo-${level.key}"
      type="text"
      list="${listId}"
      value="${escapeHtml(p[level.key] || '')}"
    />
    ${locateOptions(listId, level.key)}
  </div>`;
}

/* Existing values from every located collection, so a place can reuse one or introduce its own. */
function locateOptions(id, key) {
  const values = new Set();
  locatedPlaces().forEach((place) => {
    if (place[key]) values.add(place[key]);
  });
  return /* HTML */ `<datalist id="${id}">
    ${Array.from(values)
      .sort()
      .map((value) => `<option value="${escapeHtml(value)}"></option>`)
      .join('')}
  </datalist>`;
}

function locatedPlaces() {
  return [...ofCurrentTravel(state.accommodations), ...ofCurrentTravel(state.attractions)];
}

function locateSummary(p) {
  if (p.lat && p.lng) return `📍 ${placeLevelsLabel(p) || 'Position enregistrée'}`;
  if (p.address) return '⚠️ Aucune position — clique sur Localiser, ou saisis les coordonnées.';
  return "Localise une adresse, ou saisis les coordonnées si l'endroit est imprécis.";
}
