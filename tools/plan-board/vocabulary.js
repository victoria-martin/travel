const fs = require('fs');
const path = require('path');
const { PLAN_STATUSES, planStatus } = require('./statuses.js');
const { PLAN_TYPES, planType } = require('./types.js');
const { PILL_VARIANTS } = require('./pill.js');

// A word typed on the board joins the frozen list it belongs to — both the file, so the next load
// reads it from code, and the live array, which `planType` / `planStatus` close over.
const LISTS = {
  type: { file: 'types.js', array: 'PLAN_TYPES', entries: PLAN_TYPES, fields: ['variant'] },
  status: {
    file: 'statuses.js',
    array: 'PLAN_STATUSES',
    entries: PLAN_STATUSES,
    fields: ['variant'],
  },
};

// PLAN.md tells a type from a status by looking the chunk up in one list then the other, so a word
// held by both would make the line unreadable. The rest is what the bullet format uses as syntax.
const FORBIDDEN = /[·:()—*`|#<>\[\]\n]/;
const taken = (label) => Boolean(planType(label) || planStatus(label));

function validate(kind, { label, emoji, variant }) {
  const list = LISTS[kind];
  if (!list) return 'vocabulaire inconnu';
  if (!label) return 'libellé vide';
  if (label.length > 24) return 'libellé trop long';
  if (FORBIDDEN.test(label)) return 'le libellé ne peut pas porter · : ( ) — * ` | # < > [ ]';
  if (taken(label)) return `« ${label} » est déjà un type ou un statut`;
  if (!emoji || /\s/.test(emoji) || emoji.length > 8) return 'emoji invalide';
  if (/^[\w-]+$/.test(emoji)) return 'emoji invalide';
  if (!PILL_VARIANTS[variant]) return 'couleur inconnue';
  return '';
}

// Prettier's own rule: single quotes, double ones when the value holds an apostrophe.
const quote = (value) => (value.includes("'") ? `"${value}"` : `'${value}'`);

function entryLines(word, fields) {
  const pairs = ['label', 'emoji', ...fields]
    .filter((field) => word[field])
    .map((field) => `${field}: ${quote(word[field])}`);
  const inline = `  { ${pairs.join(', ')} },`;
  if (inline.length <= 100) return [inline];
  return ['  {', ...pairs.map((pair) => `    ${pair},`), '  },'];
}

// The entry lands just above the `];` that closes the array declaration.
function appendToFile(list, word) {
  const file = path.join(__dirname, list.file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const start = lines.findIndex((line) => line.startsWith(`const ${list.array} = [`));
  const end = lines.findIndex((line, index) => index > start && line.trim() === '];');
  if (start === -1 || end === -1) return false;
  lines.splice(end, 0, ...entryLines(word, list.fields));
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  return true;
}

function addWord({ kind, label, emoji, variant }) {
  const word = {
    label: (label || '').trim().replace(/\s+/g, ' '),
    emoji: (emoji || '').trim(),
    variant: (variant || '').trim(),
  };
  const error = validate(kind, word);
  if (error) return { error };

  const list = LISTS[kind];
  const entry = ['label', 'emoji', ...list.fields].reduce(
    (kept, field) => (word[field] ? { ...kept, [field]: word[field] } : kept),
    {},
  );
  if (!appendToFile(list, word)) return { error: `${list.file} est illisible` };
  list.entries.push(entry);
  return { word: entry };
}

module.exports = { addWord };
