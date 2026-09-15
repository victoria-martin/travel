function vehicleRow(car) {
  return /* HTML */ `<div class="vehicle-row">
    ${defaultCarCell(car)}
    <span class="vehicle-model">
      ${escapeHtml(car.model) || 'Sans modèle'}
      <span class="row-notes">${carNotesEditable(car)}</span>
    </span>
    ${carFuelTag(car)} ${carGearboxTag(car)} ${carStatusTag(car)}
    <span class="vehicle-price">${carPriceLabels(car).join(' · ')}</span>
    <span class="vehicle-options">${vehicleOptionLabels(car)}</span>
    <span class="vehicle-actions">
      ${editButton('voiture', car.id)}${duplicateButton(`duplicateCar('${car.id}')`)}${deleteButton('cars', car.id)}
    </span>
  </div>`;
}

// Les options retenues se lisent sur la ligne ; les ajouter passe par la fiche du véhicule.
function vehicleOptionLabels(car) {
  return vehicleOptions(car)
    .map((option) => `<span class="tag-chip">${escapeHtml(option.label)}</span>`)
    .join('');
}
