/*
  Chercher dans une longue liste de mots — les villes d'un voyage, les tags — sans re-rendre : un
  render arracherait le champ et sa saisie à chaque lettre. Les options masquées le sont donc à la
  main, et le rendu suivant retrouve le même état en relisant la recherche en cours.
  Un mot coché reste visible quoi qu'on cherche : un filtre qui s'applique doit se lire.
*/
let filterSearch = '';

function searchFilterOptions(input) {
  filterSearch = input.value;
  input.parentElement.querySelectorAll('[data-search]').forEach((option) => {
    option.hidden = hiddenBySearch(option.dataset.search, option.classList.contains('active'));
  });
}

function hiddenBySearch(value, active) {
  return !active && !matchesFilterSearch(value);
}

function matchesFilterSearch(value) {
  const wanted = filterSearch.trim().toLowerCase();
  return !wanted || value.toLowerCase().includes(wanted);
}

function filterSearchField(placeholder) {
  return /* HTML */ `<input
    class="filter-search"
    type="search"
    placeholder="${placeholder}"
    value="${escapeHtml(filterSearch)}"
    oninput="searchFilterOptions(this)"
  />`;
}
