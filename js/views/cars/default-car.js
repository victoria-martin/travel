// Une seule voiture par défaut : la marquer démarque les autres, la re-cliquer n'en laisse aucune.
function setDefaultCar(id) {
  const wasDefault = !!getSimple('voitures', id).isDefault;
  state.cars.forEach((c) => (c.isDefault = !wasDefault && c.id === id));
  saveNow();
  render();
}

function defaultCar() {
  return state.cars.find((c) => c.isDefault) || null;
}

function defaultCarCell(car) {
  return /* HTML */ `<button
    class="icon-btn"
    style="border:none; font-size:15px; flex-shrink:0; color:${
      car.isDefault ? '#C98A3E' : 'var(--line)'
    };"
    onclick="setDefaultCar('${car.id}')"
    title="${car.isDefault ? 'Ne plus être la voiture par défaut' : 'Voiture par défaut'}"
  >
    ${car.isDefault ? '◉' : '○'}
  </button>`;
}
