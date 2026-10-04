import { Icon } from '@/shared/Icon';
import type { Scenario, Step } from '@/store/types';
import { useSortable } from '@dnd-kit/react/sortable';
import { ExtrasBlock } from './ExtrasBlock';
import { ScenarioLegacyMarkup } from './ScenarioLegacyMarkup';
import { StepLine } from './StepLine';

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
        <StepOrderBadge scenario={scenario} step={step} rank={rank} />
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
            <StepPlaceSuffix step={step} />
            <span className="step-title-dates">{displayedDate}</span>
          </div>
          <StepDetailLine step={step} />
          <div className="step-stay">
            <div className="step-acc">
              <StepLine scenario={scenario} step={step} arrival={arrival} />
            </div>
            <ExtrasBlock scenario={scenario} holder={step} />
          </div>
        </div>
      </div>
      <div className="step-side">
        <StepStatusBadge scenario={scenario} step={step} />
        <StepMoney scenario={scenario} step={step} />
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

function StepOrderBadge({
  scenario,
  step,
  rank,
}: {
  scenario: Scenario;
  step: Step;
  rank: number | null;
}) {
  if (rank === null) {
    return (
      <div
        className="step-order step-order-hidden"
        title={`${window.stepOutReason(scenario, step)} — hors des dates, des totaux et de la carte`}
      >
        •
      </div>
    );
  }
  if (window.coordsFor(step)) {
    return <div className="step-order">{window.stepLetter(rank)}</div>;
  }
  return (
    <div
      className="step-order step-order-unmapped"
      title="Pas de lieu géolocalisé — absente de la carte"
    >
      {window.stepLetter(rank)}
    </div>
  );
}

const STEP_TITLE_LEVELS: Array<'city' | 'region'> = ['city', 'region'];

function StepPlaceSuffix({ step }: { step: Step }) {
  const place = window.stepPlace(step);
  if (!place) return null;
  const alreadySaid = [step.name, place.name].join(' ').toLowerCase();
  const levels = STEP_TITLE_LEVELS.map((key) => place[key]).filter(
    (value) => value && !alreadySaid.includes(value.toLowerCase()),
  );
  if (!levels.length) return null;
  return (
    <>
      {' '}
      <span className="step-title-place">· {levels.reverse().join(' · ')}</span>
    </>
  );
}

function StepDetailLine({ step }: { step: Step }) {
  const parts = [step.arrivalDate ? `arrivée le ${step.arrivalDate}` : '', step.notes || ''].filter(
    Boolean,
  );
  if (!parts.length) return null;
  return <div className="step-detail">{parts.join(' · ')}</div>;
}

function StepStatusBadge({ scenario, step }: { scenario: Scenario; step: Step }) {
  const status = window.stepStatusInfo(window.stepStatus(scenario, step));
  return (
    <span className="step-status" title="Statut déduit de celui de l’hébergement choisi">
      {status.emoji} {status.label}
    </span>
  );
}

function StepMoney({ scenario, step }: { scenario: Scenario; step: Step }) {
  const acc = window.getAccommodation(step.accommodationId);
  const auto = window.stepAccommodationCost(step);
  const hasBudget = window.hasStepBudget(step);
  return (
    <span className="step-total">
      {!hasBudget && auto ? (
        <span className="step-total-auto">{window.formatAccommodationCost(acc, auto)}</span>
      ) : null}
      <span className={`step-budget${hasBudget ? ' step-budget-set' : ''}`}>
        <span
          className="editable"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Budget…"
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            event.currentTarget.blur();
          }}
          onBlur={(event) => {
            if (!step.id) return;
            window.setStepBudget(scenario.id, step.id, event.currentTarget.innerText);
          }}
        >
          {step.budget || ''}
        </span>
        {hasBudget ? ' €' : ''}
      </span>
    </span>
  );
}
