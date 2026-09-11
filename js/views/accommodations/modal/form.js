function emptyAccommodation() {
  return {
    id: null,
    type: DEFAULT_ACCOMMODATION_TYPE,
    status: DEFAULT_ACCOMMODATION_STATUS,
    name: '',
    address: '',
    geoAddress: '',
    city: '',
    county: '',
    region: '',
    lat: '',
    lng: '',
    price: '',
    dates: '',
    link: '',
    bookingLink: '',
    notes: '',
    tags: [],
    favorite: false,
  };
}

function accommodationForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un hébergement</h3>
    <div class="field-row">
      <div class="field">
        <label>Type</label>
        <select id="f-type">
          ${Object.entries(ACCOMMODATION_TYPES)
            .map(
              ([key, t]) =>
                `<option value="${key}" ${p.type === key ? 'selected' : ''}>${t.label}</option>`,
            )
            .join('')}
        </select>
      </div>
      <div class="field">
        <label>Nom</label
        ><input id="f-name" type="text" value="${escapeHtml(p.name)}" placeholder="Antico Casale" />
      </div>
    </div>
    <div class="field">
      <label>Statut</label>
      <select id="f-status">
        ${Object.entries(ACCOMMODATION_STATUSES)
          .map(
            ([key, s]) =>
              `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
          )
          .join('')}
      </select>
    </div>
    <div class="field">
      <label>Adresse</label
      ><input
        id="f-address"
        type="text"
        value="${escapeHtml(p.address)}"
        placeholder="Borgo La Torre alle Tolfe, Siena"
      />
    </div>
    ${locateFields(p)}
    <div class="field-row">
      <div class="field">
        <label>Prix</label
        ><input id="f-price" type="text" value="${escapeHtml(p.price)}" placeholder="120" />
      </div>
      <div class="field">
        <label>Dates</label
        ><input id="f-dates" type="text" value="${escapeHtml(p.dates)}" placeholder="12–14 juin" />
      </div>
    </div>
    <div class="field">
      <label>Lien</label
      ><input
        id="f-link"
        type="text"
        value="${escapeHtml(p.link)}"
        placeholder="https://..."
        onchange="importHomeExchangeLink()"
      />
    </div>
    <div class="field">
      <label>Lien Booking</label
      ><input
        id="f-booking-link"
        type="text"
        value="${escapeHtml(p.bookingLink)}"
        placeholder="https://www.booking.com/..."
      />
    </div>
    ${accommodationTagsField(p)}
    <div class="field">
      <label>Notes</label><textarea id="f-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="f-favorite" ${p.favorite ? 'checked' : ''} /> ⭐ Coup de
      cœur</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAccommodation('${p.id || ''}')">
        Enregistrer
      </button>
    </div>
  `;
}
