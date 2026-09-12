/*
  Toolbar buttons show their icon alone or icon + label. The choice is one preference for the whole
  app, switched from the sidebar and from the ⋮ menu of any list.
*/

function showButtonLabels() {
  return prefs.showButtonLabels !== false;
}

function toggleButtonLabels() {
  prefs.showButtonLabels = !showButtonLabels();
  persistPrefs();
  render();
}

function buttonLabelsOption() {
  return /* HTML */ `<label class="filter-option">
    <input type="checkbox" ${showButtonLabels() ? 'checked' : ''} onchange="toggleButtonLabels()" />
    Textes des boutons
  </label>`;
}
