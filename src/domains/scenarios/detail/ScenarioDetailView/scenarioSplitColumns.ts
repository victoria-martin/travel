import { scenarioRailHidden } from './scenarioRailHidden';
import { SCENARIO_SPLIT_SIZES } from './scenarioSplitSizes';

// Each tab keeps its own width: the map opens wide, the money narrow.
export function scenarioSplitColumns(): string {
  const rail = scenarioRailHidden() ? '' : ` ${SCENARIO_SPLIT_SIZES.railPx}px`;
  const tabKey = window.prefs.scenarioSidePanel;
  if (!tabKey) return `minmax(0, 1fr)${rail}`;
  const percent = window.prefs.scenarioSideWidth[tabKey] ?? 50;
  return `minmax(0, 1fr) ${SCENARIO_SPLIT_SIZES.handlePx}px ${percent}%${rail}`;
}
