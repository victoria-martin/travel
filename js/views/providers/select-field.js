/*
  Le select d'un prestataire, partagé par la modale d'une voiture et celle d'un transport : il ne
  propose que ceux de son mode, et son dernier item crée celui qui manque. La valeur choisie se
  retient ici, pour la reposer si la création est annulée — l'item ＋ est une valeur du select.
*/
const NEW_PROVIDER_VALUE = '__new';
const providerSelectValues = {};

function providerSelectField(id, mode, selectedId) {
  const noun = providerNoun(mode);
  providerSelectValues[id] = selectedId || '';
  return /* HTML */ `<div class="field">
    <label>${noun.label}</label>
    <select id="${id}" onchange="providerSelectChanged('${id}','${mode}')">
      <option value="" ${selectedId ? '' : 'selected'}>${UNSET_TRANSPORT_MODE.label}</option>
      ${providersOfMode(mode)
        .map(
          (p) =>
            `<option value="${p.id}" ${selectedId === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`,
        )
        .join('')}
      <option value="${NEW_PROVIDER_VALUE}">＋ Ajouter ${noun.indefinite}</option>
    </select>
  </div>`;
}

function providerSelectChanged(id, mode) {
  const select = document.getElementById(id);
  if (select.value !== NEW_PROVIDER_VALUE) {
    providerSelectValues[id] = select.value;
    return;
  }
  select.value = providerSelectValues[id];
  askNewProvider(id, mode);
}

// Le prestataire créé rejoint le select ouvert et s'y sélectionne, devant l'item ＋ qui ferme la
// liste ; le formulaire en dessous n'est pas re-rendu, il garde ce qui y est déjà tapé.
function selectCreatedProvider(id, provider) {
  const select = document.getElementById(id);
  const option = new Option(provider.name, provider.id, true, true);
  select.add(option, select.options[select.options.length - 1]);
  providerSelectValues[id] = provider.id;
}
