import { TagLabel } from '../../shared/TagLabel';
import { TextCell } from '../../shared/cells/TextCell';
import type { FixedCost } from '../../store/types';

// Lecture seule pour ce lot : notes pas encore éditables en place (editableText, contenteditable).
export function LabelCell({ cost }: { cost: FixedCost }) {
  return (
    <>
      <TextCell value={cost.label} />
      {cost.notes && <div className="row-notes">{cost.notes}</div>}
    </>
  );
}

export function AmountCell({ cost }: { cost: FixedCost }) {
  return <TextCell value={window.expenseAmountLabel(cost)} />;
}

export function RecurrenceBadge({ recurrence }: { recurrence: string }) {
  const current = window.expenseRecurrence(recurrence);
  return <TagLabel emoji={current.emoji} label={current.label} />;
}
