/*
  Les options d'un prestataire : autant de lignes qu'on en ajoute, chacune un libellé, un montant
  et ce qu'il compte. Comme le champ tags, elles éditent modal.payload et repeignent leur seul
  bloc — un render complet perdrait les champs saisis et pas encore enregistrés, et la frappe doit
  écrire dans le payload pour survivre à l'ajout d'une ligne.
  Le libellé se retrouve en le tapant : les options déjà posées ailleurs alimentent son datalist,
  ce qui partage les mots sans rien administrer.
*/
function emptyProviderOption() {
  return { id: uid(), label: '', amount: '', unit: 'flat' };
}

function providerOptionLabels() {
  const labels = ofCurrentTravel(state.providers).flatMap((p) =>
    (p.options || []).map((option) => option.label),
  );
  return [...new Set(labels.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function providerOptionsField(p) {
  if (!p.options) p.options = [];
  return /* HTML */ `<div class="field">
    <label>Options</label>
    <div id="provider-options">${providerOptionsRows(p.options)}</div>
    <datalist id="provider-option-labels">
      ${providerOptionLabels()
        .map((label) => `<option value="${escapeHtml(label)}"></option>`)
        .join('')}
    </datalist>
  </div>`;
}

function providerOptionsRows(options) {
  return /* HTML */ `${options.map(providerOptionRow).join('')}
    <button type="button" class="btn btn-ghost btn-small" onclick="addProviderOption()">
      ${svgIcon('plus')} Ajouter une option
    </button>`;
}

function providerOptionRow(option, index) {
  return /* HTML */ `<div class="provider-option-row">
    <input
      type="text"
      list="provider-option-labels"
      placeholder="Nom de l'option"
      value="${escapeHtml(option.label)}"
      oninput="setProviderOptionField(${index},'label',this.value)"
    />
    <input
      type="text"
      class="provider-option-amount"
      placeholder="Montant"
      value="${escapeHtml(option.amount)}"
      oninput="setProviderOptionField(${index},'amount',this.value)"
    />
    <select onchange="setProviderOptionField(${index},'unit',this.value)">
      ${Object.entries(PROVIDER_OPTION_UNITS)
        .map(
          ([key, unit]) =>
            `<option value="${key}" ${option.unit === key ? 'selected' : ''}>${unit.label}</option>`,
        )
        .join('')}
    </select>
    <button
      type="button"
      class="icon-btn"
      onclick="removeProviderOption(${index})"
      title="Retirer cette option"
    >
      ${svgIcon('x')}
    </button>
  </div>`;
}

function setProviderOptionField(index, field, value) {
  modal.payload.options[index][field] = value;
}

function addProviderOption() {
  modal.payload.options.push(emptyProviderOption());
  repaintProviderOptions();
  const rows = document.querySelectorAll('#provider-options .provider-option-row');
  if (rows.length) rows[rows.length - 1].querySelector('input').focus();
}

function removeProviderOption(index) {
  modal.payload.options.splice(index, 1);
  repaintProviderOptions();
}

function repaintProviderOptions() {
  document.getElementById('provider-options').innerHTML = providerOptionsRows(
    modal.payload.options,
  );
}
