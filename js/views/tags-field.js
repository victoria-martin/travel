/*
  Le champ tags d'une modale : le champ édité, son libellé et le vocabulaire proposé dépendent de
  l'entité, le reste est commun. La modale rend depuis modal.payload, jamais depuis le DOM, donc un
  tag édite le payload et repeint son seul bloc — un render complet perdrait les champs saisis et
  pas encore enregistrés. Une seule modale est ouverte à la fois : ces trois-là tiennent dans des
  globales.
*/
let tagsFieldName = null;
let tagsFieldOptions = null;

function tagsField(p, { field, label, options }) {
  tagsFieldName = field;
  tagsFieldOptions = options;
  return /* HTML */ `<div class="field">
    <label>${escapeHtml(label)}</label>
    <div id="tags-field" class="tags-field">${tagsFieldBody(p[field] || [])}</div>
  </div>`;
}

function tagsFieldBody(used) {
  const options = tagsFieldOptions().filter((tag) => !used.includes(tag));
  return /* HTML */ `
    ${used
      .map(
        (tag, i) =>
          `<span class="tag-chip tag-chip-editable">${escapeHtml(tag)}<button type="button" class="tag-chip-remove" onclick="removeTagFromField(${i})" title="Retirer">✕</button></span>`,
      )
      .join('')}
    <input
      id="tags-input"
      type="text"
      list="tags-options"
      placeholder="Ajouter…"
      onkeydown="tagsInputKeydown(event)"
      onchange="addTagToField()"
    />
    <datalist id="tags-options">
      ${options.map((tag) => `<option value="${escapeHtml(tag)}"></option>`).join('')}
    </datalist>
  `;
}

function tagsInputKeydown(e) {
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  addTagToField();
}

function addTagToField() {
  const input = document.getElementById('tags-input');
  const value = input.value.trim();
  input.value = '';
  if (!value) return;
  const tags = modal.payload[tagsFieldName];
  if (!tags.includes(value)) tags.push(value);
  repaintTagsField();
}

function removeTagFromField(index) {
  modal.payload[tagsFieldName].splice(index, 1);
  repaintTagsField();
}

function repaintTagsField() {
  document.getElementById('tags-field').innerHTML = tagsFieldBody(modal.payload[tagsFieldName]);
  document.getElementById('tags-input').focus();
}
