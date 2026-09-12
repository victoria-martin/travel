let openTaskId = null;
let preview = null;
let archiveArmed = false;
let sessionError = '';
let previewFailed = '';

const findTask = (id) => allTasks().find((task) => task.id === id);

async function openDrawer(id) {
  const task = findTask(id);
  if (!task) return;
  drawerMode = 'task';
  openTaskId = id;
  if (location.hash !== `#t-${id}`) history.replaceState(null, '', `#t-${id}`);
  draft = { title: task.title, types: [...task.types], status: task.status, body: task.body };
  preview = null;
  archiveArmed = false;
  sessionError = '';
  previewFailed = '';
  renderBoard();
  renderDrawer();
  try {
    preview = await api(`/api/tasks/${id}/session`);
  } catch (error) {
    previewFailed = error.message;
  }
  if (openTaskId === id) renderDrawer();
}

function isDirty() {
  const task = findTask(openTaskId);
  if (!task) return false;
  return (
    ['title', 'status', 'body'].some((field) => draft[field] !== task[field]) ||
    draft.types.join() !== task.types.join()
  );
}

const setPrompt = (value) => (preview.prompt = value);

function sessionBlock() {
  if (previewFailed) {
    return `<p class="hint hint-warn">Le serveur n’a pas répondu : ${esc(previewFailed)}.
      S’il tourne sur une version antérieure du board, relance-le.</p>`;
  }
  if (!preview) return '<p class="hint">Chargement…</p>';

  const warning = isDirty()
    ? '<p class="hint hint-warn">Le détail modifié n’est pas encore enregistré.</p>'
    : '';
  const failed = sessionError ? `<p class="hint hint-warn">${esc(sessionError)}</p>` : '';

  if (preview.session) {
    const opened = new Date(preview.session.lastOpenedAt).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    return `<p class="hint">Session liée, dernière ouverture le ${opened}.</p>
      <code>${esc(preview.command)}</code>
      ${warning}${failed}
      <button class="btn btn-primary" data-act="launch">↻ Rouvrir dans iTerm</button>`;
  }
  return `<p class="hint">Aucune session. Claude démarrera sur ce prompt — modifiable avant de lancer.</p>
    <textarea class="prompt-input" data-act="prompt">${esc(preview.prompt)}</textarea>
    <code>${esc(preview.command)}</code>
    <p class="hint">Le prompt ci-dessus est passé en argument au démarrage.</p>
    ${warning}${failed}
    <button class="btn btn-primary" data-act="launch">▶ Lancer dans iTerm</button>`;
}

function renderTaskDrawer() {
  const task = findTask(openTaskId);
  if (!task) return closeDrawer();

  paintDrawer({
    where: esc([task.section, task.subsection].filter(Boolean).join(' › ')),
    body: `
      <div class="session session-top">
        <label class="field-label">Session Claude</label>
        ${sessionBlock()}
      </div>
      ${draftFields()}`,
    foot: `
      <button class="btn btn-primary" id="save" data-act="save" ${isDirty() ? '' : 'disabled'}>
        Enregistrer
      </button>
      <button class="btn" data-act="cancel">Annuler</button>
      ${
        task.archived
          ? ''
          : `<button class="btn btn-danger ${archiveArmed ? 'armed' : ''}" data-act="archive">
              ${archiveArmed ? 'Confirmer — la puce sort de PLAN.md' : 'Archiver'}
            </button>`
      }`,
  });
}

function refreshDrawerFoot() {
  const save = ui.getElementById('save');
  if (save) save.disabled = drawerMode === 'create' ? !canCreate() : !isDirty();
}

async function saveDraft() {
  const id = openTaskId;
  board = await api(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  const task = findTask(id);
  draft = { title: task.title, types: [...task.types], status: task.status, body: task.body };
  renderBoard();
  renderDrawer();
}

async function launchSession() {
  sessionError = '';
  try {
    await api(`/api/tasks/${openTaskId}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: preview.prompt }),
    });
    await loadBoard();
    preview = await api(`/api/tasks/${openTaskId}/session`);
    renderDrawer();
  } catch (error) {
    sessionError = `iTerm n’a pas répondu : ${error.message}`;
    renderDrawer();
  }
}

// First click arms, second archives: a confirm() dialog opens on the opener window, not on
// the detached one where the click happened.
async function archiveTask() {
  if (!archiveArmed) {
    archiveArmed = true;
    return renderDrawer();
  }
  board = await api(`/api/tasks/${openTaskId}/archive`, { method: 'POST' });
  closeDrawer();
}
