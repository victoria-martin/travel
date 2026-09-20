/*
  Fiche minimale : nom + position. Pas de champs d'attraction (favoris, tags, statut…) — une ville
  n'en a pas. La recherche reprend le geste de new-city.js (taper, choisir un résultat), mais les
  coordonnées choisies vivent dans modal.payload le temps de la saisie, comme les autres champs
  sans <input> dédié (ex. searchDate d'un hébergement).
*/
function villeForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une ville</h3>
    <div class="field">
      <label>Nom</label
      ><input id="ville-name" type="text" value="${escapeHtml(p.name)}" />
    </div>
    <div class="locate-row">
      <button type="button" class="btn btn-ghost btn-small" onclick="locateVille()">
        Localiser
      </button>
    </div>
    <div class="geocode-status">${p.status}</div>
    <div class="geocode-matches">
      ${p.matches
        .map(
          (m, i) =>
            `<button type="button" class="geocode-match" onclick="applyVilleMatch(${i})">${escapeHtml(m.label)}</button>`,
        )
        .join('')}
    </div>
    <div class="field-row">
      <div class="field">
        <label>Latitude</label
        ><input id="ville-lat" type="text" value="${escapeHtml(p.lat)}" />
      </div>
      <div class="field">
        <label>Longitude</label
        ><input id="ville-lng" type="text" value="${escapeHtml(p.lng)}" />
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveVille('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

function villeGeocodeSummary(p) {
  if (p.lat && p.lng) return '📍 Positionnée';
  return '⚠️ Pas encore localisée — clique sur Localiser, ou saisis les coordonnées.';
}
