/*
  Le tableau édite les tags avec le même menu que Filtrer : une case par tag déjà utilisé ailleurs
  dans la collection, et un champ en bas pour celui qui manque — il rejoint le vocabulaire au
  premier cochage, comme une option de loueur tapée depuis une offre. Le champ édité, le getter de
  l'entité, son vocabulaire et le libellé d'ajout tiennent dans des globales : une seule table est
  à l'écran à la fois, chaque ligne les repose en se rendant.
*/
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
  const used = item[tagsCellField] || [];
  const chips = tagChips(used) || `<span class="tags-cell-add">${escapeHtml(tagsCellAddLabel)}</span>`;
  return inlineDropdown(
    `tags-cell:${item.id}`,
    'tags-cell-dropdown',
    /* HTML */ `<summary class="tags-cell-display">${chips}</summary>
      <div class="inline-menu">
        ${tagsCellVocabulary()
          .map((tag) => tagsCellOption(item.id, used, tag))
          .join('')}
        <div class="tags-cell-new">
          <input
            id="tags-cell-input"
            type="text"
            placeholder="Nouveau tag…"
            onkeydown="tagsCellKeydown(event, '${item.id}')"
          />
          <button type="button" class="btn btn-secondary btn-small" onclick="addTagFromCell('${item.id}')">
            ${svgIcon('plus')}
          </button>
        </div>
      </div>`,
  );
}

function tagsCellOption(id, used, tag) {
  return /* HTML */ `<label class="filter-option">
    <input
      type="checkbox"
      ${used.includes(tag) ? 'checked' : ''}
      onchange="toggleCellTag('${id}','${tag}')"
    />
    ${escapeHtml(tag)}
  </label>`;
}

function toggleCellTag(id, tag) {
  const item = tagsCellGetter(id);
  const tags = item[tagsCellField] || (item[tagsCellField] = []);
  const i = tags.indexOf(tag);
  if (i === -1) tags.push(tag);
  else tags.splice(i, 1);
  saveNow();
  repaintTagsCell(id);
}

function tagsCellKeydown(e, id) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  addTagFromCell(id);
}

function addTagFromCell(id) {
  const input = document.getElementById('tags-cell-input');
  const value = input.value.trim();
  if (!value) return;
  toggleCellTag(id, value);
}

function repaintTagsCell(id) {
  const item = tagsCellGetter(id);
  document.getElementById(`tags-cell-${item.id}`).innerHTML = tagsCellBody(item);
  placeOpenInlineMenu();
  const input = document.getElementById('tags-cell-input');
  if (input) input.focus();
}
