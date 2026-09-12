const fs = require('fs');
const path = require('path');
const { planStatus } = require('./statuses.js');
const { PLAN_TYPES, planType } = require('./types.js');

// TODO export in lib ?

const PLAN_PATH = path.join(__dirname, '..', '..', 'PLAN.md');

// Bullets under this heading are content to type into the app, not dev tasks.
const SKIPPED_SECTION = 'Données à saisir';
const isSkipped = (name) => name === SKIPPED_SECTION;

// A heading may open on an emoji: decoration, and never part of the name a task points at.
const HEADING_EMOJI = /^(\p{Extended_Pictographic}\S*)\s+(.+)$/u;
function splitHeading(text) {
  const heading = String(text || '').trim();
  const match = heading.match(HEADING_EMOJI);
  return match ? { emoji: match[1], name: match[2].trim() } : { emoji: '', name: heading };
}
const headingOf = (line) => splitHeading(line.slice(3));
const headingLine = ({ emoji, name }) => `## ${[emoji, name].filter(Boolean).join(' ')}`;
const sectionIndex = (lines, name) =>
  lines.findIndex((line) => line.startsWith('## ') && headingOf(line).name === name);
const skippedIndex = (lines) => sectionIndex(lines, SKIPPED_SECTION);

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
      section = headingOf(line).name;
      skipping = isSkipped(section);
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
      const { emoji, name } = headingOf(line);
      skipping = isSkipped(name);
      if (!skipping) sections.push({ emoji, name, subsections: [] });
      return;
    }
    if (!skipping && line.startsWith('### ') && sections.length) {
      sections[sections.length - 1].subsections.push(line.slice(4).trim());
    }
  });
  return sections;
}

// A heading typed on its own, ahead of the first task that would have written it. An emoji typed
// in front of the name is kept as one, not as a first word.
function createSection(name) {
  const heading = splitHeading(cleanHeading(name));
  if (!heading.name || isSkipped(heading.name)) return null;
  const lines = readPlan();
  if (sectionRange(lines, heading.name)) return null;
  ensureBlock(lines, heading, '');
  writePlan(lines);
  return listSections();
}

// The heading is the only place a section lives: renaming it carries every task under it along.
function updateSection(name, { emoji = '', title }) {
  const next = { emoji: String(emoji || '').trim(), name: cleanHeading(title) };
  const lines = readPlan();
  const at = sectionIndex(lines, name);
  if (at === -1 || isSkipped(name) || !next.name || isSkipped(next.name)) return null;
  if (next.name !== name && sectionIndex(lines, next.name) !== -1) return null;
  lines[at] = headingLine(next);
  writePlan(lines);
  return listSections();
}

// A section moves as one block — its heading and everything under it. « Données à saisir » stays
// last, so a drop past the last section lands just before it.
function moveSection(name, before) {
  const lines = readPlan();
  const range = sectionRange(lines, name);
  if (!range || isSkipped(name)) return null;

  const block = lines.splice(range.start, range.end - range.start);
  let at = before ? sectionIndex(lines, before) : skippedIndex(lines);
  if (at === -1) at = lines.length;
  lines.splice(at, 0, ...block);
  writePlan(lines);
  return listSections();
}

// A group typed on its own, ahead of the first task that would have written it. A `###` carries
// no emoji: it names a group inside a page, where the page itself is the one that gets an icon.
function createSubsection(section, name) {
  const parent = cleanHeading(section);
  const title = cleanHeading(name);
  const lines = readPlan();
  if (!title || !parent || isSkipped(parent) || !sectionRange(lines, parent)) return null;
  if (subsectionIndex(lines, parent, title) !== -1) return null;
  ensureBlock(lines, { emoji: '', name: parent }, title);
  writePlan(lines);
  return listSections();
}

// The heading is the only place a subsection lives: renaming it carries its tasks along.
function updateSubsection(section, name, title) {
  const next = cleanHeading(title);
  const lines = readPlan();
  const at = subsectionIndex(lines, section, name);
  if (at === -1 || !next) return null;
  if (next !== name && subsectionIndex(lines, section, next) !== -1) return null;
  lines[at] = `### ${next}`;
  writePlan(lines);
  return listSections();
}

