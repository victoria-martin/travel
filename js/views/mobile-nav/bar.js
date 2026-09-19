/*
  La barre du bas mobile : les MOBILE_NAV_PRIMARY_COUNT premières pages de mobileNavOrder(), plus un
  onglet Plus qui ouvre un tiroir listant le reste et un bouton pour réorganiser les deux.
*/
function mobileNavBar() {
  const activeKey = view === 'scenario-detail' ? 'scenarios' : view;
  const primaryTabs = mobileNavPrimaryKeys()
    .map((key) => mobileNavTab(navItem(key), activeKey === key))
    .join('');
  const plusActive = mobileNavPlusOpen || mobileNavSecondaryKeys().includes(activeKey);
  return /* HTML */ `<nav class="mobile-nav-bar">
    ${primaryTabs}
    <button
      class="mobile-nav-tab ${plusActive ? 'active' : ''}"
      onclick="toggleMobileNavPlus()"
      aria-label="Plus"
    >
      <span class="nav-icon">${svgIcon('ellipsis')}</span>
      <span class="mobile-nav-tab-label">Plus</span>
    </button>
  </nav>`;
}

function mobileNavTab(item, active) {
  return /* HTML */ `<button
    class="mobile-nav-tab ${active ? 'active' : ''}"
    onclick="goToFromMobileNav('${item.key}')"
  >
    <span class="nav-icon">${item.icon}</span>
    <span class="mobile-nav-tab-label">${escapeHtml(item.label)}</span>
  </button>`;
}

function mobileNavPlusSheet() {
  return /* HTML */ `<div class="mobile-nav-backdrop" onclick="closeMobileNavPlus()"></div>
    <div class="mobile-nav-sheet">
      ${mobileNavReordering ? mobileNavReorderList() : mobileNavPlusList()}
    </div>`;
}

function mobileNavPlusList() {
  const activeKey = view === 'scenario-detail' ? 'scenarios' : view;
  const rows = mobileNavSecondaryKeys()
    .map((key) => mobileNavSheetRow(navItem(key), activeKey === key))
    .join('');
  return /* HTML */ `<div class="mobile-nav-sheet-head">
      <span class="mobile-nav-sheet-title">Plus</span>
      <button class="mobile-nav-sheet-close" onclick="closeMobileNavPlus()" aria-label="Fermer">
        ${svgIcon('x')}
      </button>
    </div>
    ${rows}
    <div class="mobile-nav-sheet-sep"></div>
    <button class="mobile-nav-sheet-row" onclick="startMobileNavReorder()">
      <span class="nav-icon">${svgIcon('arrow-up-down')}</span>
      Réorganiser
    </button>`;
}

function mobileNavSheetRow(item, active) {
  return /* HTML */ `<button
    class="mobile-nav-sheet-row"
    style="${active ? `color:var(--stone-dark);font-weight:600;` : ''}"
    onclick="goToFromMobileNav('${item.key}')"
  >
    <span class="nav-icon">${item.icon}</span>
    ${escapeHtml(item.label)}
  </button>`;
}

function mobileNavReorderList() {
  const rows = mobileNavOrder()
    .map((key, index) => mobileNavReorderRow(navItem(key), index))
    .join('');
  return /* HTML */ `<div class="mobile-nav-sheet-head">
      <span class="mobile-nav-sheet-title">Réorganiser</span>
      <button class="mobile-nav-sheet-done" onclick="endMobileNavReorder()">Terminé</button>
    </div>
    <div class="mobile-nav-reorder-hint">
      Les ${MOBILE_NAV_PRIMARY_COUNT} premières vont dans la barre du bas, le reste dans Plus.
    </div>
    ${rows}`;
}

function mobileNavReorderRow(item, index) {
  const sep = index === MOBILE_NAV_PRIMARY_COUNT ? '<div class="mobile-nav-sheet-sep"></div>' : '';
  return /* HTML */ `${sep}<div
      class="mobile-nav-reorder-row"
      ondragover="overMobileNavRow(event)"
      ondrop="dropOnMobileNavRow(event,'${item.key}')"
    >
      <span
        class="mobile-nav-drag-handle"
        draggable="true"
        title="Glisser pour déplacer"
        ondragstart="startMobileNavDrag(event,'${item.key}')"
        ondragend="endMobileNavDrag()"
        >⠿</span
      >
      <span class="nav-icon">${item.icon}</span>
      <span>${escapeHtml(item.label)}</span>
    </div>`;
}
