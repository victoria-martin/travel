import { Button } from '@/shared/buttons/Button';
import { Icon } from '@/shared/Icon';
import { SCENARIO_SIDE_TABS } from './scenarioSideTabs';

// Duplicates the header buttons on the right edge, to compare both placements in use.
export function ScenarioSideTabsRail({ scenarioId }: { scenarioId: string }) {
  const active = window.prefs.scenarioSidePanel;
  return (
    <nav className="scenario-side-rail">
      {SCENARIO_SIDE_TABS.map((tab) => (
        <Button
          key={tab.key}
          size="small"
          title={tab.label}
          ariaLabel={tab.label}
          className={tab.key === active ? 'active' : ''}
          onClick={() => window.onScenarioPanelToggle(scenarioId, tab.key)}
        >
          <span className="toolbar-icon">
            <Icon name={tab.icon} />
          </span>
        </Button>
      ))}
    </nav>
  );
}
