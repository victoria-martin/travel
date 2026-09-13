/*
  Règle transverse « budget et prix » : le prix est une fourchette amountMin / amountMax, le
  budget l'enveloppe qu'on se donne. Une entité sans prix EST une enveloppe, donc la fourchette
  gagne dès qu'un de ses deux montants est saisi, et la ligne dit laquelle des deux s'affiche.
*/

// Un prix se saisit à la main ("120", "1 200,50 €") : on n'en garde que le nombre.
function priceNumber(value) {
  const n = parseFloat(
    String(value == null ? '' : value)
      .replace(',', '.')
      .replace(/[^0-9.]/g, ''),
  );
  return Number.isFinite(n) ? n : 0;
}

function formatEuros(amount) {
  return `${Math.round(amount).toLocaleString('fr-FR')} €`;
}

function hasPriceValue(value) {
  return String(value == null ? '' : value).trim() !== '';
}

function priceRange(entity) {
  const bounds = [entity.amountMin, entity.amountMax].filter(hasPriceValue).map(priceNumber);
  if (!bounds.length) return '';
  const [min, max] = [Math.min(...bounds), Math.max(...bounds)];
  return min === max ? formatEuros(min) : `${formatEuros(min)} – ${formatEuros(max)}`;
}

function priceLabel(entity) {
  const price = priceRange(entity);
  if (price) return price;
  return hasPriceValue(entity.budget) ? `budget ${formatEuros(priceNumber(entity.budget))}` : '—';
}
