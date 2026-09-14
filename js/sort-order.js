/*
  A dictionary column — statut, type, mode — sorts on the order of its vocabulary rather than on
  its labels, and that order is the reader's to arrange. The chosen list lives in prefs next to
  prefs.sort, and holds only the words that were placed: a word the code adds later is unknown to
  it, so it falls in after them, at the place its declaration gives it.
*/

function sortOrderWords(order) {
  const declared = Object.keys(order.dict);
  const placed = (prefs.sortOrder[order.key] || []).filter((word) => declared.includes(word));
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
  prefs.sortOrder[order.key] = words;
  persistPrefs();
  render();
}
