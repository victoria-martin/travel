function rentalsHeader(rentals) {
  const offers = ofCurrentTravel(state.offers).length;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Locations</h2>
      <p class="view-sub">
        ${rentals.length} location${rentals.length > 1 ? 's' : ''} · ${offers}
        véhicule${offers > 1 ? 's' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${toolbarButton({
        icon: svgIcon('plus'),
        label: 'Nouvelle recherche',
        onclick: "openModal('location')",
      })}
      ${toolbarSeparator()} ${toolbarMenu()}
    </div>
  </div>`;
}
