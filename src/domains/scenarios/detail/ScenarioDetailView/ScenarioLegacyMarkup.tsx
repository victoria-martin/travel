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

  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}
