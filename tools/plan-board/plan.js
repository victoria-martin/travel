const fs = require('fs');
const path = require('path');
const { planStatus } = require('./statuses.js');

// TODO export in lib ?

const PLAN_PATH = path.join(__dirname, '..', '..', 'PLAN.md');

// Bullets under this heading are content to type into the app, not dev tasks.
const SKIPPED_SECTION = '## Données à saisir';

const TASK_RE = /^- \*\*(.+?)\*\* <!--t:(\w+)-->(.*)$/;
const WIDTH = 100;
const INDENT = '  ';

const readPlan = () => fs.readFileSync(PLAN_PATH, 'utf8').split('\n');
const writePlan = (lines) => fs.writeFileSync(PLAN_PATH, lines.join('\n'), 'utf8');

// `— 🚧 en cours (une note) : le détail…` → the status, its parenthetical, and the rest.
function splitRest(rest) {
  const match = rest.match(/^\s*—\s*(\S+)\s+([^:(]+?)\s*(\([^)]*\))?\s*(?::\s*(.*))?$/);
  const status = match && planStatus(match[2].trim()) ? match[2].trim() : '';
  if (!status) return { status: '', note: '', lead: rest.replace(/^\s*—\s*/, '').trim() };
  return { status, note: match[3] || '', lead: (match[4] || '').trim() };
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

// French quotes stay glued to the word they open or close.
function splitWords(text) {
  const words = [];
  text
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word) => {
      const glued = word === '»' || word === ':' || word === ';';
      if (glued && words.length) words[words.length - 1] += ` ${word}`;
      else if (words.length && words[words.length - 1].endsWith('«'))
        words[words.length - 1] += ` ${word}`;
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
function taskLines(task) {
  const status = planStatus(task.status);
  const head =
    `- **${task.title}** <!--t:${task.id}--> — ` +
    `${status.emoji} ${status.label}${task.note ? ` ${task.note}` : ''}`;
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
const findTask = (id) => listTasks().find((task) => task.id === id);

function updateTask(id, changes) {
  const lines = readPlan();
  const task = parseTasks(lines).find((entry) => entry.id === id);
  if (!task) return null;
  const updated = { ...task, ...changes };
  if (!planStatus(updated.status)) return null;
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

module.exports = { listTasks, findTask, updateTask, removeTask, taskMarkdown };
