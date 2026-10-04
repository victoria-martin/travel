import { Icon } from '@/shared/Icon';
import { useTravelStore } from '@/store/useTravelStore';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CompareSection } from './ScenariosView/CompareSection';
import { ScenarioCard } from './ScenariosView/ScenarioCard';
import { scenarioRank } from './ScenariosView/utils';
import { matchesScenarioSearch } from './searchScenario';

/*
  Porte js/views/scenarios/{scenarios,header,list/list,list/row}.js. La bande d'itinéraire et les
  cartes de comparaison restent délégués (voir leurs fichiers) ; le reste — recherche, favoris,
  scénario choisi, comparer/archivés, actions de ligne — est du vrai React.
*/
export function ScenariosView() {
  const scenarios = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.scenarios)),
  );
  const [query, setQuery] = useState('');
  const compareMode = window.compareMode;
  const showArchived = window.showArchivedScenarios;

  const items = scenarios
    .filter((scenario) => !!scenario.archived === showArchived)
    .filter((scenario) => matchesScenarioSearch(scenario, query))
    .sort((a, b) => scenarioRank(a) - scenarioRank(b));
  const maxNights = Math.max(1, ...items.map((scenario) => window.totalNights(scenario)));

  // Port du useEffect d'origine dans renderScenariosView : les distances d'itinéraire (OSRM) des
  // scénarios comparés se résolvent de façon asynchrone, fillStepLegs relance un render() une fois
  // la réponse arrivée (routing.js).
  useEffect(() => {
    if (!compareMode) return;
    window.comparedScenarios(scenarios).forEach((scenario) => window.fillStepLegs(scenario));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareMode]);

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Scénarios</h2>
          <span className="view-sub">Compare différentes versions de ton itinéraire</span>
        </div>
        <div className="view-header-actions">
          <label className="list-search" title="Rechercher">
            <input
              type="search"
              placeholder="Rechercher…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button
            type="button"
            className={`btn btn-outline btn-small ${compareMode ? 'active' : ''}`}
            onClick={() => window.toggleCompareMode()}
          >
            <span className="toolbar-icon">
              <Icon name="logs" />
            </span>
            <span className="toolbar-label">Comparer</span>
          </button>
          <button
            type="button"
            className={`btn btn-outline btn-small ${showArchived ? 'active' : ''}`}
            onClick={() => window.toggleArchivedScenarios()}
          >
            <span className="toolbar-icon">
              <Icon name="archive" />
            </span>
            <span className="toolbar-label">Archivés</span>
          </button>
          <button type="button" className="btn btn-small" onClick={() => window.createScenario()}>
            <span className="toolbar-icon">
              <Icon name="plus" />
            </span>
            <span className="toolbar-label">Nouveau scénario</span>
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>{showArchived ? 'Aucun scénario archivé' : 'Aucun scénario'}</strong>
          {showArchived
            ? 'Archive un scénario pour le sortir de la liste.'
            : 'Crée un premier scénario pour poser tes étapes.'}
        </div>
      ) : (
        <>
          <div className="scenario-list">
            {items.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                maxNights={maxNights}
                compareMode={compareMode}
              />
            ))}
          </div>
          {compareMode && <CompareSection scenarios={items} />}
        </>
      )}
    </>
  );
}
