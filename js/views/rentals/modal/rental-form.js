function emptyRental() {
  return {
    id: null,
    providerId: '',
    location: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    link: '',
    notes: '',
  };
}

function rentalForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Nouvelle'} recherche</h3>
    ${providerSelectField('rental-provider', 'car', p.providerId)}
    <div class="field">
      <label>Lieu de prise en charge</label
      ><input
        id="rental-location"
        type="text"
        value="${escapeHtml(p.location)}"
        placeholder="Aéroport de Pise"
      />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Départ</label
        ><input id="rental-pickup-date" type="date" value="${escapeHtml(p.pickupDate)}" />
      </div>
      <div class="field">
        <label>Heure</label
        ><input id="rental-pickup-time" type="time" value="${escapeHtml(p.pickupTime)}" />
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Retour</label
        ><input id="rental-dropoff-date" type="date" value="${escapeHtml(p.dropoffDate)}" />
      </div>
      <div class="field">
        <label>Heure</label
        ><input id="rental-dropoff-time" type="time" value="${escapeHtml(p.dropoffTime)}" />
      </div>
    </div>
    <div class="field">
      <label>Lien</label
      ><input
        id="rental-link"
        type="text"
        value="${escapeHtml(p.link)}"
        placeholder="https://..."
      />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="rental-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveRental('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
