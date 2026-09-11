let listFilters = { favOnly: false, tags: [] };

function renderAccommodationsView() {
  const mode = listViewMode.hebergements;
  let items = sortItems('hebergements', ofCurrentTravel(state.accommodations));
  const favOnly = !!listFilters.favOnly;
  if (favOnly) items = items.filter((a) => a.favorite);
  const tagFilter = activeTagFilter();
  if (tagFilter.length)
    items = items.filter((a) => (a.tags || []).some((tag) => tagFilter.includes(tag)));
  return /* HTML */ `
    ${accommodationsHeader(items)}
    ${
      items.length === 0
        ? emptyState(
            'Aucun hébergement',
            listFilters.tags.length
              ? 'Aucun hébergement ne porte les tags cochés dans « Trier & filtrer ».'
              : favOnly
                ? "Aucun favori pour l'instant — clique sur l'étoile d'un hébergement pour le marquer."
                : 'Ajoute tes premiers hébergements pour pouvoir les rattacher à tes étapes.',
          )
        : mode === 'table'
          ? listTable('hebergements', items)
          : accommodationCards(items)
    }
  `;
}

// A tag checked then removed from its last accommodation would filter on nothing visible.
function activeTagFilter() {
  const tags = allTags();
  listFilters.tags = listFilters.tags.filter((tag) => tags.includes(tag));
  return listFilters.tags;
}

function tagFilterBlock() {
  const tags = allTags();
  if (!tags.length) return null;
  const active = listFilters.tags;
  return {
    count: active.length,
    html: /* HTML */ `<div class="filter-block">
      <p class="filter-title">Tags</p>
      ${tags
        .map(
          (tag, i) =>
            `<label class="filter-option"><input type="checkbox" ${active.includes(tag) ? 'checked' : ''} onchange="toggleTagFilter(${i})" />${escapeHtml(tag)}</label>`,
        )
        .join('')}
    </div>`,
  };
}

// An accommodation shows as soon as it carries one of the checked tags.
function toggleTagFilter(index) {
  const tag = allTags()[index];
  const active = listFilters.tags;
  listFilters.tags = active.includes(tag) ? active.filter((t) => t !== tag) : [...active, tag];
  render();
}

function toggleFavOnly() {
  listFilters.favOnly = !listFilters.favOnly;
  render();
}

function toggleFavorite(id) {
  const a = getAccommodation(id);
  a.favorite = !a.favorite;
  saveNow();
  render();
}

// dans dossier  accomodation/type/ ou
function setAccommodationType(id, type) {
  getAccommodation(id).type = type;
  saveNow();
  render();
}

function setAccommodationNotes(id, notes) {
  const value = notes.trim();
  getAccommodation(id).notes = value;
  saveNow();
  syncEditable(`accommodation:${id}:notes`, value);
}

function setAccommodationStatus(id, status) {
  getAccommodation(id).status = status;
  saveNow();
  render();
}

// Add filters
