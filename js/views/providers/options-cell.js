function providerOptionLabel(option) {
  const amount = typedPriceLabel(option.amount, providerOptionUnit(option.unit).suffix);
  return [option.label, amount].filter(Boolean).join(' — ');
}

function providerOptionsCell(p) {
  const options = p.options || [];
  if (!options.length) return '—';
  return options
    .map(
      (option) => `<div class="provider-option">${escapeHtml(providerOptionLabel(option))}</div>`,
    )
    .join('');
}
