/*
  La porte Booking : le lien en tête, puis ce que l'annonce remplit — nom, type, prix, adresse et
  niveaux administratifs. Statut, tags et coup de cœur se posent depuis la liste.
*/
function bookingAccommodationForm(p) {
  return /* HTML */ `
    <h3>Ajouter depuis Booking</h3>
    <div class="field">
      <label>Lien Booking</label
      ><input
        id="f-booking-link"
        type="text"
        value="${escapeHtml(p.bookingLink)}"
        placeholder="https://www.booking.com/..."
        onpaste="importBookingPaste()"
        onchange="importBookingLink()"
      />
    </div>
    <div class="field-row">
      ${accommodationTypeField(p)}
      <div class="field">
        <label>Nom</label
        ><input id="f-name" type="text" value="${escapeHtml(p.name)}" placeholder="Antico Casale" />
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
          placeholder="120"
          title="Un calcul marche aussi : =625/4"
          onblur="applyPriceFormula(this)"
        />
      </div>
      <div class="field">
        <label>Dates</label
        ><input id="f-dates" type="text" value="${escapeHtml(p.dates)}" placeholder="12–14 juin" />
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
