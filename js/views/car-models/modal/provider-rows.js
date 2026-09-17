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
        ? providers
            .map(
              (provider) => `<label class="filter-option">
              <input type="checkbox" ${p.providerIds.includes(provider.id) ? 'checked' : ''}
                ${offered.has(provider.id) ? 'disabled title="Une offre est relevée chez lui"' : ''}
                onchange="toggleCarModelProvider('${provider.id}')" />
              ${escapeHtml(provider.name)}
            </label>`,
            )
            .join('')
        : '<p class="filter-hint">Aucun loueur dans le voyage.</p>'
    }
    <div class="provider-option-row">
      <input id="model-provider-name" type="text" placeholder="Hertz" />
      <button type="button" class="btn btn-small" onclick="addCarModelProviderNamed()">
        ${svgIcon('plus')}
      </button>
    </div>`;
}

function toggleCarModelProvider(providerId) {
  const ids = modal.payload.providerIds;
  modal.payload.providerIds = ids.includes(providerId)
    ? ids.filter((id) => id !== providerId)
    : ids.concat(providerId);
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
