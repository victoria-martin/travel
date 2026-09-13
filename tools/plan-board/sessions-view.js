// La liste des sessions ouvertes dans le panneau principal, la plus récemment ouverte en tête.
const DAY = 24 * 60 * 60 * 1000;

// Une seule case pour situer la session : l'heure tant qu'elle tient dans la journée écoulée,
// au-delà c'est le jour qui compte.
function openedAt(session) {
  const date = new Date(session.lastOpenedAt);
  return Date.now() - date < DAY
    ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function sessionRow(task) {
  return `<div class="session-row">
    <button class="session-open" data-act="open" data-id="${task.id}" title="${esc(task.title)}">
      <span class="session-title">${esc(task.title)}</span>
      <span class="session-when">${openedAt(task.session)}</span>
    </button>
    ${taskActionButtons(task)}
  </div>`;
}

// C'est ici que l'échec d'une action se lit, donc c'est ici qu'un iTerm muet nous ramène.
function sessionsView() {
  const rows = activeSessions();
  return `<section class="section">
    <div class="section-head">
      <h2 class="view-title">
        ${backButton()}<span>💬 Sessions</span><span class="tally">${rows.length}</span>
      </h2>
    </div>
    <div class="sessions-view">
      ${rows.length ? rows.map(sessionRow).join('') : '<p class="empty">Aucune session ouverte.</p>'}
      ${actionError ? `<p class="hint hint-warn">${esc(actionError)}</p>` : ''}
    </div>
  </section>`;
}
