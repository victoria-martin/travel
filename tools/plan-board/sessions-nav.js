// Une session ouverte est une tâche en cours de travail. Une session porte `closedAt` quand son
// travail est fini — l'entrée reste pour garder le lien vers la conversation, mais elle sort de la
// liste. Une tâche archivée n'y figure pas non plus.
const activeSessions = () =>
  board.tasks
    .filter((task) => task.session && !task.session.closedAt)
    .sort((a, b) => b.session.lastOpenedAt.localeCompare(a.session.lastOpenedAt));

// La barre latérale n'en garde que l'entrée : la liste s'ouvre dans le panneau principal, comme
// une page du plan, et elle se pose au-dessus d'elles puisqu'elle ne se lit pas comme l'une d'elles.
const sessionsNav = () => `<div class="sessions-block">
  <button class="sessions-toggle" data-act="view-sessions" aria-pressed="${inView('sessions')}">
    <span>💬 Sessions</span><span class="tally">${activeSessions().length}</span>
  </button>
</div>`;
