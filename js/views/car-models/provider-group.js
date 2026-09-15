// Un loueur et ce qu'on a relevé chez lui : son tarif tient la rangée, ses offres se lisent dessous
// avec les dates qui expliquent l'écart entre deux d'entre elles.
function carModelProviderGroup(group) {
  return /* HTML */ `<div class="model-provider">
    <div class="model-provider-head">
      <span class="model-provider-name">${escapeHtml(providerName(group.providerId)) || '—'}</span>
      <span class="model-provider-rate">${dayPriceRangeLabel(group.rate)}</span>
    </div>
    ${group.offers.map(carModelOfferRow).join('')}
  </div>`;
}
