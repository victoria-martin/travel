/*
  Chez quels loueurs on trouve ce modèle. La relation vit sur le loueur — ses `modelIds` — et se
  lit aussi dans ses offres ; cette fiche en est le miroir, elle écrit dans celles des loueurs
  cochés. Un loueur chez qui une offre est relevée reste coché : l'offre en est la preuve. Celui
  qui manque se tape ici et rejoint la table, comme un modèle se tape depuis un loueur.
*/
function carModelProvidersField(p) {
  if (!p.providerIds) p.providerIds = carModelProviders(p.id).map((provider) => provider.id);
  return /* HTML */ `<div class="field">
    <label>Proposé par</label>
    <div id="model-providers">${carModelProvidersBody(p)}</div>
  </div>`;
}

function carModelProvidersBody(p) {
  const providers = providersOfMode('car');
  const offered = new Set(carModelOffers(p.id).map((offer) => offer.providerId));
  return /* HTML */ `${
      providers.length
        ? `<select id="model-provider-select" multiple size="${Math.min(providers.length, 6)}" onchange="setCarModelProviders(this)">
            ${providers
              .map(
                (provider) =>
                  `<option value="${provider.id}" ${p.providerIds.includes(provider.id) ? 'selected' : ''}
                    ${offered.has(provider.id) ? 'disabled title="Une offre est relevée chez lui"' : ''}>${escapeHtml(provider.name)}</option>`,
              )
              .join('')}
          </select>`
        : '<p class="filter-hint">Aucun loueur dans le voyage.</p>'
    }
    <div class="provider-option-row">
      <input id="model-provider-name" type="text" placeholder="Nouveau loueur" />
      <button type="button" class="btn btn-small" onclick="addCarModelProviderNamed()">
        ${svgIcon('plus')}
      </button>
    </div>`;
}

// Un loueur avec une offre relevée reste sélectionné et non désélectionnable : l'option se rend
// disabled, ce que `selectedOptions` respecte sans intervention JS.
function setCarModelProviders(select) {
  modal.payload.providerIds = Array.from(select.selectedOptions).map((option) => option.value);
}

function addCarModelProviderNamed() {
  const name = document.getElementById('model-provider-name').value.trim();
  if (!name) return;
  const provider = createProviderNamed(name, 'car');
  modal.payload.providerIds = [...new Set(modal.payload.providerIds.concat(provider.id))];
  repaintCarModelProviders();
  document.getElementById('model-provider-name').focus();
}

function repaintCarModelProviders() {
  document.getElementById('model-providers').innerHTML = carModelProvidersBody(modal.payload);
}