// A subsection moves as one block — its `###` and every task under it. The drop names the group it
// lands before, or the page it lands at the end of when there is none after it; dropping it under
// another page moves it there, tasks included.
function moveSubsection(section, name, { toSection, before = '' }) {
  const lines = readPlan();
  const target = cleanHeading(toSection) || section;
  const range = subsectionRange(lines, section, name);
  if (!range || isSkipped(target) || !sectionRange(lines, target)) return null;
  if (target === section && (before === name || range.end === range.start)) return null;

  const block = lines.splice(range.start, range.end - range.start);
  const at = before ? subsectionIndex(lines, target, before) : sectionRange(lines, target).end;
  if (at === -1) return null;
  lines.splice(at, 0, '', ...block);
  writePlan(lines);
  return listSections();
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
  const start = sectionIndex(lines, section);
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && !lines[end].startsWith('## ')) end += 1;
  return { start, end };
}

// A `###` names a group inside one page: two pages may hold the same one, so it is only ever
// looked up within its section.
function subsectionIndex(lines, section, name) {
  const range = sectionRange(lines, section);
  if (!range || !name) return -1;
  for (let at = range.start + 1; at < range.end; at += 1) {
    if (lines[at].startsWith('### ') && lines[at].slice(4).trim() === name) return at;
  }
  return -1;
}

function subsectionRange(lines, section, name) {
  const start = subsectionIndex(lines, section, name);
  if (start === -1) return null;
  const outer = sectionRange(lines, section);
  let end = start + 1;
  while (end < outer.end && !lines[end].startsWith('### ')) end += 1;
  return { start, end };
}

// A scope names a heading; the first task of a brand new one writes it. A `##` goes just before
// « Données à saisir », which stays last because it holds content and not work.
function ensureBlock(lines, heading, subsection) {
  if (!sectionRange(lines, heading.name)) {
    let at = skippedIndex(lines);
    if (at === -1) at = lines.length;
    while (at > 0 && lines[at - 1].trim() === '') at -= 1;
    lines.splice(at, 0, '', headingLine(heading));
  }
  if (!subsection) return;

  const range = sectionRange(lines, heading.name);
  const sub = `### ${subsection}`;
  if (lines.slice(range.start, range.end).some((line) => line.trim() === sub)) return;

  let at = range.end;
  while (at > range.start && lines[at - 1].trim() === '') at -= 1;
  lines.splice(at, 0, '', sub);
}

// A new task lands at the end of its block: after the last task that shares it, or before the
// next heading when the block has none yet.
function insertionLine(lines, tasks, section, subsection) {
  const siblings = tasks.filter(
    (task) => task.section === section && task.subsection === (subsection || ''),
  );
  if (siblings.length) return siblings[siblings.length - 1].endLine + 1;

  const start = subsection
    ? subsectionIndex(lines, section, subsection)
    : sectionIndex(lines, section);
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
  if (isSkipped(block.section)) return null;

  const lines = readPlan();
  ensureBlock(lines, { emoji: '', name: block.section }, block.subsection);
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

// A task moves as one block — its bullet and its wrapped continuation lines. The drop names the
// task it lands before, or the scope it lands at the end of when there is none after it.
function moveTask(id, { before, section, subsection = '' }) {
  const lines = readPlan();
  const task = parseTasks(lines).find((entry) => entry.id === id);
  const scope = { section: cleanHeading(section), subsection: cleanHeading(subsection) };
  if (!task || id === before || !scope.section || isSkipped(scope.section)) return null;

  const block = lines.splice(task.startLine, task.endLine - task.startLine + 1);
  const rest = parseTasks(lines);
  const anchor = before && rest.find((entry) => entry.id === before);
  const at = anchor
    ? anchor.startLine
    : insertionLine(lines, rest, scope.section, scope.subsection);
  if (at === -1) return null;

  // A heading is always followed by a blank line before its first bullet.
  const spacer = (lines[at - 1] || '').startsWith('#') ? [''] : [];
  lines.splice(at, 0, ...spacer, ...block);
  writePlan(lines);
  return listTasks().find((entry) => entry.id === id);
}

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
  createSection,
  updateSection,
  moveSection,
  createSubsection,
  updateSubsection,
  moveSubsection,
  moveTask,
  findTask,
  createTask,
  updateTask,
  removeTask,
  taskMarkdown,
};
