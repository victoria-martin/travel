import { SettingsMenu } from '@/shared/menu/SettingsMenu';
import type { Scenario } from '@/store/types';
import { ScenarioBackButton } from './ScenarioDetailHeader/ScenarioBackButton';
import { ScenarioDetailSettings } from './ScenarioDetailHeader/ScenarioDetailSettings';
import { ScenarioDetailSub } from './ScenarioDetailHeader/ScenarioDetailSub';
import { ScenarioFavoriteButton } from './ScenarioDetailHeader/ScenarioFavoriteButton';
import { ScenarioHeaderMoney } from './ScenarioDetailHeader/ScenarioHeaderMoney';
import { ScenarioNameTitle } from './ScenarioDetailHeader/ScenarioNameTitle';
import { ScenarioSideTabsButtons } from './ScenarioDetailHeader/ScenarioSideTabsButtons';
import { ScenarioWeatherToggle } from './ScenarioDetailHeader/ScenarioWeatherToggle';

export function ScenarioDetailHeader({
  scenario,
  money,
}: {
  scenario: Scenario;
  money: { euros: number; guestPoints: number };
}) {
  return (
    <div className="view-header scenario-header">
      <div className="scenario-header-identity">
        <div className="scenario-header-name-text">
          <ScenarioBackButton />
          {/* <IconButton icon="arrow-left" onClick={() => window.goTo('scenarios')} /> */}
          <ScenarioNameTitle scenario={scenario} />
          <ScenarioFavoriteButton scenario={scenario} />
        </div>
      </div>

      <div className="view-header-actions">
        <ScenarioWeatherToggle />
        <span className="toolbar-separator" />
        <ScenarioSideTabsButtons scenarioId={scenario.id} />
        <span className="toolbar-separator" />
        <SettingsMenu>
          <ScenarioDetailSettings />
        </SettingsMenu>
      </div>

      <ScenarioDetailSub scenario={scenario} />

      <ScenarioHeaderMoney money={money} />
    </div>
  );
}
