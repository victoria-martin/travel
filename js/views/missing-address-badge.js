// Pastille d'avertissement quand un hébergement ou une attraction n'a pas d'adresse renseignée.
function missingAddressIndicator(item) {
  if (item.address) return '';
  return /* HTML */ `<span class="warning-badge" title="Pas d'adresse renseignée">
    ${svgIcon('triangle-alert')}
  </span>`;
}
