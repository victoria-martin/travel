import { Icon } from '@/shared/Icon';
import type { Scenario } from '@/store/types';

// What the scenario already planned that day; a click inserts its reference in the text.
export function PlannedPills({
  scenario,
  date,
  onInsert,
}: {
  scenario: Scenario;
  date: string;
  onInsert: (name: string) => void;
}) {
  const planned = window.journalPlannedItemsForDay(scenario, date);
  if (!planned.length) return null;
  return (
    <div className="journal-planned">
      <span className="journal-planned-label">Planifiés :</span>
      {planned.map((item) => (
        <button
          key={item.id}
          type="button"
          className="journal-planned-pill"
          onClick={() => onInsert(item.name)}
        >
          <Icon name={item.kind === 'accommodation' ? 'house' : 'landmark'} /> {item.name}
        </button>
      ))}
    </div>
  );
}
