/*
  Un `<select multiple>` sur COUNTRIES (js/countries.js) plutôt qu'un texte libre : c'est ce même
  champ que lit ensuite Infos utiles (js/views/country-info/get-country-info.js) et la langue des
  Phrases, donc les deux veulent une valeur reconnue plutôt qu'une saisie libre.
*/
let travelCountrySearch = '';

function travelCountriesField(p) {
  if (!p.countries) p.countries = [];
  return /* HTML */ `<div class="field">
    <label>Pays</label>
    <div id="travel-countries">${travelCountriesBody(p)}</div>
  </div>`;
}

function travelCountriesBody(p) {
  const wanted = travelCountrySearch.trim().toLowerCase();
  const options = COUNTRIES.filter(
    (c) => !wanted || c.label.toLowerCase().includes(wanted) || p.countries.includes(c.code),
  );
  return /* HTML */ `
    <input
      type="search"
      class="filter-search"
      placeholder="Chercher un pays…"
      value="${escapeHtml(travelCountrySearch)}"
      oninput="searchTravelCountries(this)"
    />
    <select id="travel-country-select" multiple size="8" onchange="setTravelCountries(this)">
      ${options
        .map(
          (c) =>
            `<option value="${c.code}" ${p.countries.includes(c.code) ? 'selected' : ''}>${countryFlag(c.code)} ${escapeHtml(c.label)}</option>`,
        )
        .join('')}
    </select>
  `;
}

function searchTravelCountries(input) {
  travelCountrySearch = input.value;
  document.getElementById('travel-countries').innerHTML = travelCountriesBody(modal.payload);
}

function setTravelCountries(select) {
  modal.payload.countries = Array.from(select.selectedOptions).map((option) => option.value);
}
