// Une étape sans rang ou sans lieu géolocalisé est absente du tracé : la pastille le dit sur place.
function stepOrderBadge(step, idx) {
  if (idx === null)
    return /* HTML */ `<div
      class="step-order step-order-hidden"
      title="Masquée — hors des dates, des totaux et de la carte"
    >
      •
    </div>`;
  if (coordsFor(step)) return `<div class="step-order">${stepLetter(idx)}</div>`;
  return /* HTML */ `<div
    class="step-order step-order-unmapped"
    title="Pas de lieu géolocalisé — absente de la carte"
  >
    ${stepLetter(idx)}
  </div>`;
}

function stepCard(scenario, step, idx) {
  return /* HTML */ `
    <div
      class="step-card${step.hidden ? ' step-card-hidden' : ''}"
      ondragover="overStepCard(event)"
      ondrop="dropOnStepCard(event,'${scenario.id}','${step.id}')"
    >
      ${stepDragHandle(step)} ${stepHiddenCheckbox(scenario, step)} ${stepOrderBadge(step, idx)}
      <div class="step-body">
        <div class="step-title">
          ${editableText(step.name, `renameStep('${scenario.id}','${step.id}', this.innerText)`, {
            key: `step:${step.id}:name`,
            placeholder: 'Nom de l’étape…',
          })}${stepPlaceSuffix(step)}
          ${idx === null ? '' : `<span class="step-title-dates">${stepDateRange(scenario, idx)}</span>`}
        </div>
        <div class="test-red">
          ${stepDetailLine(step)} ${stepOptionsBlock(scenario, step)}
          ${extrasBlock(scenario, step, '')}
        </div>
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
