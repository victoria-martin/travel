// La valise du voyage ouvert : ce qu'on compose pour ce voyage, catalogue et items propres mêlés.
function travelPackingSection() {
  const items = sortItems('valiseVoyage', travelPackingItems());
  const done = items.filter((i) => i.checked).length;
  return /* HTML */ `<section class="list-section">
    <div class="list-section-head">
      <h3 class="list-section-title">
        Valise du voyage${items.length ? ` — ${done} / ${items.length}` : ''}
      </h3>
      <div class="list-section-actions">
        ${sortPanel('valiseVoyage')} ${columnPicker('valiseVoyage')} ${toolbarSeparator()}
        ${packingComposeDropdown()}
        ${toolbarButton({
          icon: svgIcon('plus'),
          label: 'Item du voyage',
          onclick: "openModal('valise-item')",
        })}
      </div>
    </div>
    ${
      items.length === 0
        ? emptyState(
            'Valise vide',
            'Pioche dans le catalogue ci-dessous, ou ajoute un item propre à ce voyage.',
          )
        : listTable('valiseVoyage', items)
    }
  </section>`;
}
