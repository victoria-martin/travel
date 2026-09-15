/*
  Le fil du trajet se lit de deux façons : l'avancement de chaque étape, comme la bande de la liste,
  ou le type de son hébergement. C'est une préférence d'affichage, elle vaut pour tous les
  scénarios.
*/
function trailColorByType() {
  return prefs.trailColorByType === true;
}

function toggleTrailColor() {
  prefs.trailColorByType = !trailColorByType();
  persistPrefs();
  render();
}

function trailColorOption() {
  return /* HTML */ `<div class="filter-block">
    <p class="filter-title">Fil du trajet</p>
    <label class="filter-option">
      <input type="checkbox" ${trailColorByType() ? 'checked' : ''} onchange="toggleTrailColor()" />
      Coloré par type d’hébergement
    </label>
  </div>`;
}
