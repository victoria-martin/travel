function providersHeaderActions() {
  return /* HTML */ `${listSearchField('prestataires')} ${sortPanel('prestataires')}
  ${columnPicker('prestataires')} ${toolbarSeparator()}
  ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('prestataire')" })}`;
}

function providersCount() {
  return ofCurrentTravel(state.providers).length;
}
