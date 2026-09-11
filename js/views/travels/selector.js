let travelMenuOpen = false;

function selectTravel(id) {
  openTravel(id);
  travelMenuOpen = false;
  render();
}

function openTravelModal(id) {
  travelMenuOpen = false;
  openModal('voyage', id || undefined);
}

function travelSelector() {
  const travel = currentTravel();
  return /* HTML */ `<details
    class="travel-selector"
    ${travelMenuOpen ? 'open' : ''}
    ontoggle="travelMenuOpen = this.open"
  >
    <summary class="travel-current" title="Changer de voyage">
      <span class="travel-emoji">${escapeHtml(travel ? travel.emoji : '🧳')}</span>
      <span class="travel-identity">
        <span class="travel-name">${escapeHtml(travel ? travel.name : 'Aucun voyage')}</span>
        <span class="travel-sub">${escapeHtml(travelSubtitle(travel))}</span>
      </span>
      <span class="travel-chevron">⌄</span>
    </summary>
    ${travelMenu(travel)}
  </details>`;
}

function travelMenu(current) {
  const others = state.travels.filter((t) => !current || t.id !== current.id);
  return /* HTML */ `<div class="travel-menu">
    ${others
      .map(
        (t) =>
          `<button class="travel-menu-item" onclick="selectTravel('${t.id}')"><span class="travel-emoji">${escapeHtml(t.emoji)}</span>${escapeHtml(t.name)}</button>`,
      )
      .join('')}
    ${others.length ? '<div class="travel-menu-sep"></div>' : ''}
    ${
      current
        ? `<button class="travel-menu-item" onclick="openTravelModal('${current.id}')">✎ Modifier ce voyage</button>`
        : ''
    }
    <button class="travel-menu-item" onclick="openTravelModal()">+ Nouveau voyage</button>
  </div>`;
}

// Under the name: the dates when they are filled in, the destination otherwise.
function travelSubtitle(travel) {
  if (!travel) return 'Crée ton premier voyage';
  const parts = [travelDateRange(travel), travel.region || travel.country];
  return parts.filter(Boolean).join(' · ') || 'Carnet de préparation';
}

function travelDateRange(travel) {
  const start = monthLabel(travel.startDate);
  const end = monthLabel(travel.endDate);
  if (start && end && start !== end) return `${start} → ${end}`;
  return start || end || '';
}

// Dates are stored as YYYY-MM-DD: splitting them avoids the UTC shift of new Date(iso).
function monthLabel(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
}
