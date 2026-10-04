import type { Extra, Scenario, Step, StepGroup } from '@/store/types';
import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { ExtraCountDropdown } from './ExtraCountDropdown';
import { ExtraMenu } from './ExtraMenu';

export function ExtraRow({
  scenario,
  holder,
  line,
}: {
  scenario: Scenario;
  holder: Step | StepGroup;
  line: Extra;
}) {
  const holderId = holder.id;
  if (!holderId) return null;
  const hasBudget = window.hasPriceValue(line.budget);
  const autoAmount = window.extraAmount(line);
  return (
    <div className="step-extra-row">
      <ExtraMenu scenario={scenario} holder={holder} line={line} />
      <LegacyMarkup html={window.extraStatusTag(line)} />
      {line.attractionId ? (
        <input
          className="step-extra-date"
          type="date"
          value={line.date || ''}
          onChange={(event) =>
            window.setExtraDate(scenario.id, holderId, line.id, event.target.value)
          }
          aria-label="Date de l'activité"
        />
      ) : (
        <span />
      )}
      <ExtraCountDropdown scenario={scenario} holder={holder} line={line} />
      <span className="step-total">
        {!hasBudget && autoAmount ? (
          <span className="step-total-auto">{window.formatEuros(autoAmount)}</span>
        ) : null}
        <span className="step-budget">
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
            onBlur={(event) =>
              window.setExtraBudget(scenario.id, holderId, line.id, event.currentTarget.innerText)
            }
          >
            {line.budget || ''}
          </span>
          {hasBudget ? ' €' : ''}
        </span>
      </span>
    </div>
  );
}
