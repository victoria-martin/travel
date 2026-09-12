const fs = require('fs');
const path = require('path');
const { planStatus } = require('./statuses.js');
const { PLAN_TYPES, planType } = require('./types.js');

// TODO export in lib ?

const PLAN_PATH = path.join(__dirname, '..', '..', 'PLAN.md');

// Bullets under this heading are content to type into the app, not dev tasks.
const SKIPPED_SECTION = '## Données à saisir';

const TASK_RE = /^- \*\*(.+?)\*\* <!--t:(\w+)-->(.*)$/;
const WIDTH = 100;
const INDENT = '  ';

const readPlan = () => fs.readFileSync(PLAN_PATH, 'utf8').split('\n');
// PLAN.md holds no fenced block, so a run of blank lines is always an accident of editing.
function writePlan(lines) {
  const tidy = lines.filter((line, index) => line.trim() || (lines[index - 1] || '').trim());
  fs.writeFileSync(PLAN_PATH, tidy.join('\n'), 'utf8');
}

// `— 🗃️ modèle · 🚧 en cours (une note) : le détail…`
// Types and statuses share one `·` list; their vocabularies are disjoint, so each chunk tells them apart.
function splitRest(rest) {
  const head = rest.replace(/^\s*—\s*/, '');
  const colon = head.indexOf(':');
  const meta = colon === -1 ? head : head.slice(0, colon);
  const lead = colon === -1 ? '' : head.slice(colon + 1).trim();

  const parsed = { types: [], status: '', note: '', lead };
  meta.split('·').forEach((chunk) => {
    const note = chunk.match(/\(([^)]*)\)/);
    if (note) parsed.note = note[0];
    const label = chunk
      .replace(/\([^)]*\)/, '')
      .trim()
      .replace(/^\S+\s+/, '');
    if (planType(label)) parsed.types.push(label);
    else if (planStatus(label)) parsed.status = label;
  });
  if (!parsed.status) return { types: [], status: '', note: '', lead: head.trim() };
  return parsed;
}

// PLAN.md hard-wraps at 100 columns; a task is edited and prompted as logical lines.
function foldBody(physical) {
  const folded = [];
  physical.forEach((line) => {
    if (!line.trim()) return folded.push('');
    const previous = folded[folded.length - 1];
    const continues = !/^\s*-\s+/.test(line) && previous;
    if (continues) folded[folded.length - 1] = `${previous} ${line.trim()}`;
    else folded.push(line.replace(/\s+$/, ''));
  });
  return folded;
}

function parseTasks(lines) {
  const tasks = [];
  let section = '';
  let subsection = '';
  let skipping = false;
  let current = null;

  const close = (endLine) => {
    if (current) current.endLine = endLine;
    current = null;
  };

  lines.forEach((line, index) => {
    if (line.startsWith('## ')) {
      close(index - 1);
      skipping = line.trim() === SKIPPED_SECTION;
      section = line.slice(3).trim();
      subsection = '';
      return;
    }
    if (line.startsWith('### ')) {
      close(index - 1);
      subsection = line.slice(4).trim();
      return;
    }
    if (skipping) return;

    const match = line.match(TASK_RE);
    if (match) {
      close(index - 1);
      current = { id: match[2], title: match[1], ...splitRest(match[3]), section, subsection };
      current.startLine = index;
      tasks.push(current);
    } else if (!current && line.startsWith('- ')) {
      close(index - 1);
    }
  });
  close(lines.length - 1);

  tasks.forEach((task) => {
    while (task.endLine > task.startLine && lines[task.endLine].trim() === '') task.endLine -= 1;
    const continuation = lines
      .slice(task.startLine + 1, task.endLine + 1)
      .map((line) => line.replace(/^ {2}/, ''));
    task.body = foldBody([task.lead, ...continuation])
      .join('\n')
      .trim();
    delete task.lead;
  });
  return tasks;
}

