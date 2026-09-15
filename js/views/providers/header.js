function providersHeaderActions() {
  return /* HTML */ `${sortPanel('prestataires')} ${columnPicker('prestataires')}
  ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('prestataire')" })}`;
}

function providersHeaderSub() {
  const items = ofCurrentTravel(state.providers);
  return `Chez qui on prend les trajets — ${items.length} prestataire${items.length > 1 ? 's' : ''}`;
}
