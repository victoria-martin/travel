/*
  Every gesture re-renders the whole app, so the scrolling element is built anew each time. The
  route tells a redraw of the same screen from a move to another one: only the first keeps its
  place, changing page still lands at the top.
*/
let renderedRoute;

// `.main` scrolls unless the view holds its own scrolling area, as the scenario detail does.
function viewScroller() {
  const main = document.getElementById('main');
  return (main && main.querySelector('.view-scroller')) || main;
}

function keptScroll() {
  const scroller = viewScroller();
  return scroller && renderedRoute === routeHash() ? scroller.scrollTop : 0;
}

function render() {
  applyTravelAccent();
  applyTravelTab();
  const scrollTop = keptScroll();
  renderedRoute = routeHash();
  const app = document.getElementById('app');
  app.innerHTML = /* HTML */ `
    <div class="sidebar">
      ${travelSelector()}
      ${NAV_ITEMS.map((item) => navBtn(item.key, item.icon, item.label)).join('')}
      <div class="sidebar-footer">${syncStatusHtml()} ${settingsButton()}</div>
    </div>
    ${mobileNavBar()} ${mobileNavPlusOpen ? mobileNavPlusSheet() : ''}
    <div class="main" id="main"></div>
    ${toastHtml()}
  `;
  renderMain();
  viewScroller().scrollTop = scrollTop;
  if (modal) renderModal();
  applyFlash();
  placeOpenInlineMenu();
}

/*
  Un changement de mise en page se montre au lieu de sauter. Une transition CSS ne part jamais
  ici : render() rebâtit le DOM, l'élément est neuf et n'a pas d'état d'avant. Le navigateur, lui,
  sait photographier l'écran des deux côtés du re-rendu et animer le passage ; sans l'API, le
  rendu est immédiat, comme avant.
*/
function renderWithTransition() {
  if (!document.startViewTransition) return render();
  document.startViewTransition(() => render());
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
  if (view === 'accueil') main.innerHTML = renderHomeView();
  else if (view === 'hebergements') main.innerHTML = renderAccommodationsView();
  else if (view === 'depenses') main.innerHTML = renderExpensesView();
  else if (view === 'attractions') main.innerHTML = renderAttractionsView();
  else if (view === 'villes') main.innerHTML = renderVillesView();
  else if (view === 'transports') main.innerHTML = renderTransportsView();
  else if (view === 'scenarios') {
    main.innerHTML = renderScenariosView();
    if (compareMode)
      comparedScenarios(ofCurrentTravel(state.scenarios)).forEach((s) => fillStepLegs(s));
  } else if (view === 'scenario-detail') {
    main.innerHTML = renderScenarioDetailView();
    setTimeout(initScenarioDetailMaps, 30);
    fillStepLegs(getScenario(activeScenarioId));
  } else if (view === 'carte') {
    main.innerHTML = renderMapView();
    setTimeout(initMap, 30);
  } else if (view === 'journal') {
    main.innerHTML = renderJournalView();
    setTimeout(initJournalMap, 30);
  } else if (view === 'notes') main.innerHTML = renderNotesView();
  else if (view === 'phrases') main.innerHTML = renderPhrasesView();
  else if (view === 'infos-utiles') main.innerHTML = renderCountryInfoView();
  else if (view === 'valise') main.innerHTML = renderPackingView();
  else if (view === 'a-faire') main.innerHTML = renderTodoView();
  trackViewHeaderHeight(main);
}
