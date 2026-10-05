import { TagLabel } from '@/shared/TagLabel';

// A vocabulary level is not reversed but rearranged: its words are dragged into the wanted order.
export function SortOrderWords({ kind, column }: { kind: string; column: LegacyColumn }) {
  const order = column.sortOrder;
  if (!order) return null;
  return (
    <details className="sort-order-words">
      <summary className="inline-select sort-order-summary">
        {order.label}
        <span className="sort-order-caret">⌄</span>
      </summary>
      {window.sortOrderWords(order).map((word) => {
        const entry = order.dict[word];
        return (
          <div
            key={word}
            className="inline-menu-item sort-order-word"
            draggable
            onDragStart={(event) => window.startSortWordDrag(event, word)}
            onDragEnd={() => window.endSortWordDrag()}
            onDragOver={(event) => window.overSortWord(event)}
            onDrop={(event) => window.dropOnSortWord(event, kind, column.key, word)}
          >
            <span className="sort-order-handle">⠿</span>
            <TagLabel emoji={entry?.emoji} label={entry?.label ?? word} />
          </div>
        );
      })}
    </details>
  );
}
