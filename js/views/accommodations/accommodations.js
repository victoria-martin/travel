function renderAccommodationsView() {
  const mode = listViewMode.hebergements;
  let items = [...state.accommodations].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  const favOnly = !!listFilters.favOnly;
  if (favOnly) items = items.filter((a) => a.favorite);
  return /* HTML */ `
    ${accommodationsHeader(items)}
    ${
      items.length === 0
        ? emptyState(
            'Aucun hébergement',
            favOnly
              ? "Aucun favori pour l'instant — clique sur l'étoile d'un hébergement pour le marquer."
              : 'Ajoute tes premiers hébergements pour pouvoir les rattacher à tes étapes.',
          )
        : mode === 'table'
          ? accommodationTable(items)
          : accommodationCards(items)
    }
  `;
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
