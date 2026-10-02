import { useEffect, useRef } from 'react';
import { AccommodationsView } from '../domains/accommodations/AccommodationsView';
import { AttractionsView } from '../domains/attractions/AttractionsView';
import { MapView } from '../domains/carte/MapView';
import { CitiesView } from '../domains/cities/CitiesView';
import { CountryInfoView } from '../domains/country-info/CountryInfoView';
import { ExpensesView } from '../domains/expenses/ExpensesView';
import { FixedCostsView } from '../domains/fixed-costs/FixedCostsView';
import { HomeView } from '../domains/home/HomeView';
import { JournalView } from '../domains/journal/JournalView';
import { NotesView } from '../domains/notes/NotesView';
import { PackingView } from '../domains/packing/PackingView';
import { PhrasesView } from '../domains/phrases/PhrasesView';
import { ScenarioDetailView } from '../domains/scenarios/detail/ScenarioDetailView';
import { TodoView } from '../domains/todo/TodoView';
import { TransportsView } from '../domains/transports/TransportsView';
import { LegacyMarkup } from '../shared/LegacyMarkup';
import type { Scenario } from '../store/types';

/*
  Point de bascule du strangler fig, maintenant côté React (remplace window.REACT_VIEWS +
  mountReactView/renderMain, inutiles depuis que #app entier est un seul root React — plus besoin
  d'un second root imbriqué dans #main). `scenarios` (la liste, pas le détail) est la seule vue
  encore 100 % legacy, déléguée comme n'importe quel fragment complexe non prioritaire.
*/
const VIEWS: Record<string, () => React.JSX.Element> = {
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
  journal: JournalView,
  depenses: ExpensesView,
  'scenario-detail': ScenarioDetailView,
};

export function MainContent() {
  const view = window.getCurrentView();
  const Component = VIEWS[view];
  const compareMode = view === 'scenarios' && window.compareMode;
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!compareMode) return;
    const scenarios: Scenario[] = window.ofCurrentTravel(window.state.scenarios);
    window.comparedScenarios(scenarios).forEach((scenario) => window.fillStepLegs(scenario));
  }, [compareMode]);

  // Port de trackViewHeaderHeight (js/render.js) : les blocs collants sous l'en-tête se décalent
  // de sa hauteur, qui change avec la largeur de fenêtre.
  useEffect(() => {
    const main = mainRef.current;
    const header = main?.querySelector('.view-header');
    if (!main) return;
    if (!header) {
      main.style.setProperty('--view-header-h', '0px');
      return;
    }
    const observer = new ResizeObserver(() =>
      main.style.setProperty('--view-header-h', `${(header as HTMLElement).offsetHeight}px`),
    );
    observer.observe(header);
    return () => observer.disconnect();
  });

  return (
    <main id="main" className="main" ref={mainRef}>
      {Component ? <Component /> : <LegacyMarkup html={window.renderScenariosView()} />}
    </main>
  );
}
