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
    <input type="hidden" id="geo-county" value="${escapeHtml(p.county || '')}" />
    <input type="hidden" id="geo-region" value="${escapeHtml(p.region || '')}" />
  `;
}

function locateSummary(p) {
  if (p.lat && p.lng)
    return `📍 ${[p.city, p.county, p.region].filter(Boolean).join(' · ') || 'Position enregistrée'}`;
  if (p.geoAddress) return '⚠️ Aucune position — clique sur Localiser, ou saisis les coordonnées.';
  return "Localise une adresse, ou saisis les coordonnées si l'endroit est imprécis.";
}
