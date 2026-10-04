import { EditableTextCell } from '@/shared/cells/EditableTextCell';
import type { Scenario } from '@/store/types';

// A typed budget replaces the calculation, as on a step: the calculation stays greyed until one is set.
export function RoadCostRow({
  scenario,
  field,
  label,
  note,
  calculated,
}: {
  scenario: Scenario;
  field: 'fuelBudget' | 'tollBudget';
  label: string;
  note: string;
  calculated: number;
}) {
  const budget = scenario[field] ?? '';
  const hasBudget = window.hasPriceValue(budget);
  return (
    <div className="acc-recap-row acc-recap-sub acc-recap-row-cost">
      <span>{label}</span>
      <span className="acc-recap-nights">{note}</span>
      <span className="step-total">
        {!hasBudget && <span className="step-total-auto">{window.formatEuros(calculated)}</span>}
        <span className="step-budget">
          <EditableTextCell
            value={budget}
            placeholder="budget"
            onSave={(value) => window.setScenarioRoadBudget(scenario.id, field, value)}
          />
          {hasBudget ? ' €' : ''}
        </span>
      </span>
    </div>
  );
}
