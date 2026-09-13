// The lifecycle of a backlog item, from the first idea to what will never be done.
// Shared by the server (it writes the label back into PLAN.md) and the board.
const PLAN_STATUSES = [
  { label: 'à trier', emoji: '📥', variant: 'default' },
  { label: 'à faire', emoji: '⏳', variant: 'focus' },
  { label: 'idée', emoji: '💡', variant: 'default' },
  { label: 'en cours', emoji: '🚧', variant: 'info' },
  { label: 'en attente', emoji: '⏸️', variant: 'warning' },
  { label: 'plus tard', emoji: '🌙', variant: 'default' },
  { label: 'fait', emoji: '✅', variant: 'success' },
  { label: 'abandonné', emoji: '🚫', variant: 'error' },
  { label: 'à planifier', emoji: '📓', variant: 'default' },
  { label: 'à étudier', emoji: '🔍', variant: 'default' },
];

// Where a task starts its life, whether it is typed in the drawer or at the end of a list. It
// carries no priority yet: the scale is optional, and sorting it out is part of the triage.
const NEW_STATUS = 'à trier';

// Opening its session is the gesture that starts the work, so the board writes it down — unless
// the task is already over, which reopening a session does not undo.
const DOING_STATUS = 'en cours';
const DONE_STATUS = 'fait';
const CLOSED_STATUSES = [DONE_STATUS, 'abandonné'];

const planStatus = (label) => PLAN_STATUSES.find((status) => status.label === label);

if (typeof module !== 'undefined')
  module.exports = {
    PLAN_STATUSES,
    NEW_STATUS,
    DOING_STATUS,
    DONE_STATUS,
    CLOSED_STATUSES,
    planStatus,
  };
