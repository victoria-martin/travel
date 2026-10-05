/*
  Le mot qui manque au milieu d'une saisie : son formulaire (WordAskForm, React) se pose par-dessus
  la modale ouverte sans la re-rendre — le champ en cours d'édition n'est pas encore enregistré.
*/

// onCreate(word) reçoit le mot créé — un consommateur select le repose dans son <select>
// (cf. wordSelectChanged), un menu inline l'applique directement à l'entité.
function askNewWord(bank, onCreate) {
  if (activeAsk) return;
  activeAsk = { kind: 'word', bank, onCreate, onClose: closeAskOverlay };
  render();
}

function createWord(bank, { label, emoji, color }) {
  const { dict, color: hasColor } = WORD_BANKS[bank];
  const word = { key: slugWordKey(label, dict), label, emoji: emoji || '🏷️' };
  if (hasColor) word.color = color;
  dict[word.key] = word;
  prefs.customWords[bank] = (prefs.customWords[bank] || []).concat(word);
  persistPrefs();
  return word;
}

// Le mot créé rejoint le select ouvert et s'y sélectionne, devant l'item ＋ qui ferme la liste ;
// le formulaire en dessous n'est pas re-rendu, il garde ce qui y est déjà tapé.
function selectCreatedWord(id, word) {
  const select = document.getElementById(id);
  const option = new Option(`${word.emoji} ${word.label}`, word.key, true, true);
  select.add(option, select.options[select.options.length - 1]);
  wordSelectValues[id] = word.key;
}
