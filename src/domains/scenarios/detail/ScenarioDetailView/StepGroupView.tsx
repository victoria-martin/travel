import { Icon } from '@/shared/Icon';
import type { Scenario, StepGroup } from '@/store/types';
import type { ScenarioRoute } from '@/domains/scenarios/hooks/useScenarioRoute';
import { ExtrasBlock } from './ExtrasBlock';
import { OptionColumn } from './OptionColumn';

export function StepGroupView({
  scenario,
  group,
  ranks,
  route,
}: {
  scenario: Scenario;
  group: StepGroup;
  ranks: Map<string, number>;
  route: ScenarioRoute;
}) {
  const options = window.groupOptions(group);
  const arrival = window.groupArrival(scenario, group);

  return (
    <section className={`step-group${group.hidden ? ' step-group-hidden' : ''}`}>
      <div className="step-group-head">
        <div className="step-group-title">
          <span className="step-group-move">
            <button
              type="button"
              className="icon-btn step-move-btn"
              title="Monter"
              onClick={() => window.moveGroup(scenario.id, group.id, -1)}
            >
              <Icon name="arrow-up" />
            </button>
            <button
              type="button"
              className="icon-btn step-move-btn"
              title="Descendre"
              onClick={() => window.moveGroup(scenario.id, group.id, 1)}
            >
              <Icon name="arrow-down" />
            </button>
          </span>
          <span className="step-group-fork" title="Étape à options">
            ⑂
          </span>
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
              window.renameStepGroup(scenario.id, group.id, event.currentTarget.innerText);
              window.render();
            }}
          >
            {group.name || ''}
          </span>
          {arrival && (
            <span className="step-title-dates">à partir du {window.formatStepDate(arrival)}</span>
          )}
        </div>
        <div className="step-group-actions">
          <span className="step-group-count">{options.length} options — une seule compte</span>
          <button
            type="button"
            className="icon-btn"
            title={group.hidden ? 'Afficher' : 'Masquer'}
            onClick={() => window.toggleGroupHidden(scenario.id, group.id)}
          >
            <Icon name={group.hidden ? 'eye-off' : 'eye'} />
          </button>
        </div>
      </div>
      <div className="option-columns">
        {options.map((option) => (
          <OptionColumn
            key={option.id}
            scenario={scenario}
            group={group}
            option={option}
            ranks={ranks}
            route={route}
          />
        ))}
      </div>
      <div className="step-group-foot">
        <button
          type="button"
          className="inline-tag step-add-option"
          onClick={() => window.addGroupOption(scenario.id, group.id)}
        >
          <Icon name="plus" /> option
        </button>
        <ExtrasBlock scenario={scenario} holder={group} />
      </div>
    </section>
  );
}
