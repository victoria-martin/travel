function rentalsHeader(rentals) {
  const vehicles = ofCurrentTravel(state.cars).length;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Locations</h2>
      <p class="view-sub">
        ${rentals.length} location${rentals.length > 1 ? 's' : ''} · ${vehicles}
        véhicule${vehicles > 1 ? 's' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${toolbarButton({
        icon: svgIcon('plus'),
        label: 'Nouvelle recherche',
        onclick: "openModal('location')",
      })}
      ${toolbarMenu()}
    </div>
  </div>`;
}
