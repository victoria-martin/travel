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

if (typeof module !== 'undefined') module.exports = { PILL_VARIANTS, pillClass };
