import { startScenarioSplit } from './ScenarioSplitHandle/startScenarioSplit';

export function ScenarioSplitHandle() {
  return (
    <div
      className="scenario-split"
      role="separator"
      aria-orientation="vertical"
      onPointerDown={startScenarioSplit}
    />
  );
}
