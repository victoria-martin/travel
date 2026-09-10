/*
  Édition inline : le blur enregistre sans re-render, pour ne pas arracher le champ ni les
  boutons voisins sous la souris. Les champs partageant une même clé sont resynchronisés à la main.
*/

function editableText(value, handler, { key = '', placeholder = '…' } = {}) {
  return `<span class="editable" contenteditable="true" data-key="${key}" data-placeholder="${placeholder}" onkeydown="commitOnEnter(event)" onblur="${handler}">${escapeHtml(value || '')}</span>`;
}

function commitOnEnter(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  e.target.blur();
}

function syncEditable(key, value) {
  document.querySelectorAll(`[data-key="${key}"]`).forEach((el) => {
    if (el.innerText.trim() !== value) el.innerText = value;
  });
}
