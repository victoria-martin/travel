// Le prix saisi à la main s'affiche tel quel : il ne manque que sa monnaie.
function carPriceLabel(price, suffix) {
  if (!price) return '';
  return `${price} €${suffix ? ` ${suffix}` : ''}`;
}
