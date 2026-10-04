import type { Scenario } from '@/store/types';
import { SCENARIO_SIDE_TABS } from './scenarioSideTabs';

// The footer total stays whatever the tab: it is the figure people come for.
export function ScenarioSidePanel({
  scenario,
  total,
}: {
  scenario: Scenario;
  total: { euros: number; guestPoints: number };
}) {
  const tab = SCENARIO_SIDE_TABS.find(
    (candidate) => candidate.key === window.prefs.scenarioSidePanel,
  );
  if (!tab) return null;
  return (
    <aside className={`scenario-detail-side side-${tab.key}`}>
      <div className="side-panel">
        <tab.Body scenario={scenario} />
      </div>
      <div className="side-foot">
        <span className="side-foot-nights">{window.nightsLabel(window.totalNights(scenario))}</span>
        <strong>{window.formatCosts(total)}</strong>
      </div>
    </aside>
  );
}
