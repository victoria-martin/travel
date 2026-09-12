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
    write(store);
    return { session: existing, resumed: true };
  }
  const session = { sessionId: randomUUID(), createdAt: now, lastOpenedAt: now };
  store.tasks[id] = session;
  write(store);
  return { session, resumed: false };
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

module.exports = { sessionOf, openSession, archiveTask, listArchived };
