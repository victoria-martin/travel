// What a task IS about. Several apply at once: a new screen usually needs a new model too.
const PLAN_TYPES = [
  { label: 'page', emoji: '🏷️', variant: 'warning' },
  { label: 'table', emoji: '🏷️', variant: 'warning' },
  { label: 'feature', emoji: '🏷️', variant: 'focus' },
  { label: 'écran', emoji: '🖼️', variant: 'info' },
  { label: 'layout', emoji: '🧩', variant: 'info' },
  { label: 'données', emoji: '🏷️', variant: 'info' },
  { label: 'modal', emoji: '🏷️', variant: 'default' },
  { label: 'ui', emoji: '🧩', variant: 'info' },
  { label: 'modèle', emoji: '🗃️', variant: 'default' },
  { label: 'calcul', emoji: '🧮', variant: 'default' },
  { label: 'intégration', emoji: '🔌', variant: 'warning' },
  { label: 'infra', emoji: '🔌', variant: 'warning' },
  { label: 'fix', emoji: '🐛', variant: 'error' },
  { label: 'refacto', emoji: '🧹', variant: 'default' },
  { label: 'doc', emoji: '📄', variant: 'default' },
  { label: 'archi', emoji: '📄', variant: 'info' },
];

const planType = (label) => PLAN_TYPES.find((type) => type.label === label);

if (typeof module !== 'undefined') module.exports = { PLAN_TYPES, planType };
