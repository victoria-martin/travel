function setCarModelGearbox(id, gearbox) {
  getCarModel(id).gearbox = gearbox;
  saveNow();
  render();
}

function pickCarModelGearbox(id, gearbox) {
  openInlineMenu = null;
  setCarModelGearbox(id, gearbox);
}

function carGearboxTag(model) {
  const current = carGearboxKey(model.gearbox);
  const pick = (key) => `pickCarModelGearbox('${model.id}','${key}')`;
  return inlineDropdown(
    `car-gearbox:${model.id}`,
    'gearbox-dropdown',
    /* HTML */ `<summary class="inline-tag">
        ${tagLabel(carGearbox(current).emoji, carGearbox(current).label)}
      </summary>
      <div class="inline-menu">
        ${openResourceMenuItem(`openModal('modele','${model.id}')`)}
        <button class="inline-menu-item ${current ? '' : 'selected'}" onclick="${pick('')}">
          ${tagLabel(UNSET_CAR_GEARBOX.emoji, UNSET_CAR_GEARBOX.label)}
        </button>
        ${Object.entries(CAR_GEARBOXES)
          .map(
            ([key, g]) => `<button
              class="inline-menu-item ${key === current ? 'selected' : ''}"
              onclick="${pick(key)}"
            >
              ${tagLabel(g.emoji, g.label)}
            </button>`,
          )
          .join('')}
      </div>`,
  );
}
