import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { useEffect } from 'react';

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
