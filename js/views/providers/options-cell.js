// Le prix saisi à la main s'affiche tel quel : il ne manque que sa monnaie et ce qu'il compte.
function providerOptionLabel(option) {
  const unit = providerOptionUnit(option.unit);
  const amount = option.amount ? `${option.amount} €${unit.suffix ? ` ${unit.suffix}` : ''}` : '';
  return [option.label, amount].filter(Boolean).join(' — ');
}
