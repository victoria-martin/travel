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
          ${editableText(step.city, `renameStep('${scenario.id}','${step.id}', this.innerText)`, {
            key: `step:${step.id}:city`,
            placeholder: 'ville…',
          })}${step.region ? ` <span style="color:var(--ink-soft); font-weight:400;">· ${escapeHtml(step.region)}</span>` : ''}
          ${step.notes ? `<span class="step-title-notes">${escapeHtml(step.notes)}</span>` : ''}
        </div>
        ${stepDetailLine(scenario, step, idx)} ${stepOptionsBlock(scenario, step)}
        ${(step.attractions || [])
          .map((entry, i) => stepAttractionRow(scenario, step, entry, i))
          .join('')}
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

function stepDetailLine(scenario, step, idx) {
  const parts = [
    idx === null ? '' : stepDateRange(scenario, idx),
    step.arrivalDate ? `arrivée le ${escapeHtml(step.arrivalDate)}` : '',
  ].filter(Boolean);
  if (parts.length === 0) return '';
  return `<div class="step-detail">${parts.join(' · ')}</div>`;
}
