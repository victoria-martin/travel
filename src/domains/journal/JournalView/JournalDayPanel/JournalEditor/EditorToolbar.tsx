import { Icon } from '@/shared/Icon';
import type { JournalEditorState } from '../useJournalEditor';

const BUTTONS = [
  { icon: 'heading', label: 'Titre', before: '## ', after: '', line: true },
  { icon: 'bold', label: 'Gras', before: '**', after: '**', line: false },
  { icon: 'italic', label: 'Italique', before: '*', after: '*', line: false },
  { icon: 'link', label: 'Lien', before: '[', after: '](https://)', line: false },
];

export function EditorToolbar({ date, editor }: { date: string; editor: JournalEditorState }) {
  return (
    <div className="journal-toolbar">
      {BUTTONS.map((button) => (
        <button
          key={button.label}
          type="button"
          className="btn btn-outline btn-small"
          title={button.label}
          aria-label={button.label}
          onMouseDown={(event) => {
            event.preventDefault();
            editor.wrapSelection(button.before, button.after, button.line);
          }}
        >
          <span className="toolbar-icon">
            <Icon name={button.icon} />
          </span>
        </button>
      ))}
      <span className="toolbar-separator" />
      <label className="btn btn-outline btn-small journal-photo-btn" title="Ajouter des photos">
        <span className="toolbar-icon">
          <Icon name="camera" />
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => window.onJournalPhotoPicked(event.currentTarget, date)}
        />
      </label>
    </div>
  );
}
