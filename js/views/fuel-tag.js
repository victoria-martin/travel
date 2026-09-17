function setCarModelFuel(id, fuel) {
  getCarModel(id).fuel = fuel;
  saveNow();
  render();
}

function pickCarModelFuel(id, fuel) {
  openInlineMenu = null;
  setCarModelFuel(id, fuel);
}

function carFuelTag(model) {
  const current = carFuelKey(model.fuel);
  const pick = (key) => `pickCarModelFuel('${model.id}','${key}')`;
  return inlineDropdown(
    `car-fuel:${model.id}`,
    'fuel-dropdown',
    /* HTML */ `<summary class="inline-tag">
        ${tagLabel(carFuel(current).emoji, carFuel(current).label)}
      </summary>
      <div class="inline-menu">
        <button class="inline-menu-item ${current ? '' : 'selected'}" onclick="${pick('')}">
          ${tagLabel(UNSET_CAR_FUEL.emoji, UNSET_CAR_FUEL.label)}
        </button>
        ${Object.entries(CAR_FUELS)
          .map(
            ([key, f]) => `<button
              class="inline-menu-item ${key === current ? 'selected' : ''}"
              onclick="${pick(key)}"
            >
              ${tagLabel(f.emoji, f.label)}
            </button>`,
          )
          .join('')}
      </div>`,
  );
}
