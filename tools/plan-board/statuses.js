// The lifecycle of a backlog item, from the first idea to what will never be done.
// Shared by the server (it writes the label back into PLAN.md) and the board.
const PLAN_STATUSES = [
  { label: 'idée', emoji: '💡', tone: 'idea' },
  { label: 'à trancher', emoji: '🤔', tone: 'open' },
  { label: 'acté', emoji: '📌', tone: 'settled' },
  { label: 'à faire', emoji: '⏳', tone: 'todo' },
  { label: 'en cours', emoji: '🚧', tone: 'doing' },
  { label: 'en attente', emoji: '⏸️', tone: 'paused' },
  { label: 'plus tard', emoji: '🌙', tone: 'later' },
  { label: 'fait', emoji: '✅', tone: 'done' },
  { label: 'abandonné', emoji: '🚫', tone: 'dropped' },
];

// Where a task starts its life, whether it is typed in the drawer or at the end of a list.
const NEW_STATUS = 'à faire';

const planStatus = (label) => PLAN_STATUSES.find((status) => status.label === label);

if (typeof module !== 'undefined') module.exports = { PLAN_STATUSES, NEW_STATUS, planStatus };
