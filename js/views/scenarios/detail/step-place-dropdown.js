/*
  Le second des deux selects d'une étape : le lieu. Les hébergements viennent en premier, un
  groupe par type et les favoris en tête de chacun ; les lieux ferment la liste, groupés par type
  eux aussi, et y sont quel que soit le type retenu — il ne restreint que les hébergements, une
  étape se posant quelque part sans qu'on sache encore où l'on dort. Chaque groupe se replie, et
  dit alors ce qu'il cache. Le menu s'ouvre sur un champ de recherche qui interroge le nom et les
  niveaux du lieu ; la frappe ne repeint que la liste, sinon le champ perdrait sa saisie à chaque
  lettre. Une ville qui manque se crée sur place, sous le nom tapé.
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
  const place = getAttraction(step.attractionId);
  if (place) return tagLabel(attractionType(place.type).emoji, escapeHtml(place.name));
  const acc = getAccommodation(step.accommodationId);
  if (acc) return tagLabel('', escapeHtml(acc.name));
  return tagLabel('', `${svgIcon('plus')} lieu`);
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

/*
  Un groupe par type, dans l'ordre du vocabulaire, ceux sans type connu à la fin. Les deux familles
  du menu s'y rangent pareil, et le préfixe de la clé leur garde des replis distincts — un type
  « autre » vaut de chaque côté.
*/
function placeTypeGroups(items, { types, unset, keyOf, prefix }, item, group) {
  return [...Object.keys(types), '']
    .map((key) =>
      group(
        `${prefix}-${key || 'autre'}`,
        key ? types[key].label : unset.label,
        items.filter((it) => keyOf(it.type) === key).map(item),
      ),
    )
    .join('');
}

const ACCOMMODATION_PLACE_TYPES = {
  types: ACCOMMODATION_TYPES,
  unset: UNSET_ACCOMMODATION_TYPE,
  keyOf: accTypeKey,
  prefix: 'heb',
};

const ATTRACTION_PLACE_TYPES = {
  types: ATTRACTION_TYPES,
  unset: UNSET_ATTRACTION_TYPE,
  keyOf: attractionTypeKey,
  prefix: 'lieu',
};

function placeOptions(scenarioId, stepId) {
  const step = getStep(scenarioId, stepId);
  const needle = placeSearchQuery(stepId);
  const type = accTypeKey(step.accommodationType);
  const pick = (value) => `pickStepPlace('${scenarioId}','${stepId}','${value}')`;
  const places = ofCurrentTravel(state.attractions)
    .filter((a) => placeMatches(a, needle))
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name));
  const accommodations = ofCurrentTravel(state.accommodations)
    .filter((a) => (!type || accTypeKey(a.type) === type) && placeMatches(a, needle))
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.name.localeCompare(b.name));
  const none = /* HTML */ `<button
    class="inline-menu-item ${!step.attractionId && !step.accommodationId ? 'selected' : ''}"
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
        ${tagLabel(accType(a.type).emoji, `${a.favorite ? svgIcon('star', { fill: true }) + ' ' : ''}${placeOptionLabel(a)}`)}
      </button>
      ${accommodationSheetButton(a.id)}
    </div>`;
  const placeItem = (p) => `<button
      class="inline-menu-item ${step.attractionId === p.id ? 'selected' : ''}"
      onclick="${pick(`lieu:${p.id}`)}"
    >
      ${tagLabel(attractionType(p.type).emoji, `${p.favorite ? svgIcon('star', { fill: true }) + ' ' : ''}${placeOptionLabel(p)}`)}
    </button>`;
  const groups =
    placeTypeGroups(accommodations, ACCOMMODATION_PLACE_TYPES, accommodationItem, group) +
    placeTypeGroups(places, ATTRACTION_PLACE_TYPES, placeItem, group);
  const create = placeCreateItem(scenarioId, stepId, needle);
  return none + (groups + create || '<div class="inline-menu-group">Aucun lieu trouvé</div>');
}

// Un lieu qui n'est pas encore dans la liste se crée sous le nom tapé, en ville : c'est l'étape
// dont on ignore encore le logement. Le reste se complète depuis la page Lieux & activités.
function placeCreateItem(scenarioId, stepId, query) {
  if (!query) return '';
  return /* HTML */ `<button
    class="inline-menu-item inline-menu-item-create"
    onclick="createStepCity('${scenarioId}','${stepId}')"
  >
    ${svgIcon('plus')} Créer la ville « ${escapeHtml(query)} »
  </button>`;
}

// Le nom est aussi le niveau `city` du lieu, comme le fait la modale : sans lui, la ville ne se
// lirait ni dans un libellé de lieu ni dans un filtre de niveau.
function createStepCity(scenarioId, stepId) {
  const name = placeSearchQuery(stepId);
  if (!name) return;
  const place = {
    ...emptyAttraction(),
    id: uid(),
    travelId: currentTravelId(),
    name,
    type: 'city',
    city: name,
  };
  upsertAttraction(place);
  pickStepPlace(scenarioId, stepId, `lieu:${place.id}`);
}

function repaintPlaceOptions(scenarioId, stepId) {
  document.getElementById(`place-options-${stepId}`).innerHTML = placeOptions(scenarioId, stepId);
  placeOpenInlineMenu();
}
