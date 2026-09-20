/*
  Le mot qui manque au milieu d'une saisie : son formulaire se pose par-dessus la modale ouverte
  sans la re-rendre, comme askNewProvider — le champ en cours d'édition n'est pas encore enregistré.
*/
const WORD_SWATCHES = [
  '#35607d',
  '#c98a3e',
  '#a6462e',
  '#7c8b5e',
  '#3e6259',
  '#6b5b95',
  '#5f6b72',
  '#4e7a9b',
];

let wordAsk = null;

function askNewWord(selectId, bank) {
  if (wordAsk) return;
  const { noun, color } = WORD_BANKS[bank];
  wordAsk = document.createElement('div');
  wordAsk.className = 'overlay overlay-ask';
  wordAsk.onclick = (e) => {
    if (e.target === wordAsk) closeWordAsk();
  };
  wordAsk.onkeydown = (e) => wordAskKeydown(e, selectId, bank);
  wordAsk.innerHTML = /* HTML */ `<div class="modal modal-ask">
    <h3>Ajouter ${noun}</h3>
    <div class="field-row">
      <div class="field" style="flex:0 0 64px;">
        <label>Emoji</label>
        <input id="new-word-emoji" type="text" maxlength="4" placeholder="🏷️" />
      </div>
      <div class="field">
        <label>Libellé</label>
        <input id="new-word-label" type="text" />
      </div>
    </div>
    ${color ? wordSwatchesField() : ''}
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeWordAsk()">Annuler</button>
      <button class="btn" onclick="confirmNewWord('${selectId}','${bank}')">Créer</button>
    </div>
  </div>`;
  document.getElementById('app').appendChild(wordAsk);
  document.getElementById('new-word-label').focus();
}

function wordSwatchesField() {
  return /* HTML */ `<div class="field">
    <label>Couleur</label>
    <div class="accent-swatches">
      ${WORD_SWATCHES.map(
        (c, i) =>
          `<button type="button" class="accent-swatch ${i === 0 ? 'selected' : ''}" data-swatch="${c}" style="background:${c};" onclick="pickWordSwatch('${c}')"></button>`,
      ).join('')}
    </div>
    <input id="new-word-color" type="hidden" value="${WORD_SWATCHES[0]}" />
  </div>`;
}

function pickWordSwatch(color) {
  document.getElementById('new-word-color').value = color;
  wordAsk
    .querySelectorAll('.accent-swatch')
    .forEach((el) => el.classList.toggle('selected', el.dataset.swatch === color));
}

function wordAskKeydown(event, selectId, bank) {
  if (event.key !== 'Enter' && event.key !== 'Escape') return;
  event.preventDefault();
  if (event.key === 'Escape') return closeWordAsk();
  confirmNewWord(selectId, bank);
}

function confirmNewWord(selectId, bank) {
  const label = document.getElementById('new-word-label').value.trim();
  if (!label) return;
  const emoji = document.getElementById('new-word-emoji').value.trim() || '🏷️';
  const { dict, color } = WORD_BANKS[bank];
  const word = { key: slugWordKey(label, dict), label, emoji };
  if (color) word.color = document.getElementById('new-word-color').value;
  dict[word.key] = word;
  prefs.customWords[bank] = (prefs.customWords[bank] || []).concat(word);
  persistPrefs();
  selectCreatedWord(selectId, word);
  closeWordAsk();
}

// Le mot créé rejoint le select ouvert et s'y sélectionne, devant l'item ＋ qui ferme la liste ;
// le formulaire en dessous n'est pas re-rendu, il garde ce qui y est déjà tapé.
function selectCreatedWord(id, word) {
  const select = document.getElementById(id);
  const option = new Option(`${word.emoji} ${word.label}`, word.key, true, true);
  select.add(option, select.options[select.options.length - 1]);
  wordSelectValues[id] = word.key;
}

function closeWordAsk() {
  wordAsk.remove();
  wordAsk = null;
}
