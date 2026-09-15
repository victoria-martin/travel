function renderCarModelsTab() {
  const models = travelCarModels();
  if (!models.length)
    return emptyState(
      'Aucun modèle',
      'Ajoute un modèle, ou tape-le dans une location : il rejoint le catalogue.',
    );
  return `<div class="rental-list">${models.map(carModelCard).join('')}</div>`;
}

function carModelsHeaderActions() {
  return toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('modele')" });
}

function carModelsCount() {
  return travelCarModels().length;
}
