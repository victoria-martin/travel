import { Icon } from '@/shared/Icon';
import type { Scenario, StepGroup, StepGroupOption } from '@/store/types';
import type { ScenarioRoute } from '../hooks/useScenarioRoute';
import { StepCard } from './StepCard';
import { StepLeg } from './StepLeg';

export function OptionColumn({
  scenario,
  group,
  option,
  ranks,
  route,
}: {
  scenario: Scenario;
  group: StepGroup;
  option: StepGroupOption;
  ranks: Map<string, number>;
  route: ScenarioRoute;
}) {
  const steps = window.optionSteps(scenario, option.id);
  const cost = window.optionCost(scenario, option);
  const optionIndex = window
    .groupOptions(group)
    .findIndex((candidate) => candidate.id === option.id);
  let nightsBefore = 0;
  const arrivals = steps.map((step) => {
    const arrival = window.dateAfter(window.groupArrival(scenario, group), nightsBefore);
    nightsBefore += window.stepNights(step);
    return arrival;
  });

  return (
    <div
      className={`option-column${option.isSelected ? ' option-column-chosen' : ''}`}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest(
            'button, a, input, textarea, select, summary, [contenteditable="true"]',
          )
        )
          return;
        window.chooseGroupOption(scenario.id, group.id, option.id);
      }}
    >
      <div className="option-head">
        <button
          type="button"
          className={`option-chosen${option.isSelected ? ' option-chosen-on' : ''}`}
          title={option.isSelected ? 'Ne plus retenir cette colonne' : 'Retenir cette colonne'}
          onClick={() => window.chooseGroupOption(scenario.id, group.id, option.id)}
        >
          <Icon name={option.isSelected ? 'circle-dot' : 'circle'} />
        </button>
        {window.groupOptions(group).length > 2 ? (
          <button
            type="button"
            className="icon-btn option-remove"
            title="Retirer cette colonne et ses étapes"
            onClick={() => window.removeGroupOption(scenario.id, group.id, option.id)}
          >
            <Icon name="x" />
          </button>
        ) : (
          <span>Option {optionIndex + 1}</span>
        )}
      </div>
      {steps.map((step, stepIndex) => (
        <div key={step.id || `${option.id}-${stepIndex}`}>
          {stepIndex > 0 && (
            <div className="step-gap">
              <StepLeg scenario={scenario} step={step} route={route} />
            </div>
          )}
          <StepCard
            scenario={scenario}
            step={step}
            rank={step.id ? (ranks.get(step.id) ?? null) : null}
            lane={option.id}
            sortIndex={stepIndex}
            arrival={arrivals[stepIndex]}
          />
          <div className="step-gap">
            {stepIndex === steps.length - 1 && (
              <button
                type="button"
                className="icon-btn"
                title="Insérer une étape dans cette option"
                onClick={() =>
                  window.insertOptionStep(scenario.id, scenario.steps.indexOf(step) + 1, option.id)
                }
              >
                <Icon name="plus" />
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="option-foot">
        <span className="option-foot-nights">
          {steps.reduce((total, step) => total + window.stepNights(step), 0)} nuits
        </span>
        <strong>{window.formatCosts(cost)}</strong>
      </div>
      {window.groupOptions(group).length <= 2 && (
        <button
          type="button"
          className="inline-tag option-keep"
          title="Terminer la comparaison et garder cette colonne"
          onClick={() => window.keepGroupOption(scenario.id, group.id, option.id)}
        >
          Garder celle-ci
        </button>
      )}
    </div>
  );
}
