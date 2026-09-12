// How a pill paints. The axis is shared by the two vocabularies: a type and a status of the same
// variant wear the same colours.
const PILL_VARIANTS = {
  success: 'pill-success',
  focus: 'pill-focus',
  info: 'pill-info',
  warning: 'pill-warning',
  error: 'pill-error',
  default: 'pill-default',
};

const pillClass = (variant) => PILL_VARIANTS[variant] || PILL_VARIANTS.default;

// A word of either vocabulary, painted the same way: the emoji, then the label.
function pill(word, attributes = '') {
  if (!word) return '';
  return `<span class="pill ${pillClass(word.variant)}" ${attributes}><span>${word.emoji}</span><span>${word.label}</span></span>`;
}

if (typeof module !== 'undefined') module.exports = { PILL_VARIANTS, pillClass, pill };
