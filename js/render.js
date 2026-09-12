let view = 'hebergements'; // hebergements | voitures | charges | scenarios | scenario-detail | carte | notes

function render() {
  applyTravelAccent();
  applyTravelTab();
  const app = document.getElementById('app');
  app.innerHTML = /* HTML */ `
    <div class="sidebar">
      ${travelSelector()} ${navBtn('hebergements', '🏠', 'Hébergements')}
      ${navBtn('voitures', '🚗', 'Voitures')} ${navBtn('charges', '💶', 'Charges fixes')}
      ${navBtn('villes', '📍', 'Villes')} ${navBtn('scenarios', '🧭', 'Scénarios')}
      ${navBtn('carte', '🗺️', 'Carte')} ${navBtn('notes', '📝', 'Notes')}
      <div
        style="margin-top:14px; border-top:1px solid rgba(255,255,255,.12); padding-top:14px; display:flex; flex-direction:column; gap:6px;"
      >
        ${syncStatusHtml()}
      </div>
    </div>
    <div class="main" id="main"></div>
  `;
  renderMain();
  if (modal) renderModal();
}

function navBtn(key, icon, label) {
  const isActive = view === key || (key === 'scenarios' && view === 'scenario-detail');
  return /* HTML */ `<button
    class="nav-btn ${isActive ? 'active' : ''}"
    title="${label}"
    aria-label="${label}"
    onclick="goTo('${key}')"
  >
    <span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>
  </button>`;
}

// function goToView(v) {
function goTo(v) {
  view = v;
  if (v === 'carte') {
    render();
    setTimeout(initMap, 30);
  } else {
    render();
  }
}

function renderMain() {
  const main = document.getElementById('main');
  if (view === 'hebergements') main.innerHTML = renderAccommodationsView();
  else if (view === 'voitures') main.innerHTML = renderCarsView();
  else if (view === 'charges') main.innerHTML = renderFixedCostsView();
  else if (view === 'villes') main.innerHTML = renderCitiesView();
  else if (view === 'scenarios') main.innerHTML = renderScenariosView();
  else if (view === 'scenario-detail') {
    main.innerHTML = renderScenarioDetailView();
    setTimeout(initScenarioDetailMap, 30);
  } else if (view === 'carte') main.innerHTML = renderMapView();
  else if (view === 'notes') main.innerHTML = renderNotesView();
}
