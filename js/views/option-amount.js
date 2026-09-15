/*
  Ce qu'une option du catalogue d'un loueur coûte sur une durée donnée. La durée est un nombre de
  jours et non la location qui les porte : une location compte sur ses dates, un scénario sur les
  siennes, et c'est le même prix de loueur qui répond aux deux.
*/
const OPTION_REPEATS = {
  day: (days) => days || 1,
  traveler: () => travelerCount() || 1,
};

function optionAmount(option, days) {
  const repeat = OPTION_REPEATS[providerOptionUnit(option.unit).per];
  return priceNumber(option.amount) * (repeat ? repeat(days) : 1);
}

function optionsTotal(options, days) {
  return options.reduce((total, option) => total + optionAmount(option, days), 0);
}
