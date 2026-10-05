import { useState } from 'react';

type RoutePoint = { id: string; name: string };
type Choice = 'new-step' | 'replace' | 'new-scenario';

// An accommodation of the drawn route cannot be an extra: it becomes a step somewhere, decided here.
export function RouteAccommodationForm({
  scenarioId,
  stepId,
  points,
  onClose,
}: {
  scenarioId: string;
  stepId: string | null;
  points: RoutePoint[];
  onClose: () => void;
}) {
  const [choice, setChoice] = useState<Choice>('new-step');
  const [sourceId, setSourceId] = useState(scenarioId);
  const step = stepId ? window.getStep(scenarioId, stepId) : null;
  const canReplace = points.length === 1 && !!step;
  const scenarios = window.activeScenarios(window.ofCurrentTravel(window.state.scenarios));
  const options: { value: Choice; label: string; shown: boolean }[] = [
    {
      value: 'new-step',
      label: `Créer ${points.length > 1 ? 'de nouvelles étapes' : 'une nouvelle étape'}`,
      shown: true,
    },
    {
      value: 'replace',
      label: `Remplacer l’hébergement de « ${step?.name || 'l’étape'} »`,
      shown: canReplace,
    },
    { value: 'new-scenario', label: 'Créer un nouveau scénario', shown: true },
  ];
  return (
    <div
      className="modal modal-ask route-acc-ask"
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
    >
      <h3>
        {points.length > 1
          ? `${points.length} hébergements dans l’itinéraire`
          : 'Un hébergement dans l’itinéraire'}
      </h3>
      <div className="route-acc-choice">
        {options
          .filter((option) => option.shown)
          .map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="route-acc-choice"
                checked={choice === option.value}
                onChange={() => setChoice(option.value)}
              />
              {option.label}
            </label>
          ))}
      </div>
      {choice === 'new-scenario' && (
        <div className="field">
          <label htmlFor="route-scenario-source">À partir de</label>
          <select
            id="route-scenario-source"
            value={sourceId}
            onChange={(event) => setSourceId(event.target.value)}
          >
            <option value="">Scénario vierge</option>
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                Dupliquer « {scenario.name} »
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Annuler
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            onClose();
            window.applyRouteAccommodationChoice(scenarioId, stepId, points, choice, sourceId);
          }}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
