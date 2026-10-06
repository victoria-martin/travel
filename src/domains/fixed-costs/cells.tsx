import { TagLabel } from '@/shared/TagLabel';
import { EditableTextCell } from '@/shared/cells/EditableTextCell';
import { TextCell } from '@/shared/cells/TextCell';
import type { FixedCost } from '@/store/types';

function NotesCell({ cost }: { cost: FixedCost }) {
  return (
    <EditableTextCell
      value={cost.notes}
      placeholder="Notes…"
      onSave={(notes) => {
        cost.notes = notes;
        window.saveNow();
      }}
    />
  );
}

export function LabelCell({ cost }: { cost: FixedCost }) {
  return (
    <>
      <TextCell value={cost.label} />
      <div className="row-notes">
        <NotesCell cost={cost} />
      </div>
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
