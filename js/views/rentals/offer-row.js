function offerRow(offer) {
  return /* HTML */ `<div class="rental-offer">
    ${defaultOfferCell(offer)}
    <span class="rental-offer-model">
      ${escapeHtml(offerModelName(offer)) || 'Sans modèle'}
      <span class="row-notes">${offerNotesEditable(offer)}</span>
    </span>
    ${offerFuelTag(offer)} ${offerGearboxTag(offer)} ${offerStatusTag(offer)}
    <span class="rental-offer-price">${offerPriceLabels(offer).join(' · ')}</span>
    <span class="rental-offer-options">${offerOptionLabels(offer)}</span>
    <span class="rental-offer-actions">
      ${editButton('voiture', offer.id)}${duplicateButton(`duplicateOffer('${offer.id}')`)}${deleteButton('offers', offer.id)}
    </span>
  </div>`;
}

// Les options retenues se lisent sur la ligne ; les ajouter passe par la fiche du véhicule.
function offerOptionLabels(offer) {
  return offerOptions(offer)
    .map((option) => `<span class="tag-chip">${escapeHtml(option.label)}</span>`)
    .join('');
}
