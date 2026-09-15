/*
  Le second des deux selects d'une étape : le lieu. Les hébergements viennent en premier, un
  groupe par type et les favoris en tête de chacun ; les villes ferment la liste, et y sont quel
  que soit le type retenu — il ne restreint que les hébergements, une étape se posant dans une
  ville sans qu'on sache encore où l'on dort. Chaque groupe se replie, et dit alors ce qu'il cache.
  Le menu s'ouvre sur un champ de recherche qui interroge le nom et les niveaux du lieu ; la frappe
  ne repeint que la liste, sinon le champ perdrait sa saisie à chaque lettre. Une ville qui manque
  se crée sur place, sous le nom tapé, comme une activité depuis le ＋ d'une carte.
*/
function placeOptionLabel(place) {
  const location = placeLevelsLabel(place);
  return escapeHtml(place.name) + (location ? ` — ${escapeHtml(location)}` : '');
}

function pickStepPlace(scenarioId, stepId, value) {
  openInlineMenu = null;
  setStepPlace(scenarioId, stepId, value);
}

// La pastille de type, juste avant, dit déjà de quel hébergement il s'agit : le lieu n'affiche
// que son nom, qui a besoin de toute la place.
function stepPlaceLabel(step) {
  const city = getCity(step.cityId);
  if (city) return tagLabel('📍', escapeHtml(city.name));
  const acc = getAccommodation(step.accommodationId);
  if (acc) return tagLabel('', escapeHtml(acc.name));
  return tagLabel('', '＋ lieu');
}

function stepPlaceDropdown(scenario, step) {
  return inlineDropdown(
    `place:${step.id}`,
    'place-dropdown',
    /* HTML */ `<summary
        class="inline-tag step-place-tag${stepPlace(step) ? '' : ' inline-tag-empty'}"
        onclick="setTimeout(() => focusPlaceSearch('${step.id}'))"
      >
        ${stepPlaceLabel(step)}
      </summary>
      <div class="inline-menu">
        <input
          class="inline-menu-search"
          id="place-search-${step.id}"
          type="text"
          placeholder="Chercher un lieu…"
          oninput="repaintPlaceOptions('${scenario.id}','${step.id}')"
        />
        <div id="place-options-${step.id}">${placeOptions(scenario.id, step.id)}</div>
      </div>`,
  );
}

function focusPlaceSearch(stepId) {
  const input = document.getElementById(`place-search-${stepId}`);
  if (input) input.focus();
}

function placeSearchQuery(stepId) {
  const input = document.getElementById(`place-search-${stepId}`);
  return input ? input.value.trim() : '';
}

// On cherche un lieu par son nom comme par sa province : le libellé de la liste est la matière.
function placeMatches(place, needle) {
  return `${place.name} ${placeLevelsLabel(place)}`.toLowerCase().includes(needle.toLowerCase());
}

// Un seul menu de lieu est ouvert à la fois : le repli de ses groupes tient dans une globale, et
// survit ainsi aux repeints de la recherche.
const foldedPlaceGroups = new Set();

function togglePlaceGroup(key, scenarioId, stepId) {
  if (foldedPlaceGroups.has(key)) foldedPlaceGroups.delete(key);
  else foldedPlaceGroups.add(key);
  repaintPlaceOptions(scenarioId, stepId);
}

function placeGroup(title, items, toggle, folded) {
  if (!items.length) return '';
  const head = /* HTML */ `<button class="inline-menu-group inline-menu-fold" onclick="${toggle}">
    <span class="inline-menu-caret ${folded ? 'folded' : ''}">⌄</span>
    ${title} ${folded ? `<span class="inline-menu-aside">${items.length}</span>` : ''}
  </button>`;
  return head + (folded ? '' : items.join(''));
}

