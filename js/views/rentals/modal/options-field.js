/*
  Les options d'un véhicule sont celles du catalogue de son loueur : la fiche ne fait que les
  cocher. Celle qui manque se tape ici et rejoint le catalogue — la saisie se fait le nez sur le
  site du loueur, pas dans un second écran. Comme le champ tags, le bloc édite modal.payload et se
  repeint seul : un render complet perdrait les champs pas encore enregistrés.
*/
function vehicleOptionsField(p) {
  if (!p.optionIds) p.optionIds = [];
  return /* HTML */ `<div class="field">
    <label>Options et assurances</label>
    <div id="vehicle-options">${vehicleOptionsBody(p)}</div>
  </div>`;
}

function vehicleOptionsBody(p) {
  const provider = getProvider(vehicleRental(p).providerId);
  if (!provider) return `<p class="filter-hint">Cette location n'a pas encore de loueur.</p>`;
  return /* HTML */ `
    ${provider.options
      .map(
        (option) => `<label class="filter-option">
          <input type="checkbox" ${p.optionIds.includes(option.id) ? 'checked' : ''}
            onchange="toggleVehicleOption('${option.id}')" />
          ${escapeHtml(providerOptionLabel(option))}
        </label>`,
      )
      .join('')}
    <div class="provider-option-row">
      <input id="vehicle-option-label" type="text" placeholder="Deuxième conducteur" />
      <input
        id="vehicle-option-amount"
        class="provider-option-amount"
        type="text"
        placeholder="12"
      />
      <select id="vehicle-option-unit">
        ${wordUnitOptions()}
      </select>
      <button type="button" class="btn btn-small" onclick="addVehicleOption()">＋</button>
    </div>
  `;
}

function wordUnitOptions() {
  return Object.entries(PROVIDER_OPTION_UNITS)
    .map(([key, unit]) => `<option value="${key}">${unit.label}</option>`)
    .join('');
}

function toggleVehicleOption(optionId) {
  const ids = modal.payload.optionIds;
  modal.payload.optionIds = ids.includes(optionId)
    ? ids.filter((id) => id !== optionId)
    : ids.concat(optionId);
}

// L'option tapée rejoint le catalogue du loueur et se coche : on ne la ressaisira pas pour le
// véhicule d'à côté, et corriger son prix le corrige partout.
function addVehicleOption() {
  const label = document.getElementById('vehicle-option-label').value.trim();
  const amount = document.getElementById('vehicle-option-amount').value.trim();
  if (!label && !amount) return;
  const provider = getProvider(vehicleRental(modal.payload).providerId);
  const option = {
    ...emptyProviderOption(),
    label,
    amount,
    unit: document.getElementById('vehicle-option-unit').value,
  };
  provider.options.push(option);
  upsertProvider(provider);
  modal.payload.optionIds = modal.payload.optionIds.concat(option.id);
  repaintVehicleOptions();
}

function repaintVehicleOptions() {
  document.getElementById('vehicle-options').innerHTML = vehicleOptionsBody(modal.payload);
  document.getElementById('vehicle-option-label').focus();
}
