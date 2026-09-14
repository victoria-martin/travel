function extraCount(line) {
  return parseInt(line.count) || 1;
}

/*
  Le budget saisi sur la ligne remplace le prix de ce qu'elle référence, comme sur une étape, et
  vaut pour la ligne entière : c'est une enveloppe, le nombre ne la multiplie pas. Le prix, lui,
  est unitaire.
*/
function extraAmount(line) {
  if (hasPriceValue(line.budget)) return priceNumber(line.budget);
  const cost = extraCost(line);
  if (cost) return priceNumber(cost.amount) * extraCount(line);
  const attraction = extraAttraction(line);
  const price = attraction ? firmPrice(attraction) : null;
  return price === null ? 0 : price * extraCount(line);
}
