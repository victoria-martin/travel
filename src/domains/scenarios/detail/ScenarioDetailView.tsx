import { useEffect } from 'react';
import { useTravelStore } from '../../../store/useTravelStore';
import { ScenarioLegacyMarkup } from './ScenarioDetailView/ScenarioLegacyMarkup';

import { useScenarioMoney } from './hooks/useScenarioMoney';
import { useScenarioRoad } from './hooks/useScenarioRoad';
import { useScenarioRoute } from './hooks/useScenarioRoute';
import { ScenarioDetailHeaderNew } from './ScenarioDetailView/ScenarioDetailHeaderNew';
import { ScenarioSummary } from './ScenarioDetailView/ScenarioSummary';
import { StepList } from './ScenarioDetailView/StepList';

export function ScenarioDetailView() {
  const store = useTravelStore();
  const scenarioId = window.getActiveScenarioId();
  const scenario = store.data.scenarios.find((candidate) => candidate.id === scenarioId) ?? null;

  useEffect(() => {
    if (!scenario) window.goTo('scenarios');
  }, [scenario]);

  const money = useScenarioMoney(scenario);
  const road = useScenarioRoad(scenario);
  const route = useScenarioRoute(scenario, road.points);

  if (!scenario) return <></>;
  const sidePanelOpen = !!window.prefs.scenarioSidePanel;
  const splitStyle = window
    .scenarioSplitStyle()
    .replace(/^grid-template-columns:\s*/, '')
    .replace(/;$/, '');

  return (
    <>
      <ScenarioDetailHeaderNew scenario={scenario} money={money.total} />
      <ScenarioLegacyMarkup html={window.scenarioWeatherBanner(scenario)} />
      {window.trailShown() && (
        <>
          <ScenarioLegacyMarkup html={window.scenarioRouteTrail(scenario)} />
          <ScenarioLegacyMarkup html={window.scenarioRouteStrip(scenario)} />
        </>
      )}
      <div className="scenario-detail-cols" style={{ gridTemplateColumns: splitStyle }}>
        <div className="scenario-detail-main view-scroller">
          <StepList scenario={scenario} route={route} />
          <ScenarioSummary scenario={scenario} route={route} />
        </div>
        {sidePanelOpen && (
          <>
            <ScenarioLegacyMarkup html={window.scenarioSplitHandle()} />
            <ScenarioLegacyMarkup html={window.scenarioSidePanel(scenario)} initializeMaps />
          </>
        )}
        <ScenarioLegacyMarkup html={window.scenarioSideTabsRail(scenario.id)} />
      </div>
    </>
  );
}
