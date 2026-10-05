import { useLayoutEffect, useRef, useState } from 'react';

export type JournalEditorState = ReturnType<typeof useJournalEditor>;

// The day's text lives here while it is typed: saved on every change, without a page render.
export function useJournalEditor(date: string) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(
    () => window.getJournalEntry(window.currentTravelId() || '', date)?.text ?? '',
  );
  const [caret, setCaret] = useState({ start: 0, end: 0 });
  const pendingSelection = useRef<{ start: number; end: number } | null>(null);

  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    const textarea = textareaRef.current;
    if (!selection || !textarea) return;
    pendingSelection.current = null;
    textarea.focus();
    textarea.setSelectionRange(selection.start, selection.end);
    setCaret(selection);
  });

  function change(next: string, selection?: { start: number; end: number }) {
    setText(next);
    window.setJournalTextQuiet(date, next);
    if (selection) pendingSelection.current = selection;
  }

  function readCaret() {
    const textarea = textareaRef.current;
    if (textarea) setCaret({ start: textarea.selectionStart, end: textarea.selectionEnd });
  }

  function insertAtCaret(insert: string) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? text.length;
    const end = textarea?.selectionEnd ?? text.length;
    const at = start + insert.length;
    change(`${text.slice(0, start)}${insert}${text.slice(end)}`, { start: at, end: at });
  }

  // A heading goes at the start of the line; bold, italic and link wrap the selection.
  function wrapSelection(before: string, after: string, line: boolean) {
    const { start, end } = caret;
    if (line) {
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const at = start + before.length;
      return change(`${text.slice(0, lineStart)}${before}${text.slice(lineStart)}`, {
        start: at,
        end: at,
      });
    }
    const selected = text.slice(start, end);
    change(`${text.slice(0, start)}${before}${selected}${after}${text.slice(end)}`, {
      start: start + before.length,
      end: start + before.length + selected.length,
    });
  }

  return { textareaRef, text, caret, change, readCaret, insertAtCaret, wrapSelection };
}
