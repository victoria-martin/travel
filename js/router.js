/*
  The hash IS the view: `#villes`, `#scenario/<id>`. A real path would need a server rewriting
  every URL to index.html — neither file:// nor GitHub Pages can, so a reload would 404.
*/

// The ten pages of the sidebar. `scenario-detail` is the eleventh view, routed as `#scenario/<id>`.
const VIEWS = [
  'hebergements',
  'voitures',
  'depenses',
  'villes',
  'attractions',
  'transports',
  'scenarios',
  'carte',
  'notes',
  'a-faire',
];

const SCENARIO_ROUTE = 'scenario/';

let view = 'scenarios';

function goTo(v) {
  view = v;
  showRoute();
}

// An unknown scenario falls back to the list, so the hash never points at something that is gone.
function applyRoute() {
  const route = decodeURIComponent(location.hash.slice(1));
  if (route.startsWith(SCENARIO_ROUTE)) {
    const id = route.slice(SCENARIO_ROUTE.length);
    view = getScenario(id) ? 'scenario-detail' : 'scenarios';
    if (view === 'scenario-detail') activeScenarioId = id;
  } else if (VIEWS.includes(route)) {
    view = route;
  }
}

function routeHash() {
  if (view !== 'scenario-detail') return `#${view}`;
  return activeScenarioId ? `#${SCENARIO_ROUTE}${activeScenarioId}` : '#scenarios';
}

// Writing the hash renders through `hashchange`; the same hash never fires it, so render here.
function showRoute() {
  const hash = routeHash();
  if (location.hash === hash) render();
  else location.hash = hash;
}

window.addEventListener('hashchange', () => {
  applyRoute();
  render();
});
