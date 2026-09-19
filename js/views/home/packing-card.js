function homePackingCard() {
  const items = travelPackingItems();
  const done = items.filter((i) => i.checked).length;
  return homeCard({
    icon: svgIcon('luggage'),
    title: 'Valise',
    body: items.length
      ? `<p class="home-card-meta">${done}/${items.length} déjà préparé${done > 1 ? 's' : ''}</p>`
      : `<p class="home-card-empty">Rien dans la valise pour l'instant.</p>`,
    cta: items.length ? 'Ouvrir la valise' : 'Composer la valise',
    onclick: `goTo('valise')`,
  });
}
