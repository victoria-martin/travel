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
        ? `<select id="provider-model-select" multiple size="${Math.min(models.length, 6)}" onchange="setProviderModels(this)">
            ${models
              .map(
                (model) =>
                  `<option value="${model.id}" ${p.modelIds.includes(model.id) ? 'selected' : ''}>${escapeHtml(model.name)}</option>`,
              )
              .join('')}
          </select>`
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

function setProviderModels(select) {
  modal.payload.modelIds = Array.from(select.selectedOptions).map((option) => option.value);
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
