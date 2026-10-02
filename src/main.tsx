import { createRoot, type Root } from 'react-dom/client';
import { AccommodationsView } from './domains/accommodations/AccommodationsView';
import { AttractionsView } from './domains/attractions/AttractionsView';
import { MapView } from './domains/carte/MapView';
import { CitiesView } from './domains/cities/CitiesView';
import { CountryInfoView } from './domains/country-info/CountryInfoView';
import { FixedCostsView } from './domains/fixed-costs/FixedCostsView';
import { HomeView } from './domains/home/HomeView';
import { NotesView } from './domains/notes/NotesView';
import { PackingView } from './domains/packing/PackingView';
import { PhrasesView } from './domains/phrases/PhrasesView';
import { ScenarioDetailView } from './domains/scenarios/detail/ScenarioDetailView';
import { TodoView } from './domains/todo/TodoView';
import { TransportsView } from './domains/transports/TransportsView';

/*
  Mécanisme de cohabitation (Phase 0a, docs/react-migration-plan.md § 1) : REACT_VIEWS associe une
  clé de route à son composant. js/render.js teste `view in REACT_VIEWS` dans renderMain() et monte
  ici au lieu de son innerHTML habituel — le shell (sidebar, router) reste legacy jusqu'à la Phase 4.
*/
const REACT_VIEWS: Record<string, () => React.JSX.Element> = {
  hebergements: AccommodationsView,
  attractions: AttractionsView,
  cities: CitiesView,
  charges: FixedCostsView,
  transports: TransportsView,
  carte: MapView,
  notes: NotesView,
  'infos-utiles': CountryInfoView,
  accueil: HomeView,
  phrases: PhrasesView,
  valise: PackingView,
  'a-faire': TodoView,
  'scenario-detail': ScenarioDetailView,
};

let root: Root | null = null;
let mountedContainer: HTMLElement | null = null;
let mountedView: string | null = null;

/*
  js/render.js garde désormais #main comme un noeud stable (jamais recréé par innerHTML) — le root
  React peut donc persister d'un render() legacy à l'autre et se contenter d'un nouveau
  root.render(), comme React s'y attend. On ne recrée le root que si le conteneur a changé (jamais
  en pratique, #main ne bouge plus) ou si la vue change — passer de `cities` à `carte` doit repartir
  d'un arbre neuf, pas réconcilier deux composants sans rapport.
*/
function mountReactView(container: HTMLElement, viewKey: string): boolean {
  const Component = REACT_VIEWS[viewKey];
  if (!Component) return false;
  if (!root || container !== mountedContainer || viewKey !== mountedView) {
    root?.unmount();
    root = createRoot(container);
    mountedContainer = container;
    mountedView = viewKey;
  }
  root.render(<Component />);
  return true;
}

function unmountReactView(): void {
  root?.unmount();
  root = null;
  mountedContainer = null;
  mountedView = null;
}

window.REACT_VIEWS = REACT_VIEWS;
window.mountReactView = mountReactView;
window.unmountReactView = unmountReactView;
