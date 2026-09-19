// Le détail de la famille Transport : la voiture retenue — son prix par jour puis chaque option
// choisie —, ensuite ce que coûte la route pour y arriver, Route restant sa propre ligne avec son
// total, le détail dessous.
function transportDetailRows(scenario) {
  return (
    transportOfferRows(scenario) +
    recapRow('Route', formatEuros(scenarioRoadTotal(scenario)), 'acc-recap-sub acc-recap-subtotal') +
    roadDetailRows(scenario)
  );
}

function transportOfferRows(scenario) {
  const offer = getScenarioOffer(scenario);
  if (!offer) return '';
  const days = totalDays(scenario);
  const price = offerDayPrice(offer);
  const note = price ? `${offerDayPriceLabel(offer)} × ${days} j` : 'prix par jour non renseigné';
  return (
    roadRow('Voiture', note, price ? formatEuros(price * days) : '—') +
    scenarioOfferOptions(scenario)
      .map((option) => transportOfferOptionRow(option, days))
      .join('')
  );
}

function transportOfferOptionRow(option, days) {
  const unit = providerOptionUnit(option.unit);
  const note = unit.suffix ? `${option.amount} € ${unit.suffix}` : '';
  return roadRow(escapeHtml(option.label || 'Sans libellé'), note, formatEuros(optionAmount(option, days)));
}
