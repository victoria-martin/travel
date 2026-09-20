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
    availableFrom: '',
    availableTo: '',
    searchDate: '',
    link: '',
    bookingLink: '',
    mapsLink: '',
    notes: '',
    tags: [],
    favorite: false,
  };
}

function accommodationForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un hébergement</h3>
    ${outOfRangeBanner(accommodationSearchOutOfRange(p))}
    <div class="field-row">${accommodationTypeField(p)} ${accommodationStatusField(p)}</div>
    <div class="field">
      <label>Nom</label
      ><input id="f-name" type="text" value="${escapeHtml(p.name)}" />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="f-notes" rows="2">${escapeHtml(p.notes)}</textarea>
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
    <div class="field-row">
      <div class="field">
        <label>Disponible du</label
        ><input id="f-available-from" type="date" value="${escapeHtml(p.availableFrom)}" />
      </div>
      <div class="field">
        <label>Disponible au</label
        ><input id="f-available-to" type="date" value="${escapeHtml(p.availableTo)}" />
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
        placeholder="https://..."
        onpaste="importBookingPaste()"
        onchange="importBookingLink()"
      />
    </div>
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
    ${tagsField(p, { field: 'tags', label: 'Tags', options: allAccommodationTags })}
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="f-favorite" ${p.favorite ? 'checked' : ''} />
      ${svgIcon('star', { fill: true })} Coup de cœur</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAccommodation('${p.id || ''}')">
        Enregistrer
      </button>
    </div>
  `;
}
