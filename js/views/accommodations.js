function renderAccommodationsView() {
  const mode = listViewMode.hebergements;
  pruneFilterLevels('hebergements');
  const items = listSearchItems('hebergements', resourceItems('hebergements')).filter(
    (a) => keptByFavOnly(a) && keptByFilters('hebergements', a),
  );
  return /* HTML */ `
    ${accommodationsHeader(items)}
    ${
      items.length === 0
        ? emptyState(
            'Aucun hébergement',
            activeFilterCount('hebergements') || favOnly
              ? 'Aucun hébergement ne passe les filtres actifs — décoche une valeur dans « Filtrer ».'
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
