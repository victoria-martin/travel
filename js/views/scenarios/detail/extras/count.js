const MAX_EXTRA_COUNT = 10;
const EXTRA_COUNTS = Array.from({ length: MAX_EXTRA_COUNT }, (_, i) => i + 1);
window.EXTRA_COUNTS = EXTRA_COUNTS;

function extraCountLabel(n) {
  return `×${n}`;
}
