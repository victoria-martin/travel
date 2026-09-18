/*
  L'onglet Valise du détail : la même valise que la page Valise — scopée au voyage, pas au
  scénario — donc éditable d'ici comme de là-bas. Compact, sur le modèle du bloc Dépenses.
*/
function scenarioPackingBlock() {
  const items = travelPackingItems();
  const done = items.filter((i) => i.checked).length;
  return /* HTML */ `<div class="scenario-extra scenario-extra-packing">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Valise</div>
      ${items.length ? `<strong>${done} / ${items.length}</strong>` : ''}
    </div>
    ${
      items.length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucun item — pioche dans le catalogue ou ajoute un item propre à ce voyage.
          </div>`
        : items.map((item) => scenarioPackingRow(item)).join('')
    }
    <div class="scenario-extra-actions">
      ${packingComposeDropdown()}
      ${toolbarButton({ icon: svgIcon('plus'), label: 'Item', onclick: "openModal('valise-item')" })}
    </div>
  </div>`;
}

function scenarioPackingRow(item) {
  return /* HTML */ `<div class="expense-line">
    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="togglePackingChecked('${item.id}')" />
    <span class="expense-label">${escapeHtml(packingLineLabel(item))}</span>
    ${packingQuantityDropdown(item)}
    <button
      class="icon-btn"
      onclick="removeFromTravelPacking('${item.id}')"
      title="Retirer de la valise"
    >
      ${svgIcon('x')}
    </button>
  </div>`;
}
