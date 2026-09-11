/*
  Le tableau édite les tags sur place : une seule cellule est en édition à la fois, et seul son
  contenu est repeint tant que l'éditeur est ouvert — un render complet réordonnerait la ligne
  sous la souris et arracherait le champ. Le render global attend la fermeture.
*/
let editingTagsId = null;

function tagsCell(a) {
  return /* HTML */ `<div id="tags-cell-${a.id}" class="tags-cell">${tagsCellBody(a)}</div>`;
}

function tagsCellBody(a) {
  return editingTagsId === a.id ? tagsCellEditor(a) : tagsCellDisplay(a);
}

function tagsCellDisplay(a) {
  const chips = tagChips(a.tags) || '<span class="tags-cell-add">+ tag</span>';
  return /* HTML */ `<button
    type="button"
    class="tags-cell-display"
    onclick="openTagsEditor('${a.id}')"
    title="Modifier les tags"
  >
    ${chips}
  </button>`;
}

function tagsCellEditor(a) {
  const used = a.tags || [];
  const options = allTags().filter((tag) => !used.includes(tag));
  return /* HTML */ `<div class="tags-field tags-field-inline">
    ${used
      .map(
        (tag, i) =>
          `<span class="tag-chip tag-chip-editable">${escapeHtml(tag)}<button type="button" class="tag-chip-remove" onmousedown="event.preventDefault()" onclick="removeTagFromCell('${a.id}', ${i})" title="Retirer ce tag">✕</button></span>`,
      )
      .join('')}
    <input
      id="tags-cell-input"
      type="text"
      list="tags-cell-options"
      placeholder="Ajouter un tag…"
      onkeydown="tagsCellKeydown(event, '${a.id}')"
      onchange="addTagFromCell('${a.id}')"
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
  const a = getAccommodation(id);
  a.tags = a.tags || [];
  if (!a.tags.includes(value)) a.tags.push(value);
  saveNow();
  repaintTagsCell(id);
}

function removeTagFromCell(id, index) {
  const a = getAccommodation(id);
  a.tags.splice(index, 1);
  saveNow();
  repaintTagsCell(id);
}

function repaintTagsCell(id) {
  const a = getAccommodation(id);
  document.getElementById(`tags-cell-${a.id}`).innerHTML = tagsCellBody(a);
  const input = document.getElementById('tags-cell-input');
  if (input) input.focus();
}
