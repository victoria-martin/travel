function emptyCarModel() {
  return { id: null, name: '', fuel: '', gearbox: '' };
}

function carModelForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un modèle</h3>
    <div class="field">
      <label>Modèle</label
      ><input id="model-name" type="text" value="${escapeHtml(p.name)}" placeholder="Golf" />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Motorisation</label>
        <select id="model-fuel">
          <option value="" ${p.fuel ? '' : 'selected'}>
            ${UNSET_CAR_FUEL.emoji} ${UNSET_CAR_FUEL.label}
          </option>
          ${wordOptions(CAR_FUELS, p.fuel)}
        </select>
      </div>
      <div class="field">
        <label>Boîte</label>
        <select id="model-gearbox">
          <option value="" ${p.gearbox ? '' : 'selected'}>
            ${UNSET_CAR_GEARBOX.emoji} ${UNSET_CAR_GEARBOX.label}
          </option>
          ${wordOptions(CAR_GEARBOXES, p.gearbox)}
        </select>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveCarModel('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
