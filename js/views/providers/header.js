function providersHeaderActions() {
  return /* HTML */ `${sortPanel('prestataires')} ${columnPicker('prestataires')}
  ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('prestataire')" })}`;
}

function providersCount() {
  return ofCurrentTravel(state.providers).length;
}
