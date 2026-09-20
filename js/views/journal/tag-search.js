/*
  {} déclenche la recherche de lieu inline. Taper `{` ouvre la liste sur ce qui suit le caret ;
  entourer un texte déjà tapé d'accolades (frappe de `{` avec une sélection) l'ouvre filtrée sur ce
  texte. Les deux cas se ramènent à la même lecture : la dernière `{` avant le caret, tant qu'aucune
  `}` ne s'intercale — qu'elle existe déjà (cas de l'entourage) ou pas encore (cas de la frappe).
*/
let journalTagMatches = [];

function journalCaretBraceQuery(text, caret) {
  const before = text.slice(0, caret);
  const braceStart = before.lastIndexOf('{');
  if (braceStart === -1) return null;
  const between = before.slice(braceStart + 1);
  if (between.includes('}')) return null;
  return { braceStart, query: between };
}

// `{` avec une sélection l'entoure au lieu de s'insérer : la frappe normale reste inchangée sinon.
function onJournalBraceKeydown(event, textarea, date) {
  if (event.key !== '{') return;
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  if (start === end) return;
  event.preventDefault();
  const query = value.slice(start, end);
  textarea.value = `${value.slice(0, start)}{${query}}${value.slice(end)}`;
  textarea.selectionStart = start + 1;
  textarea.selectionEnd = start + 1 + query.length;
  journalTextChanged(textarea, date);
}

function refreshJournalTagDropdown(textarea, date) {
  const container = document.getElementById('journal-tag-dropdown');
  if (!container) return;
  const collapsed = textarea.selectionStart === textarea.selectionEnd;
  const info = collapsed ? journalCaretBraceQuery(textarea.value, textarea.selectionStart) : null;
  if (!info) {
    container.innerHTML = '';
    journalTagMatches = [];
    return;
  }
  journalTagMatches = journalRefMatches(info.query);
  container.innerHTML = journalTagDropdownHtml(info.query, date);
}

function journalTagDropdownHtml(query, date) {
  if (!journalTagMatches.length) {
    return /* HTML */ `<div class="journal-tag-menu">
      <p class="hint">Aucun lieu ne correspond à « ${escapeHtml(query)} ».</p>
    </div>`;
  }
  return /* HTML */ `<div class="journal-tag-menu">
    ${journalTagMatches
      .map(
        (item, i) => /* HTML */ `<button
          class="journal-tag-item"
          onmousedown="event.preventDefault(); journalPickTagMatch(${i}, '${date}')"
        >
          ${item.kind === 'accommodation' ? svgIcon('house') : svgIcon('landmark')}
          ${escapeHtml(item.name)}
        </button>`,
      )
      .join('')}
  </div>`;
}

function journalPickTagMatch(index, date) {
  const item = journalTagMatches[index];
  const textarea = document.getElementById('journal-text');
  if (!item || !textarea) return;
  const caret = textarea.selectionStart;
  const info = journalCaretBraceQuery(textarea.value, caret);
  if (!info) return;
  const hasClosingRightAfter = textarea.value[caret] === '}';
  const after = textarea.value.slice(hasClosingRightAfter ? caret + 1 : caret);
  const before = textarea.value.slice(0, info.braceStart);
  const newText = `${before}{${item.name}}${after}`;
  textarea.value = newText;
  const newCaret = before.length + item.name.length + 2;
  textarea.selectionStart = textarea.selectionEnd = newCaret;
  textarea.focus();
  document.getElementById('journal-tag-dropdown').innerHTML = '';
  journalTagMatches = [];
  journalTextChanged(textarea, date);
}
