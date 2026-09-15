function settingsButton() {
  return /* HTML */ `<button class="nav-btn" title="Réglages" onclick="openModal('settings')">
    <span class="nav-icon">${svgIcon('settings')}</span><span class="nav-label">Réglages</span>
  </button>`;
}
