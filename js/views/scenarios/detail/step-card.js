// Une étape hors du tracé n'a pas de rang : la pastille dit sur place ce qui l'en sort.
function stepOrderBadge(step, rank) {
  if (rank === null)
    return /* HTML */ `<div
      class="step-order step-order-hidden"
      title="${step.hidden ? 'Masquée' : 'Colonne écartée'} — hors des dates, des totaux et de la carte"
    >
      •
    </div>`;
  if (coordsFor(step)) return `<div class="step-order">${stepLetter(rank)}</div>`;
  return /* HTML */ `<div
    class="step-order step-order-unmapped"
    title="Pas de lieu géolocalisé — absente de la carte"
  >
    ${stepLetter(rank)}
  </div>`;
}

function stepCard(scenario, step, rank, arrival) {
  return /* HTML */ `
    <div
      class="step-card${step.hidden ? ' step-card-hidden' : ''}"
      ondragover="overStepCard(event)"
      ondrop="dropOnStepCard(event,'${scenario.id}','${step.id}')"
    >
      <div class="step-reorder">${stepDragHandle(step)} ${stepMoveButtons(scenario, step)}</div>
      ${stepHiddenCheckbox(scenario, step)} ${stepOrderBadge(step, rank)}
      <div class="step-body">
        <div class="step-title">
          ${editableText(step.name, `renameStep('${scenario.id}','${step.id}', this.innerText)`, {
            key: `step:${step.id}:name`,
            placeholder: 'Nom de l’étape…',
          })}${stepPlaceSuffix(step)}
          <span class="step-title-dates">${dateRangeLabel(arrival, stepNights(step))}</span>
        </div>
        ${stepDetailLine(step)}
        <div class="step-acc">
          ${stepLine(scenario, step)} ${step.groupId ? '' : makeGroupButton(scenario, step)}
        </div>
        ${extrasBlock(scenario, step)}
      </div>
      <div class="step-actions">
        ${duplicateButton(`duplicateStep('${scenario.id}','${step.id}')`)}
        <button
          class="icon-btn"
          onclick="openModal('step','${scenario.id}','${step.id}')"
          title="Modifier"
        >
          ✎
        </button>
        <button
          class="icon-btn"
          onclick="deleteStep('${scenario.id}','${step.id}')"
          title="Supprimer"
        >
          🗑
        </button>
      </div>
    </div>
  `;
}

// Comparer commence sur l'étape qu'on a : elle devient la première colonne, sa copie la seconde.
function makeGroupButton(scenario, step) {
  return /* HTML */ `<button
    class="inline-tag step-add-option"
    title="Comparer une autre option"
    onclick="makeStepGroup('${scenario.id}','${step.id}')"
  >
    ＋ option
  </button>`;
}

function stepHiddenCheckbox(scenario, step) {
  return /* HTML */ `<input
    type="checkbox"
    class="step-hidden-check"
    ${step.hidden ? 'checked' : ''}
    onchange="toggleStepHidden('${scenario.id}','${step.id}')"
    title="Masquer — hors des dates, des totaux et de la carte"
  />`;
}

/*
  Le titre dit la ville et la région de l'étape, moins ce que son propre nom et la pastille du lieu
  affichent déjà : une étape « Castelbianco » posée sur un hébergement de Castelbianco n'ajoute que
  « Ligurie ». La province, elle, est un axe de filtre et non un libellé de titre.
*/
const STEP_TITLE_LEVELS = ['city', 'region'];

function stepPlaceSuffix(step) {
  const place = stepPlace(step);
  if (!place) return '';
  const alreadySaid = [step.name, place.name].join(' ').toLowerCase();
  const levels = STEP_TITLE_LEVELS.map((key) => place[key]).filter(
    (value) => value && !alreadySaid.includes(value.toLowerCase()),
  );
  if (!levels.length) return '';
  return ` <span class="step-title-place">· ${escapeHtml(levels.reverse().join(' · '))}</span>`;
}

function stepDetailLine(step) {
  const parts = [
    step.arrivalDate ? `arrivée le ${escapeHtml(step.arrivalDate)}` : '',
    step.notes ? escapeHtml(step.notes) : '',
  ].filter(Boolean);
  if (parts.length === 0) return '';
  return `<div class="step-detail">${parts.join(' · ')}</div>`;
}
