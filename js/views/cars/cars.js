function renderCarsView() {
  const items = sortItems('voitures', ofCurrentTravel(state.cars));
  return /* HTML */ `
    ${carsHeader(items)}
    ${
      items.length === 0
        ? emptyState('Aucune voiture', 'Ajoute ta première option de location.')
        : listViewMode.voitures === 'table'
          ? listTable('voitures', items)
          : carCards(items)
    }
  `;
}
