const http = require('http');
const fs = require('fs');
const path = require('path');
const plan = require('./plan.js');
const vocabulary = require('./vocabulary.js');
const sessions = require('./sessions.js');
const { START_PROMPT } = require('./session-prompts.js');
const iterm = require('./iterm.js');
const { DOING_STATUS, CLOSED_STATUSES } = require('./statuses.js');

const PORT = Number(process.env.PLAN_PORT) || 4321;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
};

function serveAsset(res, name) {
  const file = path.join(__dirname, name);
  if (!file.startsWith(__dirname) || !fs.existsSync(file)) return send(res, 404, { error: name });
  res.writeHead(200, {
    'Content-Type': `${TYPES[path.extname(file)] || 'text/plain'}; charset=utf-8`,
  });
  res.end(fs.readFileSync(file));
}

// The open board reloads itself when a board file is saved. A restart drops this stream, and the
// browser reconnects on its own: the client treats that reconnection as the same signal.
const WATCHED_EXTENSIONS = new Set(['.js', '.css', '.html']);
const listeners = new Set();

function liveReload(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('retry: 200\n\n');
  listeners.add(res);
  res.on('close', () => listeners.delete(res));
}

// One save fires several fs events; collapse them into a single push.
let queued = null;
fs.watch(__dirname, (_event, name) => {
  if (!name || !WATCHED_EXTENSIONS.has(path.extname(name))) return;
  clearTimeout(queued);
  queued = setTimeout(() => listeners.forEach((res) => res.write('data: reload\n\n')), 100);
});

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

function tasksPayload() {
  const tasks = plan.listTasks().map((task) => ({ ...task, session: sessions.sessionOf(task.id) }));
  return { tasks, archived: sessions.listArchived(), sections: plan.listSections() };
}

const taskOrArchived = (id) =>
  plan.findTask(id) || sessions.listArchived().find((entry) => entry.id === id);

// What the launch button will do, without creating anything.
function sessionPreview(res, id) {
  const task = taskOrArchived(id);
  if (!task) return send(res, 404, { error: 'tâche inconnue' });
  const session = sessions.sessionOf(id);
  send(res, 200, {
    session,
    command: iterm.claudeCommand({
      sessionId: session ? session.sessionId : '<uuid généré au lancement>',
      resumed: Boolean(session),
      prompt: START_PROMPT,
    }),
  });
}

// An archived task is out of PLAN.md, and a closed one stays closed.
function markDoing(id) {
  const task = plan.findTask(id);
  if (!task || task.status === DOING_STATUS || CLOSED_STATUSES.includes(task.status)) return;
  plan.updateTask(id, { status: DOING_STATUS });
}

async function openSession(res, id, prompt) {
  if (!taskOrArchived(id)) return send(res, 404, { error: 'tâche inconnue' });

  const { session, resumed } = sessions.openSession(id);
  const command = iterm.claudeCommand({ sessionId: session.sessionId, resumed, prompt });
  try {
    await iterm.openInITerm(command);
    markDoing(id);
    send(res, 200, { session, resumed, command });
  } catch (error) {
    send(res, 500, { error: error.message, command });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const session = url.pathname.match(/^\/api\/tasks\/(\w+)\/session$/);
  const rename = url.pathname.match(/^\/api\/tasks\/(\w+)$/);
  const archive = url.pathname.match(/^\/api\/tasks\/(\w+)\/archive$/);
  const move = url.pathname.match(/^\/api\/tasks\/(\w+)\/move$/);

  if (req.method === 'GET' && url.pathname === '/api/reload') return liveReload(res);

  if (req.method === 'GET' && url.pathname === '/api/tasks') return send(res, 200, tasksPayload());

  if (req.method === 'POST' && url.pathname === '/api/tasks') {
    const created = plan.createTask(await readBody(req));
    if (!created) return send(res, 400, { error: 'section ou titre invalide' });
    return send(res, 200, { ...tasksPayload(), created: created.id });
  }

  if (req.method === 'POST' && url.pathname === '/api/vocabulary') {
    const { error, word } = vocabulary.addWord(await readBody(req));
    return error ? send(res, 400, { error }) : send(res, 200, { word });
  }

  if (req.method === 'POST' && url.pathname === '/api/sections') {
    const { name } = await readBody(req);
    const created = plan.createSection(name);
    if (!created) return send(res, 400, { error: 'section vide ou déjà présente' });
    return send(res, 200, tasksPayload());
  }

  if (req.method === 'PUT' && url.pathname === '/api/sections') {
    const { name, emoji, title } = await readBody(req);
    const updated = plan.updateSection(name, { emoji, title });
    if (!updated) return send(res, 400, { error: 'nom vide, déjà pris, ou section inconnue' });
    return send(res, 200, tasksPayload());
  }

  if (req.method === 'PATCH' && url.pathname === '/api/sections') {
    const { name, before } = await readBody(req);
    const moved = plan.moveSection(name, before);
    if (!moved) return send(res, 400, { error: 'section inconnue' });
    return send(res, 200, tasksPayload());
  }

  if (req.method === 'POST' && url.pathname === '/api/subsections') {
    const { section, name } = await readBody(req);
    const created = plan.createSubsection(section, name);
    if (!created) return send(res, 400, { error: 'nom vide, déjà pris, ou section inconnue' });
    return send(res, 200, tasksPayload());
  }

  if (req.method === 'PUT' && url.pathname === '/api/subsections') {
    const { section, name, title } = await readBody(req);
    const updated = plan.updateSubsection(section, name, title);
    if (!updated) return send(res, 400, { error: 'nom vide, déjà pris, ou groupe inconnu' });
    return send(res, 200, tasksPayload());
  }

  if (req.method === 'PATCH' && url.pathname === '/api/subsections') {
    const { section, name, toSection, before } = await readBody(req);
    const moved = plan.moveSubsection(section, name, { toSection, before });
    if (!moved) return send(res, 400, { error: 'déplacement refusé' });
    return send(res, 200, tasksPayload());
  }

  if (req.method === 'PATCH' && move) {
    const moved = plan.moveTask(move[1], await readBody(req));
    return moved ? send(res, 200, tasksPayload()) : send(res, 400, { error: 'déplacement refusé' });
  }

  if (req.method === 'GET' && session) return sessionPreview(res, session[1]);

  if (req.method === 'POST' && session) {
    const { prompt } = await readBody(req);
    return openSession(res, session[1], prompt);
  }

  if (req.method === 'PATCH' && rename) {
    const { title, status, body, types } = await readBody(req);
    if (!title || !title.trim()) return send(res, 400, { error: 'titre vide' });
    const updated = plan.updateTask(rename[1], { title: title.trim(), status, body, types });
    return updated
      ? send(res, 200, tasksPayload())
      : send(res, 400, { error: 'mise à jour refusée' });
  }

  if (req.method === 'POST' && archive) {
    const removed = plan.removeTask(archive[1]);
    if (!removed) return send(res, 404, { error: 'tâche inconnue' });
    sessions.archiveTask(removed);
    return send(res, 200, tasksPayload());
  }

  if (req.method !== 'GET') return send(res, 405, { error: req.method });
  serveAsset(res, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
});

server.listen(PORT, () => console.log(`plan board → http://localhost:${PORT}`));
