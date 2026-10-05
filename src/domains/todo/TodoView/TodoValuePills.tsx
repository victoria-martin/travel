import { TagLabel } from '@/shared/TagLabel';

export function TodoValuePills({
  kind,
  column,
  selected,
  onToggle,
}: {
  kind: string;
  column: LegacyColumn;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="filter-pills">
      {window.filterValues(kind, column).map((value) => {
        const word = column.sortOrder?.dict[value];
        return (
          <button
            key={value}
            type="button"
            className={`filter-pill ${selected.includes(value) ? 'active' : ''}`}
            onClick={() => onToggle(value)}
          >
            {word ? <TagLabel emoji={word.emoji} label={word.label} /> : value}
          </button>
        );
      })}
    </div>
  );
}
