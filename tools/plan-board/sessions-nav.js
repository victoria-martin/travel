// Une session ouverte est une tâche en cours de travail : le panneau les rassemble, la plus
// récemment ouverte en tête. Le fichier des sessions ne dit rien de plus qu'« une session existe
// pour cette tâche » — c'est la définition d'active retenue ici. Une tâche archivée n'y figure
// pas : son travail est fini.
let sessionsOpen = false;

function toggleSessions() {
  sessionsOpen = !sessionsOpen;
  actionError = '';
  renderBoard();
}

const activeSessions = () =>
  board.tasks
    .filter((task) => task.session)
    .sort((a, b) => b.session.lastOpenedAt.localeCompare(a.session.lastOpenedAt));

// La barre est étroite : une seule case, et l'heure seule tant qu'elle situe la session dans la
// journée écoulée — au-delà, c'est le jour qui compte.
const DAY = 24 * 60 * 60 * 1000;

function openedAt(session) {
  const date = new Date(session.lastOpenedAt);
  return Date.now() - date < DAY
    ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function sessionRow(task) {
  return `<div class="session-row">
    <button class="session-open" data-act="open" data-id="${task.id}"
      title="${esc(task.title)}">
      <span class="session-title">${esc(task.title)}</span>
      <span class="session-when">${openedAt(task.session)}</span>
    </button>
    ${taskActionButtons(task)}
  </div>`;
}

function sessionsPanel() {
  const rows = activeSessions();
  const head = `<button class="sessions-toggle" data-act="sessions" aria-pressed="${sessionsOpen}">
    <span>💬 Sessions</span><span class="tally">${rows.length}</span>
  </button>`;

  if (!sessionsOpen) return `<div class="sessions-block">${head}</div>`;

  const body = rows.length
    ? rows.map(sessionRow).join('')
    : '<p class="hint">Aucune session ouverte.</p>';
  const failed = actionError ? `<p class="hint hint-warn">${esc(actionError)}</p>` : '';
  return `<div class="sessions-block">${head}
    <div class="sessions-panel">${body}${failed}</div>
  </div>`;
}
