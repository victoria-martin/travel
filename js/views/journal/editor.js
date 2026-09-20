/*
  Un seul jour s'édite à la fois (day-cards.js), donc le textarea et ses panneaux portent des ids
  fixes plutôt qu'un id par date. Toute frappe passe par journalTextChanged, qui enregistre sans
  re-render (js/views/notes.js) puis met à jour aperçu, refs non résolues et dropdown {} en place.
*/
function journalEditorBlock(date) {
  const entry = getJournalEntry(currentTravelId(), date);
  const text = entry ? entry.text : '';
  return /* HTML */ `<div class="journal-editor">
    ${journalEditorToolbar(date)}
    <div class="journal-editor-body">
      <div class="journal-textarea-wrap">
        <textarea
          id="journal-text"
          class="journal-textarea"
          placeholder="Raconte ta journée… tape { pour retrouver un lieu"
          oninput="journalTextChanged(this, '${date}')"
          onkeydown="onJournalBraceKeydown(event, this, '${date}')"
          onclick="refreshJournalTagDropdown(this, '${date}')"
          onkeyup="refreshJournalTagDropdown(this, '${date}')"
        >
${escapeHtml(text)}</textarea
        >
        <div id="journal-tag-dropdown" class="journal-tag-dropdown"></div>
      </div>
      <div id="journal-preview" class="journal-preview">${renderJournalMarkdown(text)}</div>
    </div>
    <div id="journal-unresolved">${journalUnresolvedRefsHtml(date, text)}</div>
    ${journalPhotosBlock(date)}
  </div>`;
}

function journalEditorToolbar(date) {
  const buttons = [
    { icon: 'heading', label: 'Titre', wrap: ['## ', ''], line: true },
    { icon: 'bold', label: 'Gras', wrap: ['**', '**'] },
    { icon: 'italic', label: 'Italique', wrap: ['*', '*'] },
    { icon: 'link', label: 'Lien', wrap: ['[', '](https://)'] },
  ];
  return /* HTML */ `<div class="journal-toolbar">
    ${buttons
      .map(
        (b) => /* HTML */ `<button
          class="toolbar-btn"
          title="${b.label}"
          aria-label="${b.label}"
          onmousedown="event.preventDefault(); journalWrapSelection('${b.wrap[0]}', '${b.wrap[1]}', ${!!b.line}, '${date}')"
        >
          <span class="toolbar-icon">${svgIcon(b.icon)}</span>
        </button>`,
      )
      .join('')}
    ${toolbarSeparator()}
    <label class="toolbar-btn journal-photo-btn" title="Ajouter des photos">
      <span class="toolbar-icon">${svgIcon('camera')}</span>
      <input type="file" accept="image/*" multiple hidden onchange="onJournalPhotoPicked(this, '${date}')" />
    </label>
  </div>`;
}

// Un titre s'insère en tête de ligne, gras/italique/lien entourent la sélection.
function journalWrapSelection(before, after, line, date) {
  const textarea = document.getElementById('journal-text');
  if (!textarea) return;
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  if (line) {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    textarea.value = `${value.slice(0, lineStart)}${before}${value.slice(lineStart)}`;
    textarea.selectionStart = textarea.selectionEnd = start + before.length;
  } else {
    const selected = value.slice(start, end);
    textarea.value = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
  }
  textarea.focus();
  journalTextChanged(textarea, date);
}

function journalTextChanged(textarea, date) {
  setJournalTextQuiet(date, textarea.value);
  const preview = document.getElementById('journal-preview');
  if (preview) preview.innerHTML = renderJournalMarkdown(textarea.value);
  const unresolved = document.getElementById('journal-unresolved');
  if (unresolved) unresolved.innerHTML = journalUnresolvedRefsHtml(date, textarea.value);
  refreshJournalTagDropdown(textarea, date);
}
