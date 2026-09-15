/*
  Ce que la ligne dit du prix : le total, puis ce qu'il vaut par jour et ce que les options
  ajoutent. Un véhicule sans prix n'affiche rien plutôt qu'un zéro.
*/
function offerPriceLabels(offer) {
  const price = offerPrice(offer);
  if (!price) return ['—'];
  const day = offerDayPrice(offer);
  const options = offerOptionsTotal(offer);
  return [
    formatEuros(offerTotal(offer)),
    [day ? `${formatEuros(day)} / jour` : '', options ? `options ${formatEuros(options)}` : '']
      .filter(Boolean)
      .join(' · '),
  ].filter(Boolean);
}
