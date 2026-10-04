import type { Scenario, Step, StepGroup } from '@/store/types';
import { ExtraAddDropdown } from './ExtraAddDropdown';

export function ExtraAddRow({
  scenario,
  holder,
}: {
  scenario: Scenario;
  holder: Step | StepGroup;
}) {
  const total = window.extrasTotal(holder);
  return (
    <div className="step-extra-row">
      <ExtraAddDropdown scenario={scenario} holder={holder} />
      <span />
      <span className="step-total">
        <span className="step-budget">{total ? window.formatEuros(total) : ''}</span>
      </span>
    </div>
  );
}
