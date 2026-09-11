const STEP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function stepLetter(idx) {
  return idx < STEP_LETTERS.length ? STEP_LETTERS[idx] : String(idx + 1);
}
