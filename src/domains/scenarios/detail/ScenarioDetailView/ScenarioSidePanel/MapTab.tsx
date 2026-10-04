import { LegacyMarkup } from '@/shared/LegacyMarkup';
import type { Scenario } from '@/store/types';
import { useEffect } from 'react';

export function MapTab({ scenario }: { scenario: Scenario }) {
  useEffect(() => {
    window.initScenarioDetailMaps();
    return () => window.destroyScenarioDetailMaps();
  }, [scenario]);

  return <LegacyMarkup html={window.scenarioMapBlock(scenario, 'scenario-side-map')} />;
}
