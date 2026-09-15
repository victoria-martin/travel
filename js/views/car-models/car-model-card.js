function carModelCard(model) {
  const groups = carModelProviderGroups(model.id);
  const offers = groups.reduce((total, group) => total + group.offers.length, 0);
  return /* HTML */ `<div class="rental-card">
    <div class="rental-head car-model-head">
      <span class="rental-title">${escapeHtml(model.name)}</span>
      ${carFuelTag(model)} ${carGearboxTag(model)}
      <span class="rental-count">${carModelCountLabel(groups.length, offers)}</span>
    </div>
    <div class="rental-actions">
      ${editButton('modele', model.id)}${deleteButton('carModels', model.id)}
    </div>
    ${groups.length
      ? `<div class="rental-offers">${groups.map(carModelProviderGroup).join('')}</div>`
      : ''}
  </div>`;
}

function carModelCountLabel(providers, offers) {
  return [
    `${providers} loueur${providers > 1 ? 's' : ''}`,
    `${offers} offre${offers > 1 ? 's' : ''}`,
  ].join(' · ');
}
