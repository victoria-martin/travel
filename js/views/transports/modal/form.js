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

// body : React (src/domains/transports/modal/TransportModal.tsx, src/modal-bodies.ts).
