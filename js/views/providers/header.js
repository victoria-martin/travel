function providersHeaderActions() {
  return /* HTML */ `${sortPanel('prestataires')} ${columnPicker('prestataires')}
  ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter', onclick: "openModal('prestataire')" })}`;
}

function providersHeaderSub() {
  const items = ofCurrentTravel(state.providers);
  return `${items.length} prestataire${items.length > 1 ? 's' : ''}`;
}
