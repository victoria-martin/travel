import type { Scenario, Step, StepGroup } from '@/store/types';
import { ExtraAddRow } from './ExtrasBlock/ExtraAddRow';
import { ExtraRow } from './ExtrasBlock/ExtraRow';

export function ExtrasBlock({
  scenario,
  holder,
}: {
  scenario: Scenario;
  holder: Step | StepGroup;
}) {
  return (
    <div className="step-extras">
      {window.holderExtras(holder).map((line) => (
        <ExtraRow key={line.id} scenario={scenario} holder={holder} line={line} />
      ))}
      <ExtraAddRow scenario={scenario} holder={holder} />
    </div>
  );
}
