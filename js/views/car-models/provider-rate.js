/*
  Ce que le même modèle coûte chez un loueur ne se saisit nulle part : chaque offre relevée en
  donne un prix par jour, et le loueur porte l'étendue de ce qu'on a vu chez lui. Deux relevés de
  durées différentes ne donnent pas le même chiffre — un loueur est dégressif —, d'où une
  fourchette plutôt qu'une moyenne, qui effacerait l'écart qu'on vient regarder.
*/
function carModelProviderGroups(modelId) {
  const groups = new Map();
  carModelOffers(modelId).forEach((offer) => {
    const providerId = offerRental(offer).providerId || '';
    if (!groups.has(providerId)) groups.set(providerId, { providerId, offers: [] });
    groups.get(providerId).offers.push(offer);
  });
  return [...groups.values()]
    .map((group) => ({
      ...group,
      offers: sortedGroupOffers(group.offers),
      rate: dayPriceRange(group.offers),
    }))
    .sort(compareProviderRates);
}

// Comme les locations elles-mêmes : dans l'ordre où on les prendra, celles sans date à la fin.
function sortedGroupOffers(offers) {
  return [...offers].sort((a, b) =>
    (offerRental(a).pickupDate || '9999').localeCompare(offerRental(b).pickupDate || '9999'),
  );
}

function dayPriceRange(offers) {
  const prices = offers.map(offerDayPrice).filter(Boolean);
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// Le moins cher en tête, c'est ce qu'on vient chercher ; un loueur dont aucune offre ne donne de
// prix par jour ferme la liste.
function compareProviderRates(a, b) {
  if (!a.rate || !b.rate) return (a.rate ? 0 : 1) - (b.rate ? 0 : 1);
  return a.rate.min - b.rate.min;
}

function dayPriceRangeLabel(rate) {
  if (!rate) return '—';
  const bounds =
    rate.max > rate.min
      ? `${formatEuros(rate.min)} – ${formatEuros(rate.max)}`
      : formatEuros(rate.min);
  return `${bounds} / jour`;
}
