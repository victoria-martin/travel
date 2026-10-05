import { Icon } from '@/shared/Icon';
import { SettingsMenu } from '@/shared/settings/SettingsMenu';
import type { Scenario } from '@/store/types';
import { ScenarioDetailSettings } from './ScenarioDetailHeader/ScenarioDetailSettings';
import { ScenarioSideTabsButtons } from './ScenarioDetailHeader/ScenarioSideTabsButtons';
import { ScenarioWeatherToggle } from './ScenarioDetailHeader/ScenarioWeatherToggle';

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
        <div className="scenario-header-name-text">
          <button
            type="button"
            className="btn-outline btn btn-square"
            onClick={() => window.goTo('scenarios')}
          >
            <Icon name="arrow-left" />
          </button>
          {/* <IconButton icon="arrow-left" onClick={() => window.goTo('scenarios')} /> */}
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
          <button
            type="button"
            className="btn-outline btn btn-square"
            title={scenario.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            onClick={() => window.toggleScenarioFavorite(scenario.id)}
          >
            <Icon name="star" fill={scenario.favorite} />
          </button>
        </div>
      </div>

      <div className="view-header-actions">
        <ScenarioWeatherToggle />
        <span className="toolbar-separator" />
        <ScenarioSideTabsButtons scenarioId={scenario.id} />
        <span className="toolbar-separator" />
        {/* ICI */}
        <div className="test-red">
          <SettingsMenu>
            <ScenarioDetailSettings />
          </SettingsMenu>
        </div>
      </div>

      <div className="view-sub" style={{ marginLeft: 44 }}>
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
      </div>

      <div className="scenario-header-money">
        {money.guestPoints > 0 && <span>{window.formatGuestPoints(money.guestPoints)}</span>}
        <strong className="scenario-header-total">{window.formatEuros(money.euros)}</strong>
      </div>
    </div>
  );
}
