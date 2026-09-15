/*
  Le tableau édite les tags sur place : une seule cellule est en édition à la fois, et seul son
  contenu est repeint tant que l'éditeur est ouvert — un render complet réordonnerait la ligne
  sous la souris et arracherait le champ. Le render global attend la fermeture.
  Le champ édité, le getter de l'entité, son vocabulaire et le libellé d'ajout tiennent dans des
  globales, comme dans tags-field.js : une seule table est à l'écran à la fois, chaque ligne les
  repose en se rendant.
*/
let editingTagsId = null;
let tagsCellField = null;
let tagsCellGetter = null;
let tagsCellVocabulary = null;
let tagsCellAddLabel = null;

function tagsCell(item, { field, getItem, vocabulary, addLabel }) {
  tagsCellField = field;
  tagsCellGetter = getItem;
  tagsCellVocabulary = vocabulary;
  tagsCellAddLabel = addLabel;
  return /* HTML */ `<div id="tags-cell-${item.id}" class="tags-cell">${tagsCellBody(item)}</div>`;
}

function tagsCellBody(item) {
  return editingTagsId === item.id ? tagsCellEditor(item) : tagsCellDisplay(item);
}

function tagsCellDisplay(item) {
  const chips =
    tagChips(item[tagsCellField]) ||
    `<span class="tags-cell-add">${escapeHtml(tagsCellAddLabel)}</span>`;
  return /* HTML */ `<button
    type="button"
    class="tags-cell-display"
    onclick="openTagsEditor('${item.id}')"
    title="Modifier"
  >
    ${chips}
  </button>`;
}

function tagsCellEditor(item) {
  const used = item[tagsCellField] || [];
  const options = tagsCellVocabulary().filter((tag) => !used.includes(tag));
  return /* HTML */ `<div class="tags-field tags-field-inline">
    ${used
      .map(
        (tag, i) =>
          `<span class="tag-chip tag-chip-editable">${escapeHtml(tag)}<button type="button" class="tag-chip-remove" onmousedown="event.preventDefault()" onclick="removeTagFromCell('${item.id}', ${i})" title="Retirer">${svgIcon('x')}</button></span>`,
      )
      .join('')}
    <input
      id="tags-cell-input"
      type="text"
      list="tags-cell-options"
      placeholder="Ajouter…"
      onkeydown="tagsCellKeydown(event, '${item.id}')"
      onchange="addTagFromCell('${item.id}')"
      onblur="closeTagsEditor()"
    />
    <datalist id="tags-cell-options">
      ${options.map((tag) => `<option value="${escapeHtml(tag)}"></option>`).join('')}
    </datalist>
  </div>`;
}

function openTagsEditor(id) {
  editingTagsId = id;
  repaintTagsCell(id);
}

function closeTagsEditor() {
  editingTagsId = null;
  render();
}

function tagsCellKeydown(e, id) {
  if (e.key === 'Escape') {
    e.target.value = '';
    e.target.blur();
    return;
  }
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  addTagFromCell(id);
}

function addTagFromCell(id) {
  const input = document.getElementById('tags-cell-input');
  const value = input.value.trim();
  input.value = '';
  if (!value) return;
  const item = tagsCellGetter(id);
  item[tagsCellField] = item[tagsCellField] || [];
  if (!item[tagsCellField].includes(value)) item[tagsCellField].push(value);
  saveNow();
  repaintTagsCell(id);
}

function removeTagFromCell(id, index) {
  const item = tagsCellGetter(id);
  item[tagsCellField].splice(index, 1);
  saveNow();
  repaintTagsCell(id);
}

function repaintTagsCell(id) {
  const item = tagsCellGetter(id);
  document.getElementById(`tags-cell-${item.id}`).innerHTML = tagsCellBody(item);
  const input = document.getElementById('tags-cell-input');
  if (input) input.focus();
}
