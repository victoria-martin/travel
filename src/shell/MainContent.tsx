import { AccommodationsView } from '../domains/accommodations/AccommodationsView';
import { AttractionsView } from '../domains/attractions/AttractionsView';
import { MapView } from '../domains/carte/MapView';
import { CitiesView } from '../domains/cities/CitiesView';
import { CountryInfoView } from '../domains/country-info/CountryInfoView';
import { ExpensesView } from '../domains/expenses/ExpensesView';
import { HomeView } from '../domains/home/HomeView';
import { JournalView } from '../domains/journal/JournalView';
import { NotesView } from '../domains/notes/NotesView';
import { PackingView } from '../domains/packing/PackingView';
import { ScenariosView } from '../domains/scenarios/ScenariosView';
import { ScenarioDetailView } from '../domains/scenarios/detail/ScenarioDetailView';
import { TodoView } from '../domains/todo/TodoView';
import { TranslationsView } from '../domains/translations/TranslationsView';
import { TransportsView } from '../domains/transports/TransportsView';

/*
  Point de bascule du strangler fig, maintenant côté React (remplace window.REACT_VIEWS +
  mountReactView/renderMain, inutiles depuis que #app entier est un seul root React — plus besoin
  d'un second root imbriqué dans #main). Toutes les vues de js/router.js (VIEWS) ont désormais une
  entrée ici ; les fragments complexes qu'une vue délègue encore (RouteBuilderPanel, le builder À
  faire, le panneau du jour du Journal…) restent internes au composant de cette vue.
*/
const VIEWS: Record<string, () => React.JSX.Element> = {
  hebergements: AccommodationsView,
  attractions: AttractionsView,
  cities: CitiesView,
  transports: TransportsView,
  scenarios: ScenariosView,
  carte: MapView,
  notes: NotesView,
  'infos-utiles': CountryInfoView,
  accueil: HomeView,
  phrases: TranslationsView,
  valise: PackingView,
  'a-faire': TodoView,
  journal: JournalView,
  depenses: ExpensesView,
  'scenario-detail': ScenarioDetailView,
};

export function MainContent() {
  const view = window.getCurrentView();
  const Component = VIEWS[view];

  return (
    <main id="main" className="main">
      {Component && <Component />}
    </main>
  );
}
