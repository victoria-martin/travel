/*
  La ligne d'ajout d'un porteur : elle ferme sa liste et porte son total. Le menu s'ouvre sur un
  champ de recherche qui interroge d'un coup les deux vocabulaires — les activités du voyage et ses
  dépenses — parce qu'on cherche un nom sans se demander de quelle table il vient. La frappe ne
  repeint que la liste, sinon le champ perdrait sa saisie à chaque lettre. Les identifiants portent
  le porteur : une étape et un groupe rendent chacun le sien.
*/

function extraAddRow(scenario, holder) {
  const total = extrasTotal(holder);
  return /* HTML */ `<div class="step-extra-row">
    ${extraAddDropdown(scenario, holder)}
    <span></span>
    <span class="step-total"
      ><span class="step-budget">${total ? formatEuros(total) : ''}</span></span
    >
  </div>`;
}

function extraAddDropdown(scenario, holder) {
  const key = holder.id;
  return inlineDropdown(
    `extra-add:${key}`,
    'extra-add-dropdown',
    /* HTML */ `<summary
        class="step-extra-add"
        title="Rattacher une activité ou une dépense"
        onclick="setTimeout(() => focusExtraSearch('${key}'))"
      >
        ${svgIcon('plus')} ajouter
      </summary>
      <div class="inline-menu">
        <input
          class="inline-menu-search"
          id="extra-search-${key}"
          type="text"
          placeholder="Activité ou dépense…"
          oninput="repaintExtraOptions('${scenario.id}','${holder.id}')"
          onkeydown="extraSearchKeydown(event,'${scenario.id}','${holder.id}')"
        />
        <div id="extra-options-${key}">${extraOptions(scenario.id, holder.id)}</div>
      </div>`,
  );
}

function focusExtraSearch(key) {
  const input = document.getElementById(`extra-search-${key}`);
  if (input) input.focus();
}

function extraSearchQuery(key) {
  const input = document.getElementById(`extra-search-${key}`);
  return input ? input.value.trim() : '';
}

function extraOptionGroup(title, items) {
  return items.length ? `<div class="inline-menu-group">${title}</div>${items.join('')}` : '';
}

// Un nom sans correspondance se crée sur place, dans l'un ou l'autre vocabulaire : l'entrée créée
// ne porte alors que son nom, le reste se complète depuis sa page.
function extraCreateItems(scenarioId, holderId, query) {
  if (!query) return '';
  return /* HTML */ `<button
      class="inline-menu-item inline-menu-item-create"
      onclick="createExtraAttraction('${scenarioId}','${holderId}')"
    >
      ${svgIcon('plus')} Créer l'activité « ${escapeHtml(query)} »
    </button>
    <button
      class="inline-menu-item inline-menu-item-create"
      onclick="createExtraCost('${scenarioId}','${holderId}')"
    >
      ${svgIcon('plus')} Créer la dépense « ${escapeHtml(query)} »
    </button>`;
}

function extraOptions(scenarioId, holderId) {
  const holder = getExtraHolder(scenarioId, holderId);
  const lines = holderExtras(holder);
  const query = extraSearchQuery(holderId);
  const attractions = attractionMatches(
    query,
    lines.map((line) => line.attractionId).filter(Boolean),
  );
  const costs = costMatches(query, lines.map((line) => line.costId).filter(Boolean));
  const groups =
    extraOptionGroup(
      'Activités',
      attractions.map(
        (a) => `<button
          class="inline-menu-item"
          onclick="attachExtraAttraction('${scenarioId}','${holderId}','${a.id}')"
        >
          ${tagLabel(attractionType(a.type).emoji, escapeHtml(a.name))}
        </button>`,
      ),
    ) +
    extraOptionGroup(
      'Dépenses',
      costs.map(
        (cost) => `<button
          class="inline-menu-item"
          onclick="attachExtraCost('${scenarioId}','${holderId}','${cost.id}')"
        >
          ${tagLabel(EXPENSE_ICON, escapeHtml(costLabel(cost)))}
        </button>`,
      ),
    );
  const creates = extraCreateItems(scenarioId, holderId, query);
  return groups + creates || '<div class="inline-menu-group">Rien à rattacher</div>';
}

function repaintExtraOptions(scenarioId, holderId) {
  document.getElementById(`extra-options-${holderId}`).innerHTML = extraOptions(
    scenarioId,
    holderId,
  );
  placeOpenInlineMenu();
}

// `Entrée` prend la première correspondance, l'activité avant la dépense ; sans aucune, elle crée
// l'activité — créer une dépense reste un clic, les deux genres ne peuvent pas partager la touche.
function extraSearchKeydown(e, scenarioId, holderId) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const holder = getExtraHolder(scenarioId, holderId);
  const lines = holderExtras(holder);
  const query = extraSearchQuery(holderId);
  if (!query) return;
  const attraction = attractionMatches(
    query,
    lines.map((line) => line.attractionId).filter(Boolean),
  )[0];
  if (attraction) return attachExtraAttraction(scenarioId, holderId, attraction.id);
  const cost = costMatches(query, lines.map((line) => line.costId).filter(Boolean))[0];
  if (cost) return attachExtraCost(scenarioId, holderId, cost.id);
  createExtraAttraction(scenarioId, holderId);
}

function createExtraAttraction(scenarioId, holderId) {
  const name = extraSearchQuery(holderId);
  if (!name) return;
  attachExtraAttraction(scenarioId, holderId, createAttractionNamed(name).id);
}

function createExtraCost(scenarioId, holderId) {
  const label = extraSearchQuery(holderId);
  if (!label) return;
  attachExtraCost(scenarioId, holderId, createFixedCostNamed(label).id);
}