const isOpen = (text) =>
  (text.match(/`/g) || []).length % 2 === 1 ||
  (text.match(/\[/g) || []).length > (text.match(/\)/g) || []).length;

// A line never breaks inside a code span, a markdown link, or right after « / before ».
function splitWords(text) {
  const words = [];
  text
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word) => {
      const last = words[words.length - 1];
      const glue =
        last !== undefined &&
        (word === '»' || word === ':' || word === ';' || last.endsWith('«') || isOpen(last));
      if (glue) words[words.length - 1] += ` ${word}`;
      else words.push(word);
    });
  return words;
}

function wrapLine(text, firstPrefix, hangPrefix) {
  const words = splitWords(text);
  if (!words.length) return [firstPrefix.trimEnd()];
  const lines = [];
  let line = firstPrefix + words.shift();
  words.forEach((word) => {
    if (`${line} ${word}`.length > WIDTH) {
      lines.push(line);
      line = hangPrefix + word;
    } else line += ` ${word}`;
  });
  lines.push(line);
  return lines;
}

// A task back to markdown, wrapped at the repo's print width.
const badge = (entry) => `${entry.emoji} ${entry.label}`;

function taskLines(task) {
  const status = planStatus(task.status);
  const types = PLAN_TYPES.filter((type) => task.types.includes(type.label)).map(badge);
  const meta = [...types, `${badge(status)}${task.note ? ` ${task.note}` : ''}`].join(' · ');
  const head = `- **${task.title}** <!--t:${task.id}--> — ${meta}`;
  const logical = task.body.split('\n');
  // A body that opens on a sub-bullet or a blank line starts below the head, not after `: `.
  const inline = logical[0] && logical[0].trim() && !/^\s*-\s+/.test(logical[0]);
  const [first, ...rest] = inline ? logical : ['', ...(task.body.trim() ? logical : [])];
  const lines = wrapLine(first, inline ? `${head} : ` : head, INDENT);
  rest.forEach((line) => {
    if (!line.trim()) return lines.push('');
    const lead = INDENT + line.match(/^ */)[0];
    const bullet = line.trim().match(/^-\s+/);
    if (bullet) {
      lines.push(...wrapLine(line.trim().slice(bullet[0].length), `${lead}- `, `${lead}  `));
    } else lines.push(...wrapLine(line.trim(), lead, lead));
  });
  return lines;
}

const listTasks = () => parseTasks(readPlan());

// The `##` headings are the app's views; `Transverse` is the global one.
function listSections() {
  const sections = [];
  let skipping = false;
  readPlan().forEach((line) => {
    if (line.startsWith('## ')) {
      skipping = line.trim() === SKIPPED_SECTION;
      if (!skipping) sections.push({ name: line.slice(3).trim(), subsections: [] });
      return;
    }
    if (!skipping && line.startsWith('### ') && sections.length) {
      sections[sections.length - 1].subsections.push(line.slice(4).trim());
    }
  });
  return sections;
}

function freshId(lines) {
  const taken = new Set(lines.join('\n').match(/<!--t:(\w+)-->/g) || []);
  let id;
  do {
    id = Math.random().toString(36).slice(2, 6);
  } while (taken.has(`<!--t:${id}-->`));
  return id;
}

function sectionRange(lines, section) {
  const start = lines.findIndex((line) => line.trim() === `## ${section}`);
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && !lines[end].startsWith('## ')) end += 1;
  return { start, end };
}

// A scope names a heading; the first task of a brand new one writes it. A `##` goes just before
// « Données à saisir », which stays last because it holds content and not work.
function ensureBlock(lines, section, subsection) {
  if (!sectionRange(lines, section)) {
    let at = lines.findIndex((line) => line.trim() === SKIPPED_SECTION);
    if (at === -1) at = lines.length;
    while (at > 0 && lines[at - 1].trim() === '') at -= 1;
    lines.splice(at, 0, '', `## ${section}`);
  }
  if (!subsection) return;

  const range = sectionRange(lines, section);
  const heading = `### ${subsection}`;
  if (lines.slice(range.start, range.end).some((line) => line.trim() === heading)) return;

  let at = range.end;
  while (at > range.start && lines[at - 1].trim() === '') at -= 1;
  lines.splice(at, 0, '', heading);
}

// A new task lands at the end of its block: after the last task that shares it, or before the
// next heading when the block has none yet.
function insertionLine(lines, tasks, section, subsection) {
  const siblings = tasks.filter(
    (task) => task.section === section && task.subsection === (subsection || ''),
  );
  if (siblings.length) return siblings[siblings.length - 1].endLine + 1;

  const heading = subsection ? `### ${subsection}` : `## ${section}`;
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return -1;
  let end = start + 1;
  while (end < lines.length && !lines[end].startsWith('## ') && !lines[end].startsWith('### ')) {
    end += 1;
  }
  while (end > start && lines[end - 1].trim() === '') end -= 1;
  return end;
}

const cleanHeading = (name) => (name || '').replace(/^#+\s*/, '').trim();

function createTask({ section, subsection = '', title, types = [], status, body = '' }) {
  const block = { section: cleanHeading(section), subsection: cleanHeading(subsection) };
  if (!title || !title.trim() || !planStatus(status) || !block.section) return null;
  if (block.section === cleanHeading(SKIPPED_SECTION)) return null;

  const lines = readPlan();
  ensureBlock(lines, block.section, block.subsection);
  const at = insertionLine(lines, parseTasks(lines), block.section, block.subsection);
  if (at === -1) return null;

  const task = {
    id: freshId(lines),
    title: title.trim(),
    types: types.filter(planType),
    status,
    note: '',
    body: body.trim(),
  };
  // A heading is always followed by a blank line before its first bullet.
  const spacer = (lines[at - 1] || '').startsWith('#') ? [''] : [];
  lines.splice(at, 0, ...spacer, ...taskLines(task));
  writePlan(lines);
  return task;
}
const findTask = (id) => listTasks().find((task) => task.id === id);

function updateTask(id, changes) {
  const lines = readPlan();
  const task = parseTasks(lines).find((entry) => entry.id === id);
  if (!task) return null;
  const updated = { ...task, ...changes };
  if (!planStatus(updated.status)) return null;
  updated.types = (updated.types || []).filter(planType);
  lines.splice(task.startLine, task.endLine - task.startLine + 1, ...taskLines(updated));
  writePlan(lines);
  return updated;
}

function removeTask(id) {
  const lines = readPlan();
  const task = parseTasks(lines).find((entry) => entry.id === id);
  if (!task) return null;
  let end = task.endLine;
  while (lines[end + 1] === '' && lines[end + 2] === '') end += 1;
  lines.splice(task.startLine, end - task.startLine + 1);
  writePlan(lines);
  return task;
}

// Full markdown of a task, used as the opening prompt of its session.
function taskMarkdown(task) {
  const where = [task.section, task.subsection].filter(Boolean).join(' / ');
  return [`## ${task.title}`, where && `_${where}_`, '', task.body].filter(Boolean).join('\n');
}

module.exports = {
  listTasks,
  listSections,
  findTask,
  createTask,
  updateTask,
  removeTask,
  taskMarkdown,
};
