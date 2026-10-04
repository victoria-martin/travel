import type { Scenario } from '@/store/types';
import type { ScenarioRoute } from '../hooks/useScenarioRoute';
import { OfferBlock } from './OfferBlock';
import { LegacyMarkup } from '@/shared/LegacyMarkup';

export function ScenarioSummary({ scenario, route }: { scenario: Scenario; route: ScenarioRoute }) {
  const html = [
    window.scenarioTransportsBlock(scenario),
    window.scenarioExpensesBlock(scenario),
    window.scenarioTotalBlock(scenario),
  ].join(' ');

  return (
    <div className="scenario-detail-money">
      <OfferBlock scenario={scenario} />
      <LegacyMarkup html={html} />
      {route.status === 'error' && <p role="status">Tronçons routiers indisponibles.</p>}
    </div>
  );
}
