import type { Scenario } from '@/store/types';

export function ScenarioNameTitle({ scenario }: { scenario: Scenario }) {
  return (
    <h2 className="view-title">
      <span
        className="editable"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Nom du scénario…"
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          event.currentTarget.blur();
        }}
        onBlur={(event) => {
          window.renameScenario(scenario.id, event.currentTarget.innerText);
          window.render();
        }}
      >
        {scenario.name}
      </span>
    </h2>
  );
}
