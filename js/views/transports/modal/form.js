function emptyTransport() {
  return {
    id: null,
    mode: '',
    status: '',
    fromAttractionId: '',
    fromPrecision: '',
    toAttractionId: '',
    toPrecision: '',
    departDate: '',
    departTime: '',
    arriveDate: '',
    arriveTime: '',
    providerId: '',
    reference: '',
    budget: '',
    amountMin: '',
    amountMax: '',
    link: '',
    notes: '',
    favorite: false,
  };
}

// Villes et villages ouvrent la liste : c'est d'eux qu'on part. Les autres lieux suivent, un
// trajet pouvant viser une plage ou un site aussi bien qu'un bourg.
const ENDPOINT_TYPES = ['city', 'village'];

function transportPlaceOptions(selected) {
  const places = ofCurrentTravel(state.attractions).sort((a, b) => a.name.localeCompare(b.name));
  const option = (p) =>
    `<option value="${p.id}" ${selected === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`;
  const optgroup = (label, items) =>
    items.length ? `<optgroup label="${label}">${items.map(option).join('')}</optgroup>` : '';
  return /* HTML */ `<option value="" ${selected ? '' : 'selected'}>Aucun lieu</option>
    ${optgroup(
      'Villes et villages',
      places.filter((p) => ENDPOINT_TYPES.includes(p.type)),
    )}
    ${optgroup(
      'Autres lieux',
      places.filter((p) => !ENDPOINT_TYPES.includes(p.type)),
    )}`;
}

function transportEndpointFields(side, label, placeId, precision) {
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>${label}</label>
      <select id="t-${side}-city">
        ${transportPlaceOptions(placeId)}
      </select>
    </div>
    <div class="field">
      <label>Précision</label
      ><input
        id="t-${side}-precision"
        type="text"
        value="${escapeHtml(precision)}"
      />
    </div>
  </div>`;
}

function transportScheduleFields(side, label, date, time) {
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>${label}</label><input id="t-${side}-date" type="date" value="${escapeHtml(date)}" />
    </div>
    <div class="field">
      <label>Heure</label><input id="t-${side}-time" type="time" value="${escapeHtml(time)}" />
    </div>
  </div>`;
}

function transportProviderFields(p) {
  return /* HTML */ `<div class="field-row">
    ${providerSelectField('t-provider', p.mode, p.providerId)}
    <div class="field">
      <label>Numéro / référence</label
      ><input id="t-reference" type="text" value="${escapeHtml(p.reference)}" />
    </div>
  </div>`;
}

function repaintTransportProviderFields() {
  modal.payload.mode = document.getElementById('t-mode').value;
  document.getElementById('t-provider-block').innerHTML = transportProviderFields(modal.payload);
}

function transportPriceFields(p) {
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>Budget</label
      ><input id="t-budget" type="text" value="${escapeHtml(p.budget)}" />
    </div>
    <div class="field">
      <label>Prix mini</label
      ><input id="t-amount-min" type="text" value="${escapeHtml(p.amountMin)}" />
    </div>
    <div class="field">
      <label>Prix maxi</label
      ><input id="t-amount-max" type="text" value="${escapeHtml(p.amountMax)}" />
    </div>
  </div>`;
}

function transportForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un transport</h3>
    <div class="field-row">
      <div class="field">
        <label>Mode</label>
        <select id="t-mode" onchange="repaintTransportProviderFields()">
          <option value="" ${p.mode ? '' : 'selected'}>
            ${UNSET_TRANSPORT_MODE.emoji} ${UNSET_TRANSPORT_MODE.label}
          </option>
          ${Object.entries(TRANSPORT_MODES)
            .map(
              ([key, m]) =>
                `<option value="${key}" ${p.mode === key ? 'selected' : ''}>${m.emoji} ${m.label}</option>`,
            )
            .join('')}
        </select>
      </div>
      <div class="field">
        <label>Statut</label>
        <select id="t-status">
          <option value="" ${p.status ? '' : 'selected'}>
            ${UNSET_TRANSPORT_STATUS.emoji} ${UNSET_TRANSPORT_STATUS.label}
          </option>
          ${Object.entries(TRANSPORT_STATUSES)
            .map(
              ([key, s]) =>
                `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
            )
            .join('')}
        </select>
      </div>
    </div>
    ${transportEndpointFields('from', 'Départ', p.fromAttractionId, p.fromPrecision)}
    ${transportEndpointFields('to', 'Arrivée', p.toAttractionId, p.toPrecision)}
    ${transportScheduleFields('depart', 'Part le', p.departDate, p.departTime)}
    ${transportScheduleFields('arrive', 'Arrive le', p.arriveDate, p.arriveTime)}
    <div id="t-provider-block">${transportProviderFields(p)}</div>
    ${transportPriceFields(p)}
    <div class="field">
      <label>Lien</label
      ><input id="t-link" type="text" value="${escapeHtml(p.link)}" placeholder="https://..." />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="t-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input type="checkbox" id="t-favorite" ${p.favorite ? 'checked' : ''} />
      ${svgIcon('star', { fill: true })} Coup de cœur</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveTransport('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
