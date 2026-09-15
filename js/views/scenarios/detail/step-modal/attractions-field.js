/*
  Le champ activités d'une étape : plusieurs à la fois, cherchées par leur nom. Comme le champ tags,
  il édite modal.payload et repeint son seul bloc — un render complet perdrait les champs saisis et
  pas encore enregistrés.
  Chips et résultats sont deux blocs séparés : la frappe ne repeint que les résultats, sinon le
  champ perdrait sa saisie à chaque lettre.
  Il ne montre que les activités de l'étape : les dépenses et les lignes communes à un groupe se
  rattachent sur la carte, où l'on voit à quel porteur elles appartiennent.
  Le résultat retenu est un rang dans la liste affichée et non un identifiant : le survol et les
  flèches le posent au même endroit, `Entrée` clique celui qui est marqué. Il vit dans un global,
  comme `openInlineMenu`, parce que le bloc se reconstruit à chaque frappe.
*/
let activeAttractionResult = 0;

function stepAttractionsField(p) {
  if (!p.extras) p.extras = [];
  return /* HTML */ `<div class="field">
    <label>Activités</label>
    <div id="step-attractions" class="tags-field">${stepAttractionsChips(p.extras)}</div>
    <div id="step-attractions-results" class="attraction-results"></div>
  </div>`;
}

function stepFormAttractions(extras) {
  return extras.filter((line) => !line.costId);
}

function stepAttractionName(line) {
  const attraction = extraAttraction(line);
  return attraction ? attraction.name : 'Activité supprimée';
}

function stepAttractionsChips(extras) {
  return /* HTML */ `
    ${stepFormAttractions(extras)
      .map(
        (line) =>
          `<span class="tag-chip tag-chip-editable">${escapeHtml(stepAttractionName(line))}<button type="button" class="tag-chip-remove" onclick="removeStepAttraction('${line.id}')" title="Retirer cette activité">${svgIcon('x')}</button></span>`,
      )
      .join('')}
    <input
      id="step-attractions-input"
      type="text"
      placeholder="Chercher une activité…"
      onfocus="repaintStepAttractionResults()"
      onblur="closeStepAttractionResults()"
      oninput="repaintStepAttractionResults()"
      onkeydown="stepAttractionsKeydown(event)"
    />
  `;
}

function stepAttractionQuery() {
  const input = document.getElementById('step-attractions-input');
  return input ? input.value.trim() : '';
}

function stepAttractionsUsed() {
  return stepFormAttractions(modal.payload.extras).map((line) => line.attractionId);
}

const ATTRACTION_RESULT_KEYS = {
  ArrowDown: (items) => moveActiveAttractionResult(items, 1),
  ArrowUp: (items) => moveActiveAttractionResult(items, -1),
  Enter: (items) => items[activeAttractionResult] && items[activeAttractionResult].click(),
  Escape: () => closeStepAttractionResults(),
};

function stepAttractionsKeydown(e) {
  const handler = ATTRACTION_RESULT_KEYS[e.key];
  if (!handler) return;
  e.preventDefault();
  handler(attractionResultItems());
}

function attractionResultItems() {
  return [...document.querySelectorAll('#step-attractions-results .attraction-result')];
}

function moveActiveAttractionResult(items, delta) {
  if (!items.length) return;
  activeAttractionResult = (activeAttractionResult + delta + items.length) % items.length;
  paintActiveAttractionResult();
  items[activeAttractionResult].scrollIntoView({ block: 'nearest' });
}

// Le survol repose le rang sans reconstruire la liste : la souris et les flèches marquent le même.
function setActiveAttractionResult(index) {
  activeAttractionResult = index;
  paintActiveAttractionResult();
}

function paintActiveAttractionResult() {
  attractionResultItems().forEach((item, index) => {
    item.classList.toggle('attraction-result-active', index === activeAttractionResult);
  });
}

function addStepAttraction(attractionId) {
  modal.payload.extras.push({ ...emptyExtra(), attractionId });
  document.getElementById('step-attractions-input').value = '';
  repaintStepAttractionsField();
}

function removeStepAttraction(lineId) {
  modal.payload.extras = modal.payload.extras.filter((line) => line.id !== lineId);
  repaintStepAttractionsField();
}

function createStepAttraction() {
  const name = stepAttractionQuery();
  if (!name) return;
  addStepAttraction(createAttractionNamed(name).id);
}

function repaintStepAttractionsField() {
  document.getElementById('step-attractions').innerHTML = stepAttractionsChips(
    modal.payload.extras,
  );
  document.getElementById('step-attractions-input').focus();
  repaintStepAttractionResults();
}

/*
  La liste s'ouvre au focus, donc sans requête elle propose tout ce qui n'est pas déjà attaché ;
  seule la création demande un nom. Un item retient le pointeur au `mousedown` : sans ça le champ
  perdrait le focus avant le clic, et la liste se refermerait sous la souris.
*/
function attractionResults(query, usedIds) {
  const items = attractionMatches(query, usedIds).map(
    (a, i) => `<button type="button" class="attraction-result"
      onmousedown="event.preventDefault()"
      onmouseenter="setActiveAttractionResult(${i})"
      onclick="addStepAttraction('${a.id}')">
      ${tagLabel(attractionType(a.type).emoji, escapeHtml(a.name))}
    </button>`,
  );
  if (query)
    items.push(
      /* HTML */ `<button
        type="button"
        class="attraction-result attraction-result-create"
        onmousedown="event.preventDefault()"
        onmouseenter="setActiveAttractionResult(${items.length})"
        onclick="createStepAttraction()"
      >
        ${svgIcon('plus')} Créer « ${escapeHtml(query)} »
      </button>`,
    );
  return items.join('');
}

function repaintStepAttractionResults() {
  activeAttractionResult = 0;
  document.getElementById('step-attractions-results').innerHTML = attractionResults(
    stepAttractionQuery(),
    stepAttractionsUsed(),
  );
  paintActiveAttractionResult();
}

function closeStepAttractionResults() {
  document.getElementById('step-attractions-results').innerHTML = '';
}
