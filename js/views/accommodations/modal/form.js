function emptyAccommodation() {
  return {
    id: null,
    type: '',
    status: '',
    name: '',
    address: '',
    ...emptyPlaceLevels(),
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
      ${accommodationTypeField(p)}
      <div class="field">
        <label>Nom</label
        ><input id="f-name" type="text" value="${escapeHtml(p.name)}" placeholder="Antico Casale" />
      </div>
    </div>
    <div class="field">
      <label>Statut</label>
      <select id="f-status">
        <option value="" ${p.status ? '' : 'selected'}>
          ${UNSET_ACCOMMODATION_STATUS.emoji} ${UNSET_ACCOMMODATION_STATUS.label}
        </option>
        ${Object.entries(ACCOMMODATION_STATUSES)
          .map(
            ([key, s]) =>
              `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
          )
          .join('')}
      </select>
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
      <label>Lien</label
      ><input
        id="f-link"
        type="text"
        value="${escapeHtml(p.link)}"
        placeholder="https://..."
        onpaste="importHomeExchangePaste(); importAirbnbPaste()"
        onchange="importHomeExchangeLink(); importAirbnbLink()"
      />
    </div>
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
    ${tagsField(p, allAccommodationTags)}
    <div class="field">
      <label>Notes</label><textarea id="f-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="f-favorite" ${p.favorite ? 'checked' : ''} /> ⭐ Coup de
      cœur</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAccommodation('${p.id || ''}')">
        Enregistrer
      </button>
    </div>
  `;
}
