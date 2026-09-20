/*
  Une ligne : le nom, le nombre, le montant. Le montant garde la construction du prix d'une étape —
  le prix dérivé en gris derrière le budget saisi — sur une largeur qui tient dans une card.
*/
function extraRow(scenario, holder, line) {
  return /* HTML */ `<div class="step-extra-row">
    ${extraMenu(scenario, holder, line)} ${extraDateField(scenario, holder, line)}
    ${extraCountDropdown(scenario, holder, line)}
    <span class="step-total">
      ${extraAutoPrice(line)}
      <span class="step-budget"
        >${editableText(
          line.budget,
          `setExtraBudget('${scenario.id}','${holder.id}','${line.id}', this.innerText)`,
          { key: `extra:${line.id}:budget`, placeholder: 'Budget…' },
        )}${hasPriceValue(line.budget) ? ' €' : ''}</span
      >
    </span>
  </div>`;
}

function extraDateField(scenario, holder, line) {
  if (!line.attractionId) return '<span></span>';
  return `<input
    class="step-extra-date"
    type="date"
    value="${escapeHtml(line.date || '')}"
    onchange="setExtraDate('${scenario.id}','${holder.id}','${line.id}', this.value)"
    aria-label="Date de l'activité"
  />`;
}

// Sans budget saisi, le prix de ce que la ligne référence reste affiché en gris, comme sur une
// étape — c'est lui qui compte dans le total tant que rien n'est saisi.
function extraAutoPrice(line) {
  if (hasPriceValue(line.budget)) return '';
  const amount = extraAmount(line);
  return amount ? `<span class="step-total-auto">${formatEuros(amount)}</span>` : '';
}
