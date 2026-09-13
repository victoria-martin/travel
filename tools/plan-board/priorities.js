// How much a task pulls ahead of the others. A task may carry none: the scale is optional, where
// the status is not.
const PLAN_PRIORITIES = [
  { label: 'haute', emoji: '🔴', variant: 'error' },
  { label: 'moyenne', emoji: '🟡', variant: 'warning' },
  { label: 'basse', emoji: '🔵', variant: 'info' },
  { label: 'à déterminer', emoji: '⚪', variant: 'default' },
];

const planPriority = (label) => PLAN_PRIORITIES.find((priority) => priority.label === label);

if (typeof module !== 'undefined') module.exports = { PLAN_PRIORITIES, planPriority };
