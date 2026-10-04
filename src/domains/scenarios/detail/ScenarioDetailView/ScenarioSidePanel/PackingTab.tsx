import { LegacyMarkup } from '@/shared/LegacyMarkup';

export function PackingTab() {
  return <LegacyMarkup html={window.scenarioPackingBlock()} />;
}
