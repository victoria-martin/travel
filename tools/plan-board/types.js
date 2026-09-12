// What a task IS about. Several apply at once: a new screen usually needs a new model too.
const PLAN_TYPES = [
  { label: 'page', emoji: '🏷️', variant: 'warning' },
  { label: 'table', emoji: '🏷️', variant: 'warning' },
  { label: 'feature', emoji: '🏷️', variant: 'focus' },
  { label: 'écran', emoji: '🖼️', variant: 'info', hint: 'une page ou une vue à créer' },
  { label: 'layout', emoji: '🧩', variant: 'info' },
  { label: 'données', emoji: '🏷️', variant: 'info' },
  { label: 'modal', emoji: '🏷️', variant: 'default' },
  { label: 'ui', emoji: '🧩', variant: 'info', hint: 'un comportement sur un écran qui existe' },
  { label: 'modèle', emoji: '🗃️', variant: 'default', hint: 'une entité, un champ, une relation' },
  { label: 'calcul', emoji: '🧮', variant: 'default', hint: 'un chiffre dérivé' },
  { label: 'intégration', emoji: '🔌', variant: 'warning', hint: 'ce qui parle à l’extérieur' },
  { label: 'infra', emoji: '🔌', variant: 'warning', hint: '' },
  { label: 'fix', emoji: '🐛', variant: 'error', hint: 'le code contredit une décision prise' },
  {
    label: 'refacto',
    emoji: '🧹',
    variant: 'default',
    hint: 'même comportement, meilleure structure',
  },
  { label: 'doc', emoji: '📄', variant: 'default', hint: 'la doc du dépôt' },
  { label: 'archi', emoji: '📄', variant: 'info', hint: 'archi du projet' },
];

const planType = (label) => PLAN_TYPES.find((type) => type.label === label);

if (typeof module !== 'undefined') module.exports = { PLAN_TYPES, planType };
