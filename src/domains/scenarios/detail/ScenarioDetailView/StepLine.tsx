import type { Scenario, Step } from '@/store/types';
import { ScenarioLegacyMarkup } from './ScenarioLegacyMarkup';
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
        <ScenarioLegacyMarkup html={window.stepSheetButton(step)} />
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
      <ScenarioLegacyMarkup html={window.stepStatusTag(step)} />
      <ScenarioLegacyMarkup html={window.stepAvailabilityTag(step, arrival)} />
      <ScenarioLegacyMarkup html={window.stepCheckInTimeTag(step)} />
      <StepNightsDropdown scenario={scenario} step={step} />
    </>
  );
}
