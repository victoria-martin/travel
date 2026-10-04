import { scenarioRailHidden } from '../scenarioRailHidden';
import { scenarioSplitColumns } from '../scenarioSplitColumns';
import { SCENARIO_SPLIT_SIZES } from '../scenarioSplitSizes';

// Dragging writes the grid on the element instead of re-rendering: a render per pixel would remount Leaflet.
export function startScenarioSplit(event: React.PointerEvent<HTMLDivElement>) {
  const columns = event.currentTarget.closest<HTMLElement>('.scenario-detail-cols');
  const tabKey = window.prefs.scenarioSidePanel;
  if (!columns || !tabKey) return;
  event.currentTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
  const box = columns.getBoundingClientRect();
  const minPercent = (SCENARIO_SPLIT_SIZES.minPx / box.width) * 100;
  const maxPercent = ((box.width - SCENARIO_SPLIT_SIZES.minPx) / box.width) * 100;

  const onMove = (move: PointerEvent) => {
    const rail = scenarioRailHidden() ? 0 : SCENARIO_SPLIT_SIZES.railPx;
    const percent = ((box.right - rail - move.clientX) / box.width) * 100;
    window.prefs.scenarioSideWidth[tabKey] = Math.min(Math.max(percent, minPercent), maxPercent);
    columns.style.gridTemplateColumns = scenarioSplitColumns();
    window.invalidateScenarioDetailMaps();
  };
  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    window.persistPrefs();
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp, { once: true });
}
