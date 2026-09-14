/*
  Every gesture re-renders the whole app, so the scrolling `.main` is built anew each time. The
  route tells a redraw of the same screen from a move to another one: only the first keeps its
  place, changing page still lands at the top.
*/
let renderedRoute;

function keptScroll() {
  const main = document.getElementById('main');
  return main && renderedRoute === routeHash() ? main.scrollTop : 0;
}

function render() {
  applyTravelAccent();
  applyTravelTab();
  const scrollTop = keptScroll();
  renderedRoute = routeHash();
  const app = document.getElementById('app');
  app.innerHTML = /* HTML */ `
    <div class="sidebar">
      ${travelSelector()} ${navBtn('hebergements', '🏠', 'Hébergements')}
      ${navBtn('voitures', '🚗', 'Voitures')} ${navBtn('depenses', '💶', 'Dépenses')}
      ${navBtn('villes', '📍', 'Villes')} ${navBtn('attractions', '🏛️', 'À faire')}
      ${navBtn('transports', '✈️', 'Transports')} ${navBtn('scenarios', '🧭', 'Scénarios')}
      ${navBtn('carte', '🗺️', 'Carte')} ${navBtn('notes', '📝', 'Notes')}
      <div
        style="margin-top:14px; border-top:1px solid rgba(255,255,255,.12); padding-top:14px; display:flex; flex-direction:column; gap:6px;"
      >
        ${syncStatusHtml()}
        <label class="sidebar-option">
          <input
            type="checkbox"
            ${showButtonLabels() ? 'checked' : ''}
            onchange="toggleButtonLabels()"
          />
          Textes des boutons
        </label>
      </div>
    </div>
    <div class="main" id="main"></div>
  `;
  renderMain();
  document.getElementById('main').scrollTop = scrollTop;
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

let viewHeaderObserver;

// Sticky blocks below the header offset themselves from its height, which wraps with the window.
function trackViewHeaderHeight(main) {
  if (viewHeaderObserver) viewHeaderObserver.disconnect();
  const header = main.querySelector('.view-header');
  if (!header) return main.style.setProperty('--view-header-h', '0px');
  viewHeaderObserver = new ResizeObserver(() =>
    main.style.setProperty('--view-header-h', `${header.offsetHeight}px`),
  );
  viewHeaderObserver.observe(header);
}

function renderMain() {
  const main = document.getElementById('main');
  if (view === 'hebergements') main.innerHTML = renderAccommodationsView();
  else if (view === 'voitures') main.innerHTML = renderCarsView();
  else if (view === 'depenses') main.innerHTML = renderExpensesView();
  else if (view === 'villes') main.innerHTML = renderCitiesView();
  else if (view === 'attractions') main.innerHTML = renderAttractionsView();
  else if (view === 'transports') main.innerHTML = renderTransportsView();
  else if (view === 'scenarios') main.innerHTML = renderScenariosView();
  else if (view === 'scenario-detail') {
    main.innerHTML = renderScenarioDetailView();
    setTimeout(initScenarioDetailMap, 30);
    fillStepLegs();
  } else if (view === 'carte') {
    main.innerHTML = renderMapView();
    setTimeout(initMap, 30);
  } else if (view === 'notes') main.innerHTML = renderNotesView();
  trackViewHeaderHeight(main);
}
