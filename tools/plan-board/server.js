const http = require('http');
const fs = require('fs');
const path = require('path');
const plan = require('./plan.js');
const sessions = require('./sessions.js');
const iterm = require('./iterm.js');

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
  return { tasks, archived: sessions.listArchived() };
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
    prompt: plan.taskMarkdown(task),
    command: iterm.claudeCommand({
      sessionId: session ? session.sessionId : '<uuid généré au lancement>',
      resumed: Boolean(session),
    }),
  });
}

async function openSession(res, id, prompt) {
  if (!taskOrArchived(id)) return send(res, 404, { error: 'tâche inconnue' });

  const { session, resumed } = sessions.openSession(id);
  const command = iterm.claudeCommand({ sessionId: session.sessionId, resumed, prompt });
  try {
    await iterm.openInITerm(command);
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

  if (req.method === 'GET' && url.pathname === '/api/tasks') return send(res, 200, tasksPayload());

  if (req.method === 'GET' && session) return sessionPreview(res, session[1]);

  if (req.method === 'POST' && session) {
    const { prompt } = await readBody(req);
    return openSession(res, session[1], prompt);
  }

  if (req.method === 'PATCH' && rename) {
    const { title, status, body } = await readBody(req);
    if (!title || !title.trim()) return send(res, 400, { error: 'titre vide' });
    const updated = plan.updateTask(rename[1], { title: title.trim(), status, body });
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
