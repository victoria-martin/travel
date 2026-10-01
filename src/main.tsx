import { createRoot, type Root } from 'react-dom/client';
import { CitiesView } from './domains/cities/CitiesView';
import { FixedCostsView } from './domains/fixed-costs/FixedCostsView';
import { TransportsView } from './domains/transports/TransportsView/TransportsView';

/*
  Mécanisme de cohabitation (Phase 0a, docs/react-migration-plan.md § 1) : REACT_VIEWS associe une
  clé de route à son composant. js/render.js teste `view in REACT_VIEWS` dans renderMain() et monte
  ici au lieu de son innerHTML habituel — le shell (sidebar, router) reste legacy jusqu'à la Phase 4.
*/
const REACT_VIEWS: Record<string, () => React.JSX.Element> = {
  cities: CitiesView,
  charges: FixedCostsView,
  transports: TransportsView,
};

let root: Root | null = null;
let mountedView: string | null = null;

function mountReactView(container: HTMLElement, viewKey: string): boolean {
  const Component = REACT_VIEWS[viewKey];
  if (!Component) return false;
  if (mountedView !== viewKey) {
    root?.unmount();
    container.innerHTML = '';
    root = createRoot(container);
    mountedView = viewKey;
  }
  root!.render(<Component />);
  return true;
}

function unmountReactView(): void {
  root?.unmount();
  root = null;
  mountedView = null;
}

window.REACT_VIEWS = REACT_VIEWS;
window.mountReactView = mountReactView;
window.unmountReactView = unmountReactView;
