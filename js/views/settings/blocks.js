/*
  Les mêmes réglages se posent à deux endroits — le ⋮ d'une liste et la modale de la barre
  latérale : ce qui vaut partout d'abord, ce qui ne vaut que sur la page ouverte ensuite, sous le
  nom de cette page.
*/
function settingsBlocks() {
  return /* HTML */ `<div class="filter-block">
      <p class="filter-title">Réglages généraux</p>
      ${buttonLabelsOption()} ${outOfRangeStyleOption()}
    </div>
    ${pageSettingsBlock()}`;
}
