let openTaskId = null;
let draft = null;
let preview = null;
let archiveArmed = false;
let sessionError = '';
let previewFailed = '';

const drawerEl = () => ui.getElementById('drawer');
const findTask = (id) => allTasks().find((task) => task.id === id);

async function openDrawer(id) {
  const task = findTask(id);
  if (!task) return;
  openTaskId = id;
  if (location.hash !== `#t-${id}`) history.replaceState(null, '', `#t-${id}`);
  draft = { title: task.title, status: task.status, body: task.body };
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

function closeDrawer() {
  if (location.hash) history.replaceState(null, '', location.pathname);
  openTaskId = null;
  draft = null;
  preview = null;
  archiveArmed = false;
  drawerEl().hidden = true;
  ui.getElementById('overlay').hidden = true;
  renderBoard();
}

function isDirty() {
  const task = findTask(openTaskId);
  return ['title', 'status', 'body'].some((field) => draft[field] !== task[field]);
}

function editDraft(field, value) {
  draft[field] = value;
  if (field === 'status') renderDrawer();
  else ui.getElementById('save').disabled = !isDirty();
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

function renderDrawer() {
  const task = findTask(openTaskId);
  if (!task) return closeDrawer();
  const where = [task.section, task.subsection].filter(Boolean).join(' › ');

  drawerEl().innerHTML = `
    <div class="drawer-head">
      <span class="drawer-where">${esc(where)}</span>
      <button class="icon-btn" data-act="close" title="Fermer (Échap)">✕</button>
    </div>

    <div class="drawer-body">
      <div class="field">
        <label for="title">Titre</label>
        <input class="title-input" id="title" data-act="title" value="${esc(draft.title)}" />
      </div>

      <div class="field">
        <label>Statut</label>
        <div class="status-choices">
          ${PLAN_STATUSES.map((status) =>
            statusPill(
              status.label,
              `role="button" tabindex="0" data-act="pick-status" data-value="${status.label}"
               aria-pressed="${draft.status === status.label}"`,
            ),
          ).join('')}
        </div>
      </div>

      <div class="field">
        <label for="body">Détail</label>
        <textarea class="body-input" id="body" data-act="body">${esc(draft.body)}</textarea>
        <p class="hint">Markdown, tel qu'il sera écrit dans PLAN.md.</p>
      </div>

      <div class="session">
        <label class="drawer-where">Session Claude</label>
        ${sessionBlock()}
      </div>
    </div>

    <div class="drawer-foot">
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
      }
    </div>`;

  drawerEl().hidden = false;
  ui.getElementById('overlay').hidden = false;
}

async function saveDraft() {
  const id = openTaskId;
  board = await api(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  const task = findTask(id);
  draft = { title: task.title, status: task.status, body: task.body };
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

// First click arms, second archives: a confirm() dialog would open behind the floating window.
async function archiveTask() {
  if (!archiveArmed) {
    archiveArmed = true;
    return renderDrawer();
  }
  board = await api(`/api/tasks/${openTaskId}/archive`, { method: 'POST' });
  closeDrawer();
}
