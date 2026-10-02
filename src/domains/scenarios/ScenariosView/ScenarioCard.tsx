import { FavoriteCell } from '../../../shared/cells/FavoriteCell';
import { Icon } from '../../../shared/Icon';
import { LegacyMarkup } from '../../../shared/LegacyMarkup';
import type { Scenario } from '../../../store/types';

/*
  Port de scenarioRow (js/views/scenarios/list/row.js). La bande d'itinéraire
  (scenarioRouteBar) reste déléguée : purement visuelle, sans interaction propre, calculée depuis
  plusieurs dérivations legacy (nightsByPlace, placeStatus, stepStatusBackground) — la réécrire en
  React n'apporterait rien tant qu'elle n'a pas besoin d'évoluer.
*/
export function ScenarioCard({
  scenario,
  maxNights,
  compareMode,
}: {
  scenario: Scenario;
  maxNights: number;
  compareMode: boolean;
}) {
  const nights = window.totalNights(scenario);
  const count = window.visibleSteps(scenario).length;
  const total = window.scenarioTotal(scenario);
  const nightRate = nights ? `${window.formatEuros(total.euros / nights)}/nuit` : '';

  return (
    <div
      className={`scenario-card ${scenario.isChosen ? 'is-chosen' : ''}`}
      onClick={() =>
        compareMode
          ? window.toggleComparedScenario(scenario.id)
          : window.openScenario(scenario.id)
      }
    >
      <div className="scenario-card-body">
        <div className="scenario-card-head">
          {compareMode && (
            <input
              type="checkbox"
              className="scenario-compare-check"
              checked={window.isComparedScenario(scenario.id)}
              tabIndex={-1}
              aria-label={`Comparer ${scenario.name}`}
              readOnly
            />
          )}
          <span onClick={(event) => event.stopPropagation()}>
            <FavoriteCell
              favorite={scenario.favorite}
              onToggle={() => window.toggleScenarioFavorite(scenario.id)}
            />
          </span>
          <h4 className="scenario-card-name">{scenario.name}</h4>
          <button
            type="button"
            className={`scenario-chosen-pill ${scenario.isChosen ? 'is-chosen' : ''}`}
            title={scenario.isChosen ? 'Ne plus être le scénario choisi' : 'Scénario choisi'}
            onClick={(event) => {
              event.stopPropagation();
              window.setChosenScenario(scenario.id);
            }}
          >
            {scenario.isChosen ? (
              <>
                <Icon name="circle-check" /> choisi
              </>
            ) : (
              'choisir'
            )}
          </button>
        </div>
        <div className="scenario-card-meta">
          {window.nightsLabel(nights)} · {count} étape{count > 1 ? 's' : ''}
        </div>
        <LegacyMarkup html={window.scenarioRouteBar(scenario, maxNights)} />
      </div>
      <div className="scenario-card-money">
        <strong className="scenario-card-total">{window.formatEuros(total.euros)}</strong>
        {total.guestPoints > 0 && <span>{window.formatGuestPoints(total.guestPoints)}</span>}
        {nightRate && <span>{nightRate}</span>}
      </div>
      <div className="scenario-card-actions" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="icon-btn"
          title="Dupliquer"
          onClick={() => window.duplicateScenario(scenario.id)}
        >
          ⧉
        </button>
        <button
          type="button"
          className="icon-btn"
          title={scenario.archived ? 'Désarchiver' : 'Archiver'}
          onClick={() => window.toggleScenarioArchived(scenario.id)}
        >
          <Icon name={scenario.archived ? 'archive-restore' : 'archive'} />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Supprimer"
          onClick={() => window.deleteItem('scenarios', scenario.id)}
        >
          <Icon name="trash-2" />
        </button>
      </div>
    </div>
  );
}
