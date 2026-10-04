import type { Scenario } from '@/store/types';
import { ExtraRecapRow } from './ExtraRecapRow';

// A line set on several steps reads several times: one visit per step.
export function AttractionDetailRows({ scenario }: { scenario: Scenario }) {
  return (
    <>
      {window.scenarioAttractionLines(scenario).map((line) => (
        <ExtraRecapRow key={line.id} line={line} />
      ))}
    </>
  );
}
