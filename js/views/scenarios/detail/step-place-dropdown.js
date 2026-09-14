/*
  Le second des deux selects d'une option : le lieu. Les hébergements viennent en premier, un
  groupe par type et les favoris en tête de chacun ; les villes ferment la liste, et ne sont là que
  lorsqu'aucun type n'est retenu. Le menu s'ouvre sur un champ de recherche qui interroge le nom et
  les niveaux du lieu ; la frappe ne repeint que la liste, sinon le champ perdrait sa saisie à
  chaque lettre.
*/
function placeOptionLabel(place) {
  const location = placeLevelsLabel(place);
  return escapeHtml(place.name) + (location ? ` — ${escapeHtml(location)}` : '');
}

function pickStepPlace(scenarioId, stepId, optionId, value) {
  openInlineMenu = null;
  setStepPlace(scenarioId, stepId, optionId, value);
}

// La pastille de type, juste avant, dit déjà de quel hébergement il s'agit : le lieu n'affiche
// que son nom, qui a besoin de toute la place.
function optionPlaceLabel(option) {
  const city = getCity(option.cityId);
  if (city) return tagLabel('📍', escapeHtml(city.name));
  const acc = getAccommodation(option.accommodationId);
  if (acc) return tagLabel('', escapeHtml(acc.name));
  return tagLabel('', 'Aucun lieu choisi');
}

function stepPlaceDropdown(scenario, step, option) {
  return inlineDropdown(
    `place:${option.id}`,
    'place-dropdown',
    /* HTML */ `<summary
        class="inline-tag"
        onclick="setTimeout(() => focusPlaceSearch('${option.id}'))"
      >
        ${optionPlaceLabel(option)}
      </summary>
      <div class="inline-menu">
        <input
          class="inline-menu-search"
          id="place-search-${option.id}"
          type="text"
          placeholder="Chercher un lieu…"
          oninput="repaintPlaceOptions('${scenario.id}','${step.id}','${option.id}')"
        />
        <div id="place-options-${option.id}">${placeOptions(scenario.id, step.id, option.id)}</div>
      </div>`,
  );
}

function focusPlaceSearch(optionId) {
  const input = document.getElementById(`place-search-${optionId}`);
  if (input) input.focus();
}

function placeSearchQuery(optionId) {
  const input = document.getElementById(`place-search-${optionId}`);
  return input ? input.value.trim().toLowerCase() : '';
}

// On cherche un lieu par son nom comme par sa province : le libellé de la liste est la matière.
function placeMatches(place, needle) {
  return `${place.name} ${placeLevelsLabel(place)}`.toLowerCase().includes(needle);
}

function placeGroup(title, items) {
  return items.length ? `<div class="inline-menu-group">${title}</div>${items.join('')}` : '';
}

// Un groupe par type d'hébergement, dans l'ordre du vocabulaire, ceux sans type connu à la fin.
function accommodationTypeGroups(accommodations, item) {
  return [...Object.keys(ACCOMMODATION_TYPES), '']
    .map((key) =>
      placeGroup(
        key ? accType(key).label : UNSET_ACCOMMODATION_TYPE.label,
        accommodations.filter((a) => accTypeKey(a.type) === key).map(item),
      ),
    )
    .join('');
}

function placeOptions(scenarioId, stepId, optionId) {
  const option = getStepOption(getStep(scenarioId, stepId), optionId);
  const needle = placeSearchQuery(optionId);
  const type = accTypeKey(option.accommodationType);
  const pick = (value) => `pickStepPlace('${scenarioId}','${stepId}','${optionId}','${value}')`;
  const cities = type
    ? []
    : ofCurrentTravel(state.cities)
        .filter((c) => placeMatches(c, needle))
        .sort((a, b) => a.name.localeCompare(b.name));
  const accommodations = ofCurrentTravel(state.accommodations)
    .filter((a) => (!type || accTypeKey(a.type) === type) && placeMatches(a, needle))
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name));
  const none = /* HTML */ `<button
    class="inline-menu-item ${!option.cityId && !option.accommodationId ? 'selected' : ''}"
    onclick="${pick('')}"
  >
    Aucun lieu choisi
  </button>`;
  const accommodationItem = (a) => `<button
      class="inline-menu-item ${option.accommodationId === a.id ? 'selected' : ''}"
      onclick="${pick(`heb:${a.id}`)}"
    >
      ${tagLabel(accType(a.type).emoji, `${a.favorite ? '★ ' : ''}${placeOptionLabel(a)}`)}
    </button>`;
  const groups =
    accommodationTypeGroups(accommodations, accommodationItem) +
    placeGroup(
      'Villes',
      cities.map(
        (c) => `<button
          class="inline-menu-item ${option.cityId === c.id ? 'selected' : ''}"
          onclick="${pick(`ville:${c.id}`)}"
        >
          ${tagLabel('📍', placeOptionLabel(c))}
        </button>`,
      ),
    );
  return none + (groups || '<div class="inline-menu-group">Aucun lieu trouvé</div>');
}

function repaintPlaceOptions(scenarioId, stepId, optionId) {
  document.getElementById(`place-options-${optionId}`).innerHTML = placeOptions(
    scenarioId,
    stepId,
    optionId,
  );
}
