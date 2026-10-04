import type { Scenario, Step } from '@/store/types';
import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { StepNightsDropdown } from './StepLine/StepNightsDropdown';
import { StepPlaceDropdown } from './StepLine/StepPlaceDropdown';
import { StepTypeDropdown } from './StepLine/StepTypeDropdown';

/*
  stepStatusTag/stepAvailabilityTag/stepCheckInTimeTag/stepSheetButton délèguent à des fonctions
  (accommodationStatusTag, outOfRangeIndicator…) elles-mêmes pas encore portées, donc restent en
  LegacyMarkup.
*/
export function StepLine({
  scenario,
  step,
  arrival,
}: {
  scenario: Scenario;
  step: Step;
  arrival: Date | null;
}) {
  const stepId = step.id;
  return (
    <>
      <StepTypeDropdown scenario={scenario} step={step} />
      <div className="step-place">
        <StepPlaceDropdown scenario={scenario} step={step} />
        <LegacyMarkup html={window.stepSheetButton(step)} />
        {step.attractionId && stepId ? (
          <input
            className="step-place-date"
            type="date"
            value={step.placeDate || ''}
            onChange={(event) => window.setStepPlaceDate(scenario.id, stepId, event.target.value)}
            aria-label="Date du lieu"
          />
        ) : null}
      </div>
      <LegacyMarkup html={window.stepStatusTag(step)} />
      <LegacyMarkup html={window.stepAvailabilityTag(step, arrival)} />
      <LegacyMarkup html={window.stepCheckInTimeTag(step)} />
      <StepNightsDropdown scenario={scenario} step={step} />
    </>
  );
}
