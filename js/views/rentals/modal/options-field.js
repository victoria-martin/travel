/*
  Les options d'une offre sont celles du catalogue de son loueur : la fiche ne fait que les
  cocher. Celle qui manque se tape ici et rejoint le catalogue — la saisie se fait le nez sur le
  site du loueur, pas dans un second écran. Comme le champ tags, le bloc édite modal.payload et se
  repeint seul : un render complet perdrait les champs pas encore enregistrés.
*/
function offerOptionsField(p) {
  if (!p.optionIds) p.optionIds = [];
  return /* HTML */ `<div class="field">
    <label>Options et assurances</label>
    <div id="rental-offer-options">${offerOptionsBody(p)}</div>
  </div>`;
}

function offerOptionsBody(p) {
  const provider = getProvider(p.providerId);
  if (!provider) return `<p class="filter-hint">Choisis d'abord un loueur.</p>`;
  return /* HTML */ `
    ${provider.options
      .map(
        (option) => `<label class="filter-option">
          <input type="checkbox" ${p.optionIds.includes(option.id) ? 'checked' : ''}
            onchange="toggleOfferOption('${option.id}')" />
          ${escapeHtml(providerOptionLabel(option))}
        </label>`,
      )
      .join('')}
    <div class="provider-option-row">
      <input id="offer-option-label" type="text" placeholder="Deuxième conducteur" />
      <input id="offer-option-amount" class="provider-option-amount" type="text" placeholder="12" />
      <select id="offer-option-unit">
        ${wordUnitOptions()}
      </select>
      <button type="button" class="btn btn-small" onclick="addOfferOption()">
        ${svgIcon('plus')}
      </button>
    </div>
  `;
}

function wordUnitOptions() {
  return Object.entries(PROVIDER_OPTION_UNITS)
    .map(([key, unit]) => `<option value="${key}">${unit.label}</option>`)
    .join('');
}

function toggleOfferOption(optionId) {
  const ids = modal.payload.optionIds;
  modal.payload.optionIds = ids.includes(optionId)
    ? ids.filter((id) => id !== optionId)
    : ids.concat(optionId);
}

// L'option tapée rejoint le catalogue du loueur et se coche : on ne la ressaisira pas pour
// l'offre d'à côté, et corriger son prix le corrige partout.
function addOfferOption() {
  const label = document.getElementById('offer-option-label').value.trim();
  const amount = document.getElementById('offer-option-amount').value.trim();
  if (!label && !amount) return;
  const provider = getProvider(modal.payload.providerId);
  const option = {
    ...emptyProviderOption(),
    label,
    amount,
    unit: document.getElementById('offer-option-unit').value,
  };
  provider.options.push(option);
  upsertProvider(provider);
  modal.payload.optionIds = modal.payload.optionIds.concat(option.id);
  repaintOfferOptions();
}

function repaintOfferOptions() {
  document.getElementById('rental-offer-options').innerHTML = offerOptionsBody(modal.payload);
  const label = document.getElementById('offer-option-label');
  if (label) label.focus();
}
