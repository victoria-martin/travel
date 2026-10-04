import type { Scenario } from '@/store/types';
import { LegacyMarkup } from '@/shared/LegacyMarkup';

export function TransportsTab({ scenario }: { scenario: Scenario }) {
  return <LegacyMarkup html={window.scenarioTransportsRecap(scenario)} />;
}
