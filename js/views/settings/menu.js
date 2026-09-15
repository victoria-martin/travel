/*
  Les préférences d'affichage se règlent au même endroit : un panneau de la barre latérale, où ce
  qui vaut partout précède ce qui ne vaut que sur la page ouverte. Il se déplie dans le flux et non
  au-dessus, parce que la barre défile et rognerait un panneau flottant.
*/
let settingsMenuOpen = false;

function settingsMenu() {
  const page = pageSettingsBlock();
  return /* HTML */ `<details
    class="settings-menu"
    ${settingsMenuOpen ? 'open' : ''}
    ontoggle="settingsMenuOpen = this.open"
  >
    <summary class="nav-btn" title="Réglages">
      <span class="nav-icon">⚙️</span><span class="nav-label">Réglages</span>
    </summary>
    <div class="settings-panel">
      <p class="settings-scope">Partout</p>
      <div class="filter-block">${buttonLabelsOption()}</div>
      ${page ? `<p class="settings-scope">Sur cette page</p>${page}` : ''}
    </div>
  </details>`;
}
