import { Icon } from '../../../../shared/Icon';
import type { Scenario } from '../../../../store/types';
import { ScenarioLegacyMarkup } from './ScenarioLegacyMarkup';

export function ScenarioDetailHeader({
  scenario,
  money,
}: {
  scenario: Scenario;
  money: { euros: number; guestPoints: number };
}) {
  const visibleCount = scenario.steps.filter((step) => window.isStepVisible(scenario, step)).length;
  const nights = window.totalNights(scenario);

  return (
    <div className="view-header scenario-header">
      <div className="scenario-header-identity">
        <div className="scenario-header-name">
          <button
            type="button"
            className="btn-ghost btn btn-small back-link"
            onClick={() => window.goTo('scenarios')}
          >
            <Icon name="arrow-left" />
            {/* Tous les scénarios */}
          </button>
          <div className="scenario-header-name-text">
            <h2 className="view-title">
              <span
                className="editable"
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Nom du scénario…"
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return;
                  event.preventDefault();
                  event.currentTarget.blur();
                }}
                onBlur={(event) => {
                  window.renameScenario(scenario.id, event.currentTarget.innerText);
                  window.render();
                }}
              >
                {scenario.name}
              </span>
            </h2>
            <p className="view-sub">
              <input
                className="scenario-start-date"
                type="date"
                value={scenario.startDate || ''}
                aria-label="Date de départ du scénario"
                onChange={(event) => window.setScenarioStartDate(scenario.id, event.target.value)}
              />
              {' · '}
              {visibleCount} étape{visibleCount > 1 ? 's' : ''} · {nights} nuit
              {nights === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            className="icon-btn"
            title={scenario.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={() => window.toggleScenarioFavorite(scenario.id)}
          >
            <Icon name="star" fill={scenario.favorite} />
          </button>
        </div>
      </div>
      <div className="view-header-actions">
        <ScenarioLegacyMarkup
          html={`${window.scenarioWeatherToggleButton()} ${window.toolbarSeparator()} ${window.scenarioSideTabsButtons(scenario.id)} ${window.toolbarSeparator()} ${window.toolbarMenu()}`}
        />
      </div>
      <div className="scenario-header-money">
        {money.guestPoints > 0 && <span>{window.formatGuestPoints(money.guestPoints)}</span>}
        <strong className="scenario-header-total">{window.formatEuros(money.euros)}</strong>
      </div>
    </div>
  );
}