// Un groupe par type d'hébergement, dans l'ordre du vocabulaire, ceux sans type connu à la fin.
function accommodationTypeGroups(accommodations, item, group) {
  return [...Object.keys(ACCOMMODATION_TYPES), '']
    .map((key) =>
      group(
        key || 'autre',
        key ? accType(key).label : UNSET_ACCOMMODATION_TYPE.label,
        accommodations.filter((a) => accTypeKey(a.type) === key).map(item),
      ),
    )
    .join('');
}

function placeOptions(scenarioId, stepId) {
  const step = getStep(scenarioId, stepId);
  const needle = placeSearchQuery(stepId);
  const type = accTypeKey(step.accommodationType);
  const pick = (value) => `pickStepPlace('${scenarioId}','${stepId}','${value}')`;
  const cities = ofCurrentTravel(state.cities)
    .filter((c) => placeMatches(c, needle))
    .sort((a, b) => a.name.localeCompare(b.name));
  const accommodations = ofCurrentTravel(state.accommodations)
    .filter((a) => (!type || accTypeKey(a.type) === type) && placeMatches(a, needle))
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name));
  const none = /* HTML */ `<button
    class="inline-menu-item ${!step.cityId && !step.accommodationId ? 'selected' : ''}"
    onclick="${pick('')}"
  >
    Aucun lieu choisi
  </button>`;
  // Une recherche déplie tout : un groupe replié cacherait ce qu'on vient de taper.
  const group = (key, title, items) =>
    placeGroup(
      title,
      items,
      `togglePlaceGroup('${key}','${scenarioId}','${stepId}')`,
      !needle && foldedPlaceGroups.has(key),
    );
  // Le ↗ du bout de ligne ouvre la fiche de l'hébergement : il vit à côté du choix, pas dedans,
  // un bouton ne pouvant en contenir un autre.
  const accommodationItem = (a) => `<div class="inline-menu-row">
      <button
        class="inline-menu-item ${step.accommodationId === a.id ? 'selected' : ''}"
        onclick="${pick(`heb:${a.id}`)}"
      >
        ${tagLabel(accType(a.type).emoji, `${a.favorite ? '★ ' : ''}${placeOptionLabel(a)}`)}
      </button>
      ${accommodationSheetButton(a.id)}
    </div>`;
  const groups =
    accommodationTypeGroups(accommodations, accommodationItem, group) +
    group(
      'villes',
      'Villes',
      cities.map(
        (c) => `<button
          class="inline-menu-item ${step.cityId === c.id ? 'selected' : ''}"
          onclick="${pick(`ville:${c.id}`)}"
        >
          ${tagLabel('📍', placeOptionLabel(c))}
        </button>`,
      ),
    );
  const create = placeCreateItem(scenarioId, stepId, needle);
  return none + (groups + create || '<div class="inline-menu-group">Aucun lieu trouvé</div>');
}

// Une ville qui n'est pas encore dans la liste se crée sous le nom tapé : elle ne porte que ce
// nom, le reste se complète depuis la page Villes.
function placeCreateItem(scenarioId, stepId, query) {
  if (!query) return '';
  return /* HTML */ `<button
    class="inline-menu-item inline-menu-item-create"
    onclick="createStepCity('${scenarioId}','${stepId}')"
  >
    ＋ Créer la ville « ${escapeHtml(query)} »
  </button>`;
}

// Le nom est aussi le niveau `city` du lieu, comme le fait la modale : sans lui, la ville ne se
// lirait ni dans un libellé de lieu ni dans un filtre de niveau.
function createStepCity(scenarioId, stepId) {
  const name = placeSearchQuery(stepId);
  if (!name) return;
  const city = { ...emptyCity(), id: uid(), travelId: currentTravelId(), name, city: name };
  upsertCity(city);
  pickStepPlace(scenarioId, stepId, `ville:${city.id}`);
}

function repaintPlaceOptions(scenarioId, stepId) {
  document.getElementById(`place-options-${stepId}`).innerHTML = placeOptions(scenarioId, stepId);
  placeOpenInlineMenu();
}
