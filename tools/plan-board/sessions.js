const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const STORE_PATH = path.join(__dirname, '..', '..', '.claude', 'plan-sessions.json');

function read() {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch {
    return { tasks: {}, archived: [] };
  }
}

function write(store) {
  fs.writeFileSync(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
}

function sessionOf(id) {
  return read().tasks[id] || null;
}

function openSession(id) {
  const store = read();
  const existing = store.tasks[id];
  const now = new Date().toISOString();
  if (existing) {
    existing.lastOpenedAt = now;
    delete existing.closedAt;
    write(store);
    return { session: existing, resumed: true };
  }
  const session = { sessionId: randomUUID(), createdAt: now, lastOpenedAt: now };
  store.tasks[id] = session;
  write(store);
  return { session, resumed: false };
}

// A conversation started by hand has no task; attaching it writes the same link the board writes
// when it launches one. An existing link is never overwritten: it points at another conversation.
function attachSession(id, sessionId) {
  const store = read();
  if (store.tasks[id]) return null;
  const now = new Date().toISOString();
  const session = { sessionId, createdAt: now, lastOpenedAt: now };
  store.tasks[id] = session;
  write(store);
  return session;
}

// Closing a session takes its task out of the list without losing the conversation: the id stays,
// so the task still resumes it. Reopening one clears the mark.
function closeSession(id) {
  const store = read();
  const session = store.tasks[id];
  if (!session) return null;
  session.closedAt = new Date().toISOString();
  write(store);
  return session;
}

function archiveTask(task) {
  const store = read();
  store.archived = store.archived.filter((entry) => entry.id !== task.id);
  store.archived.unshift({ ...task, archivedAt: new Date().toISOString() });
  write(store);
}

function listArchived() {
  const store = read();
  return store.archived.map((entry) => ({ ...entry, session: store.tasks[entry.id] || null }));
}

module.exports = {
  sessionOf,
  openSession,
  attachSession,
  closeSession,
  archiveTask,
  listArchived,
};
