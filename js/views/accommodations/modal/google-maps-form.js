/*
  La porte Google Maps : le lien en tête, il remplit nom et localisation via l'Apps Script — le
  reste (prix, dates, notes) se tape à la main comme sur les autres portes.
*/
function googleMapsAccommodationForm(p) {
  return /* HTML */ `
    <h3>Ajouter depuis Google Maps</h3>
    <div class="field">
      <label>Lien Google Maps</label
      ><input
        id="f-maps-link"
        type="text"
        value="${escapeHtml(p.mapsLink)}"
        placeholder="https://..."
        onpaste="importGoogleMapsPaste(this, 'f-name')"
        onchange="importGoogleMapsLink(this, 'f-name')"
      />
    </div>
    <div class="field-row">
      ${accommodationTypeField(p)}
      <div class="field">
        <label>Nom</label
        ><input id="f-name" type="text" value="${escapeHtml(p.name)}" />
      </div>
    </div>
    ${locateFields(p)}
    <div class="field-row">
      <div class="field">
        <label>Prix</label
        ><input
          id="f-price"
          type="text"
          value="${escapeHtml(p.price)}"
          title="Un calcul marche aussi : =625/4"
          onblur="applyPriceFormula(this)"
        />
      </div>
      <div class="field">
        <label>Dates</label
        ><input id="f-dates" type="text" value="${escapeHtml(p.dates)}" />
        <small class="field-hint">ex. 12–14 juin</small>
      </div>
    </div>
    <div class="field">
      <label>Notes</label><textarea id="f-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAccommodation('')">Enregistrer</button>
    </div>
  `;
}
