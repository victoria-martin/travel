/*
  La ligne d'ajout d'un porteur : elle ferme sa liste et porte son total. Le menu s'ouvre sur un
  champ de recherche qui interroge d'un coup les deux vocabulaires — les activités du voyage et ses
  dépenses — parce qu'on cherche un nom sans se demander de quelle table il vient. La frappe ne
  repeint que la liste, sinon le champ perdrait sa saisie à chaque lettre. Les identifiants portent
  le porteur : l'étape et chacune de ses options rendent leur propre menu.
*/

function extraHolderKey(stepId, optionId) {
  return `${stepId}-${optionId || 'step'}`;
}

function extraAddRow(scenario, step, optionId) {
  const total = extrasTotal(step, optionId);
  return /* HTML */ `<div class="step-extra-row">
    ${extraAddDropdown(scenario, step, optionId)}
    <span></span>
    <span class="step-total"
      ><span class="step-budget">${total ? formatEuros(total) : ''}</span></span
    >
  </div>`;
}

function extraAddDropdown(scenario, step, optionId) {
  const key = extraHolderKey(step.id, optionId);
  return inlineDropdown(
    `extra-add:${key}`,
    'extra-add-dropdown',
    /* HTML */ `<summary
        class="step-extra-add"
        title="Rattacher une activité ou une dépense"
        onclick="setTimeout(() => focusExtraSearch('${key}'))"
      >
        ＋ ajouter
      </summary>
      <div class="inline-menu">
        <input
          class="inline-menu-search"
          id="extra-search-${key}"
          type="text"
          placeholder="Activité ou dépense…"
          oninput="repaintExtraOptions('${scenario.id}','${step.id}','${optionId}')"
          onkeydown="extraSearchKeydown(event,'${scenario.id}','${step.id}','${optionId}')"
        />
        <div id="extra-options-${key}">${extraOptions(scenario.id, step.id, optionId)}</div>
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
function extraCreateItems(scenarioId, stepId, optionId, query) {
  if (!query) return '';
  return /* HTML */ `<button
      class="inline-menu-item inline-menu-item-create"
      onclick="createExtraAttraction('${scenarioId}','${stepId}','${optionId}')"
    >
      ＋ Créer l'activité « ${escapeHtml(query)} »
    </button>
    <button
      class="inline-menu-item inline-menu-item-create"
      onclick="createExtraCost('${scenarioId}','${stepId}','${optionId}')"
    >
      ＋ Créer la dépense « ${escapeHtml(query)} »
    </button>`;
}

function extraOptions(scenarioId, stepId, optionId) {
  const step = getStep(scenarioId, stepId);
  const lines = holderExtras(step, optionId);
  const query = extraSearchQuery(extraHolderKey(stepId, optionId));
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
          onclick="attachExtraAttraction('${scenarioId}','${stepId}','${optionId}','${a.id}')"
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
          onclick="attachExtraCost('${scenarioId}','${stepId}','${optionId}','${cost.id}')"
        >
          ${tagLabel(EXPENSE_EMOJI, escapeHtml(costLabel(cost)))}
        </button>`,
      ),
    );
  const creates = extraCreateItems(scenarioId, stepId, optionId, query);
  return groups + creates || '<div class="inline-menu-group">Rien à rattacher</div>';
}

function repaintExtraOptions(scenarioId, stepId, optionId) {
  document.getElementById(`extra-options-${extraHolderKey(stepId, optionId)}`).innerHTML =
    extraOptions(scenarioId, stepId, optionId);
}

// `Entrée` prend la première correspondance, l'activité avant la dépense ; sans aucune, elle crée
// l'activité — créer une dépense reste un clic, les deux genres ne peuvent pas partager la touche.
function extraSearchKeydown(e, scenarioId, stepId, optionId) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const step = getStep(scenarioId, stepId);
  const lines = holderExtras(step, optionId);
  const query = extraSearchQuery(extraHolderKey(stepId, optionId));
  if (!query) return;
  const attraction = attractionMatches(
    query,
    lines.map((line) => line.attractionId).filter(Boolean),
  )[0];
  if (attraction) return attachExtraAttraction(scenarioId, stepId, optionId, attraction.id);
  const cost = costMatches(query, lines.map((line) => line.costId).filter(Boolean))[0];
  if (cost) return attachExtraCost(scenarioId, stepId, optionId, cost.id);
  createExtraAttraction(scenarioId, stepId, optionId);
}

function createExtraAttraction(scenarioId, stepId, optionId) {
  const name = extraSearchQuery(extraHolderKey(stepId, optionId));
  if (!name) return;
  attachExtraAttraction(scenarioId, stepId, optionId, createAttractionNamed(name).id);
}

function createExtraCost(scenarioId, stepId, optionId) {
  const label = extraSearchQuery(extraHolderKey(stepId, optionId));
  if (!label) return;
  attachExtraCost(scenarioId, stepId, optionId, createFixedCostNamed(label).id);
}
