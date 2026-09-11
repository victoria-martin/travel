/*
  The modal renders from modal.payload, never from the DOM, so a tag edits the payload and
  repaints its own block only — a full render would drop the fields typed but not yet saved.
*/
function accommodationTagsField(p) {
  const used = p.tags || [];
  const options = allTags().filter((tag) => !used.includes(tag));
  return /* HTML */ `<div class="field">
    <label>Tags</label>
    <div id="tags-field" class="tags-field">${tagsFieldBody(used, options)}</div>
  </div>`;
}

function tagsFieldBody(used, options) {
  return /* HTML */ `
    ${used
      .map(
        (tag, i) =>
          `<span class="tag-chip tag-chip-editable">${escapeHtml(tag)}<button type="button" class="tag-chip-remove" onclick="removeAccommodationTag(${i})" title="Retirer ce tag">✕</button></span>`,
      )
      .join('')}
    <input
      id="tags-input"
      type="text"
      list="tags-options"
      placeholder="Ajouter un tag…"
      onkeydown="tagsInputKeydown(event)"
      onchange="addAccommodationTag()"
    />
    <datalist id="tags-options">
      ${options.map((tag) => `<option value="${escapeHtml(tag)}"></option>`).join('')}
    </datalist>
  `;
}

function tagsInputKeydown(e) {
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  addAccommodationTag();
}

function addAccommodationTag() {
  const input = document.getElementById('tags-input');
  const value = input.value.trim();
  input.value = '';
  if (!value) return;
  const tags = modal.payload.tags;
  if (!tags.includes(value)) tags.push(value);
  repaintTagsField();
}

function removeAccommodationTag(index) {
  modal.payload.tags.splice(index, 1);
  repaintTagsField();
}

function repaintTagsField() {
  const used = modal.payload.tags;
  document.getElementById('tags-field').innerHTML = tagsFieldBody(
    used,
    allTags().filter((tag) => !used.includes(tag)),
  );
  document.getElementById('tags-input').focus();
}
