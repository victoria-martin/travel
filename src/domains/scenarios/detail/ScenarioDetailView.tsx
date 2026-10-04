import { useTravelStore } from '@/store/useTravelStore';
import { useEffect } from 'react';
import { LegacyMarkup } from '@/shared/LegacyMarkup';

import { useScenarioMoney } from './hooks/useScenarioMoney';
import { useScenarioRoad } from './hooks/useScenarioRoad';
import { useScenarioRoute } from './hooks/useScenarioRoute';
import { RouteStrip } from './ScenarioDetailView/RouteStrip';
import { RouteTrail } from './ScenarioDetailView/RouteTrail';
import { ScenarioDetailHeader } from './ScenarioDetailView/ScenarioDetailHeader';
import { scenarioSplitColumns } from './ScenarioDetailView/scenarioSplitColumns';
import { ScenarioSidePanel } from './ScenarioDetailView/ScenarioSidePanel';
import { ScenarioSideTabsRail } from './ScenarioDetailView/ScenarioSideTabsRail';
import { ScenarioSplitHandle } from './ScenarioDetailView/ScenarioSplitHandle';
import { ScenarioSummary } from './ScenarioDetailView/ScenarioSummary';
import { ScenarioWeatherBanner } from './ScenarioDetailView/ScenarioWeatherBanner';
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

  return (
    <>
      <ScenarioDetailHeader scenario={scenario} money={money.total} />
      {window.weatherBannerShown() && <ScenarioWeatherBanner scenario={scenario} />}
      {window.trailShown() && (
        <>
          <RouteTrail scenario={scenario} />
          <RouteStrip scenario={scenario} route={route} />
        </>
      )}
      <div className="scenario-detail-cols" style={{ gridTemplateColumns: scenarioSplitColumns() }}>
        <div className="scenario-detail-main view-scroller">
          <StepList scenario={scenario} route={route} />
          <ScenarioSummary scenario={scenario} route={route} />
        </div>
        {sidePanelOpen && (
          <>
            <ScenarioSplitHandle />
            <ScenarioSidePanel scenario={scenario} total={money.total} />
          </>
        )}
        <ScenarioSideTabsRail scenarioId={scenario.id} />
      </div>
      <div className="sticky-footer">
        <div className="scenario-header-money">
          <span>Total: </span>
          {money.total.guestPoints > 0 && (
            <span>{window.formatGuestPoints(money.total.guestPoints)}</span>
          )}
          <strong className="scenario-header-total">{window.formatEuros(money.total.euros)}</strong>
        </div>
      </div>
    </>
  );
}
