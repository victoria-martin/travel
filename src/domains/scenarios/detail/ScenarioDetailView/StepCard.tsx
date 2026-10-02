import { useSortable } from '@dnd-kit/react/sortable';
import { Icon } from '../../../../shared/Icon';
import type { Scenario, Step } from '../../../../store/types';
import { ScenarioLegacyMarkup } from './ScenarioLegacyMarkup';

export function StepCard({
  scenario,
  step,
  rank,
  lane,
  sortIndex,
  arrival: suppliedArrival,
}: {
  scenario: Scenario;
  step: Step;
  rank: number | null;
  lane: string;
  sortIndex: number;
  arrival?: Date | null;
}) {
  const sortable = useSortable({
    id: step.id || `step-${sortIndex}`,
    index: sortIndex,
    type: 'scenario-step',
    accept: 'scenario-step',
    group: lane,
    data: { lane, sortIndex },
    disabled: !step.id,
  });
  const arrival =
    suppliedArrival === undefined
      ? rank === null
        ? null
        : window.stepArrival(scenario, rank)
      : suppliedArrival;
  const nights = window.stepNights(step);
  const displayedDate = arrival ? window.dateRangeLabel(arrival, nights) : step.arrivalDate;
  const stepId = step.id;
  const statusColor = step.hidden
    ? null
    : window.stepStatusInfo(window.stepStatus(scenario, step)).color;

  return (
    <article
      ref={sortable.ref}
      id={step.id ? `step-card-${step.id}` : undefined}
      className={`step-card${step.hidden ? ' step-card-hidden' : ''}${sortable.isDragging ? ' step-dragging' : ''}`}
      style={statusColor ? ({ '--step-color': statusColor } as React.CSSProperties) : undefined}
    >
      <div className="step-reorder">
        <div className="step-reorder-buttons">
          <button
            type="button"
            className="icon-btn step-move-btn"
            title="Monter"
            onClick={() => step.id && window.moveStep(scenario.id, step.id, -1)}
          >
            <Icon name="arrow-up" />
          </button>
          <button
            type="button"
            className="icon-btn step-move-btn"
            title="Descendre"
            onClick={() => step.id && window.moveStep(scenario.id, step.id, 1)}
          >
            <Icon name="arrow-down" />
          </button>
        </div>
        <button
          ref={sortable.handleRef}
          type="button"
          className="step-drag-handle"
          title="Glisser pour déplacer"
          aria-label={`Déplacer ${step.name || 'l’étape'}`}
        >
          ⠿
        </button>
      </div>
      <div className="step-main">
        <ScenarioLegacyMarkup html={window.stepOrderBadge(scenario, step, rank)} />
        <div className="step-body">
          <div className="step-title">
            <span
              className="editable"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Nom de l’étape…"
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                event.currentTarget.blur();
              }}
              onBlur={(event) => {
                if (!step.id) return;
                window.renameStep(scenario.id, step.id, event.currentTarget.innerText);
                window.render();
              }}
            >
              {step.name || ''}
            </span>
            <ScenarioLegacyMarkup html={window.stepPlaceSuffix(step)} />
            <span className="step-title-dates">{displayedDate}</span>
          </div>
          <ScenarioLegacyMarkup html={window.stepDetailLine(step)} />
          <div className="step-stay">
            <div className="step-acc">
              <ScenarioLegacyMarkup html={window.stepLine(scenario, step, arrival)} />
            </div>
            <ScenarioLegacyMarkup html={window.extrasBlock(scenario, step)} />
          </div>
        </div>
      </div>
      <div className="step-side">
        <ScenarioLegacyMarkup html={window.stepStatusBadge(scenario, step)} />
        <ScenarioLegacyMarkup html={window.stepMoney(scenario, step)} />
      </div>
      <div className="step-actions">
        <button
          type="button"
          className="icon-btn"
          title="Modifier"
          onClick={() => step.id && window.openModal('step', scenario.id, step.id)}
        >
          <Icon name="pencil" />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Dupliquer"
          onClick={() => step.id && window.duplicateStep(scenario.id, step.id)}
        >
          ⧉
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Masquer"
          onClick={() => step.id && window.toggleStepHidden(scenario.id, step.id)}
        >
          <Icon name={step.hidden ? 'eye-off' : 'eye'} />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Supprimer"
          onClick={() => step.id && window.deleteStep(scenario.id, step.id)}
        >
          <Icon name="trash-2" />
        </button>
      </div>
      {!step.groupId && stepId !== null && (
        <button
          type="button"
          className="icon-btn step-fork-btn"
          title="Comparer une autre option"
          onClick={() => window.makeStepGroup(scenario.id, stepId)}
        >
          <Icon name="plus" />
        </button>
      )}
    </article>
  );
}
