import { Icon } from '@/shared/Icon';
import type { JournalEditorState } from '../useJournalEditor';
import { caretBraceQuery } from './caretBraceQuery';

// `{` opens the place search on what follows it, up to the caret.
export function PlaceRefMenu({ editor }: { editor: JournalEditorState }) {
  const { text, caret } = editor;
  const brace = caret.start === caret.end ? caretBraceQuery(text, caret.start) : null;
  if (!brace) return null;
  const matches = window.journalRefMatches(brace.query);

  function pick(name: string) {
    if (!brace) return;
    const closedRightAfter = text[caret.start] === '}';
    const before = text.slice(0, brace.braceStart);
    const after = text.slice(closedRightAfter ? caret.start + 1 : caret.start);
    const at = before.length + name.length + 2;
    editor.change(`${before}{${name}}${after}`, { start: at, end: at });
  }

  return (
    <div className="journal-tag-dropdown">
      <div className="journal-tag-menu">
        {matches.length ? (
          matches.map((item) => (
            <button
              key={item.id}
              type="button"
              className="journal-tag-item"
              onMouseDown={(event) => {
                event.preventDefault();
                pick(item.name);
              }}
            >
              <Icon name={item.kind === 'accommodation' ? 'house' : 'landmark'} /> {item.name}
            </button>
          ))
        ) : (
          <p className="hint">Aucun lieu ne correspond à « {brace.query} ».</p>
        )}
      </div>
    </div>
  );
}
