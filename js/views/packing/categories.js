/*
  Une catégorie par item, texte libre : la page Valise groupe le catalogue et la valise du voyage
  dessus, un item ne peut donc vivre que dans un seul groupe. La liste proposée en datalist est
  l'union de ce qui est déjà posé, catalogue et valises confondus.
*/
const UNCATEGORIZED = 'Sans catégorie';

function allPackingCategories() {
  const set = new Set();
  state.packingItems.forEach((i) => i.category && set.add(i.category));
  state.packingListItems.forEach((i) => i.category && set.add(i.category));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}

// Champ catégorie partagé par les deux formulaires (catalogue, item de voyage) : texte libre
// suggéré par datalist, jamais une liste figée.
function packingCategoryField(inputId, value) {
  return /* HTML */ `<div class="field">
    <label>Catégorie</label>
    <input id="${inputId}" type="text" list="${inputId}-options" value="${escapeHtml(value || '')}" />
    <datalist id="${inputId}-options">
      ${allPackingCategories()
        .map((c) => `<option value="${escapeHtml(c)}"></option>`)
        .join('')}
    </datalist>
  </div>`;
}
