/*
  Quels modèles ce loueur propose. Le modèle reste du voyage — le loueur ne coche que ceux qu'on
  trouve chez lui, et la même Golf cochée chez deux loueurs reste une seule Golf. Celui qui manque
  se tape ici et rejoint le catalogue, comme une option tapée depuis une offre rejoint celui du
  loueur. Seule la voiture a des modèles : un bloc vide pour les autres modes, repeint quand le
  mode change.
*/
function providerModelsField(p) {
  if (!p.modelIds) p.modelIds = [];
  return /* HTML */ `<div id="provider-models">${providerModelsBody(p)}</div>`;
}

function providerModelsBody(p) {
  if (p.mode !== 'car') return '';
  const models = travelCarModels();
  return /* HTML */ `<div class="field">
    <label>Modèles proposés</label>
    ${
      models.length
        ? models
            .map(
              (model) => `<label class="filter-option">
              <input type="checkbox" ${p.modelIds.includes(model.id) ? 'checked' : ''}
                onchange="toggleProviderModel('${model.id}')" />
              ${escapeHtml(model.name)}
            </label>`,
            )
            .join('')
        : '<p class="filter-hint">Aucun modèle au catalogue du voyage.</p>'
    }
    <div class="provider-option-row">
      <input id="provider-model-name" type="text" placeholder="Nouveau modèle" />
      <button type="button" class="btn btn-small" onclick="addProviderModelNamed()">
        ${svgIcon('plus')}
      </button>
    </div>
  </div>`;
}

function toggleProviderModel(modelId) {
  const ids = modal.payload.modelIds;
  modal.payload.modelIds = ids.includes(modelId)
    ? ids.filter((id) => id !== modelId)
    : ids.concat(modelId);
}

// Le modèle tapé rejoint le catalogue du voyage et se coche ici : on le retrouvera chez le loueur
// d'à côté sans le ressaisir.
function addProviderModelNamed() {
  const name = document.getElementById('provider-model-name').value.trim();
  if (!name) return;
  const model = createCarModelNamed(name, '', '');
  modal.payload.modelIds = [...new Set(modal.payload.modelIds.concat(model.id))];
  repaintProviderModels();
  document.getElementById('provider-model-name').focus();
}

function repaintProviderModels() {
  modal.payload.mode = document.getElementById('prov-mode').value;
  document.getElementById('provider-models').innerHTML = providerModelsBody(modal.payload);
}
