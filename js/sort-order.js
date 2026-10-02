/*
  A column with a fixed set of values — statut, type, mode — sorts by the chosen value order rather
  than by labels. prefs.sortValueOrder stores that order by shared key and holds only placed values;
  values added later follow in declaration order.
*/

function sortOrderWords(order) {
  const declared = Object.keys(order.dict);
  const placed = (prefs.sortValueOrder[order.key] || []).filter((word) => declared.includes(word));
  return [...placed, ...declared.filter((word) => !placed.includes(word))];
}

// An unknown word — the unset value — sorts last.
function sortOrderIndex(order, word) {
  const words = sortOrderWords(order);
  return words.includes(word) ? words.indexOf(word) : words.length;
}

function moveSortOrderWord(order, word, target, before) {
  if (word === target) return;
  const words = sortOrderWords(order).filter((w) => w !== word);
  const at = words.indexOf(target);
  words.splice(at < 0 ? words.length : at + (before ? 0 : 1), 0, word);
  prefs.sortValueOrder[order.key] = words;
  persistPrefs();
  render();
}
