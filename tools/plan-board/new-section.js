// A section is a page of the app. The first task of a scope writes its heading, so this form is for
// the other way round: the page named before the work that will fill it.
let newSection = null;
let newSectionError = '';

function toggleNewSection() {
  if (newSection !== null) return closeNewSection();
  newSection = '';
  newSectionError = '';
  renderBoard();
  ui.getElementById('section-name').focus();
}

function closeNewSection() {
  newSection = null;
  newSectionError = '';
  renderBoard();
}

// Typing only arms the button; re-rendering here would take the focus out of the input.
function editNewSection(value) {
  newSection = value;
  const add = ui.getElementById('section-add');
  if (add) add.disabled = !newSection.trim();
}

async function addNewSection() {
  try {
    board = await api('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSection }),
    });
    newSection = null;
    newSectionError = '';
  } catch (error) {
    newSectionError = error.message;
  }
  renderBoard();
}

function newSectionForm() {
  if (newSection === null) {
    return `<button class="ghost-add" data-act="new-section">＋ nouvelle section…</button>`;
  }

  return `<div class="new-section">
    <div class="inline-form">
      <input class="section-input" id="section-name" data-act="section-name"
        value="${esc(newSection)}" placeholder="Le nom de la page" />
      ${confirmButton('section-add', 'section-add', newSection.trim())}
      ${cancelButton('section-cancel')}
    </div>
    ${newSectionError ? `<p class="hint hint-warn">${esc(newSectionError)}</p>` : ''}
  </div>`;
}
