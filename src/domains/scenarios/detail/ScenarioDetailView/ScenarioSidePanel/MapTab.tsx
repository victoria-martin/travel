import { LegacyMarkup } from '@/shared/LegacyMarkup';
import type { Scenario } from '@/store/types';
import { useEffect, useId } from 'react';

export function MapTab({ scenario }: { scenario: Scenario }) {
  // The side panel and the mobile sheet can both hold a map: each canvas needs its own id.
  const canvasId = `scenario-map-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    window.initScenarioDetailMaps();
    return () => window.destroyScenarioDetailMaps();
  }, [scenario]);

  return <LegacyMarkup html={window.scenarioMapBlock(scenario, canvasId)} />;
}
