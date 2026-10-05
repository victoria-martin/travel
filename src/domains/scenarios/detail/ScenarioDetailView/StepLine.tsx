import { Icon } from '@/shared/Icon';
import { OutOfRangeBadge } from '@/shared/OutOfRangeBadge';
import type { Scenario, Step } from '@/store/types';
import { StepCheckInTime } from './StepLine/StepCheckInTime';
import { StepNightsDropdown } from './StepLine/StepNightsDropdown';
import { StepPlaceDropdown } from './StepLine/StepPlaceDropdown';
import { StepStatusDropdown } from './StepLine/StepStatusDropdown';
import { StepTypeDropdown } from './StepLine/StepTypeDropdown';

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
  const accommodation = window.getAccommodation(step.accommodationId);
  return (
    <>
      <StepTypeDropdown scenario={scenario} step={step} />
      <div className="step-place">
        <StepPlaceDropdown scenario={scenario} step={step} />
        {accommodation && (
          <button
            type="button"
            className="sheet-btn"
            title="Ouvrir la fiche"
            onClick={() => window.openAccommodationSheet(accommodation.id)}
          >
            <Icon name="arrow-up-right" />
          </button>
        )}
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
      {accommodation && <StepStatusDropdown accommodation={accommodation} />}
      <OutOfRangeBadge
        reason={
          accommodation
            ? window.stepOutOfRange(accommodation, arrival, window.stepNights(step))
            : null
        }
      />
      {accommodation && window.isBookedAccommodation(accommodation) && (
        <StepCheckInTime accommodation={accommodation} />
      )}
      <StepNightsDropdown scenario={scenario} step={step} />
    </>
  );
}
