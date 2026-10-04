import { FieldRow } from '@/shared/layout/FieldRow';
import { ScenarioStepDropdown } from '@/shared/select/ScenarioStepDropdown';

// Links the place to a step from the place's own form; a place being created is saved silently first.
export function AttractionScenarioActions() {
  return (
    <FieldRow>
      <ScenarioStepDropdown
        className="attraction-scenario-dropdown"
        label="Ajouter à un scénario"
        onPick={(scenarioId, stepId) => window.attachAttractionToStep(scenarioId, stepId)}
      />
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => window.addAttractionToPlan()}
      >
        Ajouter au plan
      </button>
    </FieldRow>
  );
}
