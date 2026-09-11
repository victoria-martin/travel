function renderFixedCostsView() {
  const items = sortItems('charges', state.fixedCosts);
  return /* HTML */ `
    ${fixedCostsHeader(items)}
    ${
      items.length === 0
        ? emptyState('Aucune charge', 'Ajoute un péage, une assurance ou un abonnement.')
        : listViewMode.charges === 'table'
          ? listTable('charges', items)
          : fixedCostCards(items)
    }
  `;
}
