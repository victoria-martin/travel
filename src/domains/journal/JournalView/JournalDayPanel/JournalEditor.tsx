import type { Scenario } from '@/store/types';
import { EditorToolbar } from './JournalEditor/EditorToolbar';
import { JournalPhotos } from './JournalEditor/JournalPhotos';
import { JournalPreview } from './JournalEditor/JournalPreview';
import { PlaceRefMenu } from './JournalEditor/PlaceRefMenu';
import { UnresolvedRefs } from './JournalEditor/UnresolvedRefs';
import type { JournalEditorState } from './useJournalEditor';

export function JournalEditor({
  scenario,
  date,
  editor,
}: {
  scenario: Scenario;
  date: string;
  editor: JournalEditorState;
}) {
  const { text, caret } = editor;
  return (
    <div className="journal-editor">
      <EditorToolbar date={date} editor={editor} />
      <div className="journal-editor-body">
        <div className="journal-textarea-wrap">
          <textarea
            ref={editor.textareaRef}
            className="journal-textarea"
            placeholder="Raconte ta journée… tape { pour retrouver un lieu"
            value={text}
            onChange={(event) => {
              editor.change(event.target.value);
              editor.readCaret();
            }}
            onSelect={editor.readCaret}
            onKeyDown={(event) => {
              if (event.key !== '{' || caret.start === caret.end) return;
              event.preventDefault();
              const query = text.slice(caret.start, caret.end);
              editor.change(`${text.slice(0, caret.start)}{${query}}${text.slice(caret.end)}`, {
                start: caret.start + 1,
                end: caret.start + 1 + query.length,
              });
            }}
          />
          <PlaceRefMenu editor={editor} />
        </div>
        <JournalPreview text={text} />
      </div>
      <UnresolvedRefs scenario={scenario} date={date} text={text} />
      <JournalPhotos date={date} />
    </div>
  );
}
