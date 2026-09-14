function renderAccommodationsView() {
  const mode = listViewMode.hebergements;
  pruneListFilters();
  const items = sortItems('hebergements', ofCurrentTravel(state.accommodations)).filter(
    keptByListFilters,
  );
  return /* HTML */ `
    ${accommodationsHeader(items)}
    ${
      items.length === 0
        ? emptyState(
            'Aucun hébergement',
            activeListFilterCount()
              ? 'Aucun hébergement ne passe les filtres actifs — décoche une pastille dans « Filtrer ».'
              : 'Ajoute tes premiers hébergements pour pouvoir les rattacher à tes étapes.',
          )
        : mode === 'table'
          ? listTable('hebergements', items)
          : accommodationCards(items)
    }
  `;
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

function setAccommodationPrice(id, price) {
  const value = price.trim();
  getAccommodation(id).price = value;
  saveNow();
  syncEditable(`accommodation:${id}:price`, value);
}

function setAccommodationStatus(id, status) {
  getAccommodation(id).status = status;
  saveNow();
  render();
}

// Add filters
