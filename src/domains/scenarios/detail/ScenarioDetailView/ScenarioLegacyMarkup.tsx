import { useEffect } from 'react';
import { LegacyMarkup } from '../../../../shared/LegacyMarkup';

export function ScenarioLegacyMarkup({
  html,
  initializeMaps = false,
}: {
  html: string;
  initializeMaps?: boolean;
}) {
  useEffect(() => {
    if (!initializeMaps) return;
    window.initScenarioDetailMaps();
    return () => window.destroyScenarioDetailMaps();
  }, [html, initializeMaps]);

  return <LegacyMarkup html={html} />;
}
