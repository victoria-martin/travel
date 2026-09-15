// Le logo est une URL d'image : tant qu'elle manque, la pastille porte l'initiale du nom.
function providerLogo(p) {
  if (p.logo)
    return `<img class="provider-logo" src="${escapeHtml(p.logo)}" alt="${escapeHtml(p.name)}" />`;
  return `<span class="provider-logo provider-logo-empty">${escapeHtml((p.name || '?').slice(0, 1).toUpperCase())}</span>`;
}
