import type { Scenario } from '@/store/types';
import type { ScenarioRoute } from '../hooks/useScenarioRoute';
import { OfferBlock } from './OfferBlock';
import { ExpensesBlock } from './ExpensesBlock';
import { TransportsBlock } from './TransportsBlock';
import { LegacyMarkup } from '@/shared/LegacyMarkup';

export function ScenarioSummary({ scenario, route }: { scenario: Scenario; route: ScenarioRoute }) {
  return (
    <div className="scenario-detail-money">
      <OfferBlock scenario={scenario} />
      <TransportsBlock scenario={scenario} />
      <ExpensesBlock scenario={scenario} />
      <LegacyMarkup html={window.scenarioTotalBlock(scenario)} />
      {route.status === 'error' && <p role="status">Tronçons routiers indisponibles.</p>}
    </div>
  );
}
