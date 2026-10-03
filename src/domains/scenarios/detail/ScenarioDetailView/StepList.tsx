import * as dnd from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { Fragment } from 'react';
import { Icon } from '../../../../shared/Icon';
import type { Scenario, Step, StepGroup } from '../../../../store/types';
import type { ScenarioRoute } from '../hooks/useScenarioRoute';
import { StepCard } from './StepCard';
import { StepGroupView } from './StepGroupView';
import { StepLeg } from './StepLeg';

interface StepRow {
  kind: 'step' | 'group';
  index: number;
  step?: Step;
  group?: StepGroup;
}

function scenarioRows(scenario: Scenario): StepRow[] {
  const openedGroups = new Set<string>();
  const rows: StepRow[] = [];
  scenario.steps.forEach((step, index) => {
    const group = scenario.groups?.find((candidate) => candidate.id === step.groupId);
    if (!group) {
      rows.push({ kind: 'step', index, step });
      return;
    }
    if (openedGroups.has(group.id)) return;
    openedGroups.add(group.id);
    rows.push({ kind: 'group', index, group });
  });
  return rows;
}

function rowLeadStep(scenario: Scenario, row: StepRow): Step | null {
  if (row.step) return row.step;
  if (!row.group) return null;
  return (
    scenario.steps.find(
      (step) => step.groupId === row.group?.id && window.isStepVisible(scenario, step),
    ) || null
  );
}

export function StepList({ scenario, route }: { scenario: Scenario; route: ScenarioRoute }) {
  const ranks = new Map<string, number>();
  scenario.steps.forEach((step) => {
    if (window.isStepVisible(scenario, step) && step.id) ranks.set(step.id, ranks.size);
  });
  const rows = scenarioRows(scenario);

  /*
    Une lane est soit 'main' (la liste principale), soit l'id d'une option de groupe — même valeur
    que le `lane` passé à StepCard. On lit l'ordre pré-drag (le store n'a pas encore bougé), jamais
    le DOM : `OptimisticSortingPlugin` de dnd-kit l'a déjà réordonné en live pendant le glisser, donc
    une géométrie relue après coup y est en décalage avec la position que la lib a déjà résolue.
  */
  function laneStepIds(lane: string): string[] {
    if (lane === 'main')
      return rows
        .filter((row): row is StepRow & { step: Step } => row.kind === 'step' && !!row.step?.id)
        .map((row) => row.step.id as string);
    return window
      .optionSteps(scenario, lane)
      .map((step: Step) => step.id)
      .filter((id: string | null): id is string => !!id);
  }

  function finishDrag(
    event: Parameters<
      NonNullable<React.ComponentProps<typeof dnd.DragDropProvider>['onDragEnd']>
    >[0],
  ) {
    if (event.canceled) return;
    const draggedStep = event.operation.source;
    if (!draggedStep || !isSortable(draggedStep) || !draggedStep.id) return;
    const { group: lane, index } = draggedStep.sortable;
    const ids = laneStepIds(String(lane)).filter((id) => id !== draggedStep.id);
    if (ids.length === 0) return;
    const before = index < ids.length;
    const targetId = before ? ids[index] : ids[ids.length - 1];
    window.moveStepBefore(scenario.id, String(draggedStep.id), targetId, before);
  }

  if (scenario.steps.length === 0) {
    return (
      <div className="step-list">
        <div className="empty-state">
          <strong>Aucune étape</strong>
          Ajoute une première étape à ce scénario.
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={() => window.insertStep(scenario.id, 0)}
        >
          <Icon name="plus" /> Créer une étape
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-small"
          onClick={() => window.insertStepGroup(scenario.id, 0)}
        >
          <Icon name="plus" /> Créer une étape avec options
        </button>
      </div>
    );
  }

  return (
    <dnd.DragDropProvider onDragEnd={finishDrag}>
      <div className="step-list">
        {rows.map((row, rowIndex) => {
          if (row.step) {
            const current = row.step;
            return (
              <Fragment key={current.id || `step-${row.index}`}>
                {rowIndex > 0 && (
                  <div className="step-gap">
                    <StepLeg scenario={scenario} step={current} route={route} />
                  </div>
                )}
                <StepCard
                  scenario={scenario}
                  step={current}
                  rank={current.id ? (ranks.get(current.id) ?? null) : null}
                  lane="main"
                  sortIndex={
                    rows.slice(0, rowIndex).filter((candidate) => candidate.kind === 'step').length
                  }
                />
                <div className="step-gap">
                  <button
                    type="button"
                    className="icon-btn"
                    title="Insérer une étape"
                    onClick={() => window.insertStep(scenario.id, row.index + 1)}
                  >
                    <Icon name="plus" />
                  </button>
                </div>
              </Fragment>
            );
          }
          if (!row.group) return null;
          const group = row.group;
          const leadStep = rowLeadStep(scenario, row);
          const lastGroupIndex = scenario.steps.reduce(
            (lastIndex, step, index) => (step.groupId === group.id ? index : lastIndex),
            row.index,
          );
          return (
            <Fragment key={group.id}>
              {rowIndex > 0 && (
                <div className="step-gap">
                  <StepLeg scenario={scenario} step={leadStep} route={route} />
                </div>
              )}
              <StepGroupView scenario={scenario} group={group} ranks={ranks} route={route} />
              <div className="step-gap">
                <button
                  type="button"
                  className="icon-btn"
                  title="Insérer une étape après ce groupe"
                  onClick={() => window.insertStep(scenario.id, lastGroupIndex + 1)}
                >
                  <Icon name="plus" />
                </button>
              </div>
            </Fragment>
          );
        })}
        <div className="step-append">
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => window.insertStep(scenario.id, scenario.steps.length)}
          >
            <Icon name="plus" /> Ajouter une étape
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => window.insertStepGroup(scenario.id, scenario.steps.length)}
          >
            Étape avec options
          </button>
        </div>
      </div>
    </dnd.DragDropProvider>
  );
}
