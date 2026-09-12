function accommodationsHeader(items) {
  const mode = listViewMode.hebergements;
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Hébergements</h2>
      <p class="view-sub">
        ${Object.values(ACCOMMODATION_TYPES)
          .map((t) => t.label)
          .join(' · ')}
        — ${items.length} enregistré${items.length > 1 ? 's' : ''}
      </p>
    </div>
    <div class="view-header-actions">
      ${mode === 'table' ? sortPanel('hebergements') : ''} ${filterPanel([tagFilterBlock()])}
      ${mode === 'table' ? columnPicker('hebergements') : ''}
      ${toolbarButton({
        icon: '⭐',
        label: 'Favoris',
        onclick: 'toggleFavOnly()',
        active: !!listFilters.favOnly,
      })}
      ${listModeToggle('hebergements', mode)}
      ${
        syncActive()
          ? ''
          : toolbarButton({
              icon: '📋',
              label: 'Importer',
              onclick: "openModal('paste-import')",
            })
      }
      ${toolbarButton({ icon: '+', label: 'Ajouter', onclick: "openModal('accommodation')" })}
      ${toolbarMenu()}
    </div>
  </div>`;
}
