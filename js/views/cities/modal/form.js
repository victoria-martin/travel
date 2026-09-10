function emptyCity() {
  return {
    id: null,
    name: '',
    geoAddress: '',
    lat: '',
    lng: '',
    county: '',
    region: '',
    notes: '',
  };
}

function cityForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une ville</h3>
    <div class="field">
      <label>Nom</label
      ><input id="c-name" type="text" value="${escapeHtml(p.name)}" placeholder="Sienne" />
    </div>
    <div class="field">
      <label>Adresse à localiser (optionnelle)</label
      ><input
        id="c-geo-address"
        type="text"
        value="${escapeHtml(p.geoAddress)}"
        placeholder="Piazza del Campo, Siena"
      />
    </div>
    <div id="geocode-status" class="geocode-status">${cityGeocodeSummary(p)}</div>
    <div class="field-row">
      <div class="field">
        <label>Latitude</label
        ><input id="c-lat" type="text" value="${escapeHtml(p.lat)}" placeholder="43.3188" />
      </div>
      <div class="field">
        <label>Longitude</label
        ><input id="c-lng" type="text" value="${escapeHtml(p.lng)}" placeholder="11.3308" />
      </div>
    </div>
    <div class="field">
      <label>Notes</label><textarea id="c-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveCity('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

function cityGeocodeSummary(p) {
  if (p.lat && p.lng)
    return `📍 ${[p.county, p.region].filter(Boolean).join(' · ') || 'Position enregistrée'}`;
  if (p.geoAddress) return '⚠️ Adresse non localisée — saisis les coordonnées à la main.';
  return "Renseigne une adresse, ou les coordonnées directement si l'endroit est imprécis.";
}
