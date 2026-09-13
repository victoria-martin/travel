// Trier les sessions porte sur toutes les tâches à la fois : le geste n'appartient à aucune ligne,
// d'où sa place en tête de la liste. Il s'ouvre dans un terminal neuf, sans session suivie — cette
// conversation-là n'a rien à reprendre ensuite.
const closeSessionsButton = () => `<button class="board-skill" data-act="close-sessions"
  title="Trier les sessions dans iTerm">🧹 Trier les sessions</button>`;

async function runCloseSessions() {
  actionError = '';
  try {
    await api('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: CLOSE_SESSIONS_PROMPT, title: 'Sessions' }),
    });
  } catch (error) {
    actionError = `iTerm n’a pas répondu : ${error.message}`;
  }
  renderBoard();
}
