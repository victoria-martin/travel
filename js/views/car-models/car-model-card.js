function carModelCard(model) {
  const offers = carModelOffers(model.id);
  return /* HTML */ `<div class="rental-card">
    <div class="rental-head car-model-head">
      <span class="rental-title">${escapeHtml(model.name)}</span>
      ${carFuelTag(model)} ${carGearboxTag(model)}
      <span class="rental-count"> ${offers.length} offre${offers.length > 1 ? 's' : ''} </span>
    </div>
    <div class="rental-actions">
      ${editButton('modele', model.id)}${deleteButton('carModels', model.id)}
    </div>
    ${
      offers.length
        ? `<div class="rental-vehicles">${offers.map(carModelOfferRow).join('')}</div>`
        : ''
    }
  </div>`;
}
