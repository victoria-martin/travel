/*
  Ce que la ligne dit du prix : le total, puis ce qu'il vaut par jour et ce que les options
  ajoutent. Un véhicule sans prix n'affiche rien plutôt qu'un zéro.
*/
function carPriceLabels(car) {
  const price = vehiclePrice(car);
  if (!price) return ['—'];
  const day = vehicleDayPrice(car);
  const options = vehicleOptionsTotal(car);
  return [
    formatEuros(vehicleTotal(car)),
    [day ? `${formatEuros(day)} / jour` : '', options ? `options ${formatEuros(options)}` : '']
      .filter(Boolean)
      .join(' · '),
  ].filter(Boolean);
}
