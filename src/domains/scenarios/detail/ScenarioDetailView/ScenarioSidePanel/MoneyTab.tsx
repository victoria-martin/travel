import type { Scenario } from '@/store/types';
import { LegacyMarkup } from '@/shared/LegacyMarkup';

export function MoneyTab({ scenario }: { scenario: Scenario }) {
  const html = [
    window.scenarioOfferBlock(scenario),
    window.scenarioTransportsBlock(scenario),
    window.scenarioExpensesBlock(scenario),
    window.scenarioTotalBlock(scenario),
  ].join('');
  return <LegacyMarkup html={html} />;
}
