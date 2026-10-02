import { createRoot, type Root } from 'react-dom/client';
import { MapView } from './domains/carte/MapView';
import { CitiesView } from './domains/cities/CitiesView';
import { FixedCostsView } from './domains/fixed-costs/FixedCostsView';
import { TransportsView } from './domains/transports/TransportsView';

/*
  Mécanisme de cohabitation (Phase 0a, docs/react-migration-plan.md § 1) : REACT_VIEWS associe une
  clé de route à son composant. js/render.js teste `view in REACT_VIEWS` dans renderMain() et monte
  ici au lieu de son innerHTML habituel — le shell (sidebar, router) reste legacy jusqu'à la Phase 4.
*/
const REACT_VIEWS: Record<string, () => React.JSX.Element> = {
  cities: CitiesView,
  charges: FixedCostsView,
  transports: TransportsView,
  carte: MapView,
};

let root: Root | null = null;

/*
  js/render.js reconstruit TOUT #app (donc un #main flambant neuf) à chaque render() legacy, sans
  condition — pas seulement au changement de vue. Un root React créé une fois et réutilisé peint
  alors dans un #main détaché du DOM dès le render() suivant, invisible, pendant que le nouveau
  #main reste vide. Donc : toujours démonter et recréer le root sur le conteneur reçu, jamais le
  réutiliser d'un appel à l'autre — coûte l'état local React (un dropdown ouvert ailleurs, etc.) à
  chaque mutation qui redéclenche render(), mais c'est déjà le comportement du legacy partout
  ailleurs (tout re-rendu y perd déjà l'état DOM), donc pas une régression par rapport à lui.
*/
function mountReactView(container: HTMLElement, viewKey: string): boolean {
  const Component = REACT_VIEWS[viewKey];
  if (!Component) return false;
  root?.unmount();
  root = createRoot(container);
  root.render(<Component />);
  return true;
}

function unmountReactView(): void {
  root?.unmount();
  root = null;
}

window.REACT_VIEWS = REACT_VIEWS;
window.mountReactView = mountReactView;
window.unmountReactView = unmountReactView;
