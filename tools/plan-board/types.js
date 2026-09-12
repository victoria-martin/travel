// What a task IS about. Several apply at once: a new screen usually needs a new model too.
const PLAN_TYPES = [
  { label: 'écran', emoji: '🖼️', tone: 'screen', hint: 'une page ou une vue à créer' },
  { label: 'ui', emoji: '🧩', tone: 'ui', hint: 'un comportement sur un écran qui existe' },
  { label: 'modèle', emoji: '🗃️', tone: 'model', hint: 'une entité, un champ, une relation' },
  { label: 'calcul', emoji: '🧮', tone: 'compute', hint: 'un chiffre dérivé' },
  { label: 'intégration', emoji: '🔌', tone: 'io', hint: 'ce qui parle à l’extérieur' },
  { label: 'fix', emoji: '🐛', tone: 'fix', hint: 'le code contredit une décision prise' },
  { label: 'refacto', emoji: '🧹', tone: 'chore', hint: 'même comportement, meilleure structure' },
  { label: 'doc', emoji: '📄', tone: 'doc', hint: 'la doc du dépôt' },
  { label: 'layout', emoji: '🧩', tone: 'screen' },
];

const planType = (label) => PLAN_TYPES.find((type) => type.label === label);

if (typeof module !== 'undefined') module.exports = { PLAN_TYPES, planType };
