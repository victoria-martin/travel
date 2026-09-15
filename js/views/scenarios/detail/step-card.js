// Une étape hors du tracé n'a pas de rang : la pastille dit sur place ce qui l'en sort.
function stepOrderBadge(scenario, step, rank) {
  if (rank === null)
    return /* HTML */ `<div
      class="step-order step-order-hidden"
      title="${stepOutReason(scenario, step)} — hors des dates, des totaux et de la carte"
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

function stepOutReason(scenario, step) {
  return step.hidden || isGroupHidden(scenario, step.groupId) ? 'Masquée' : 'Colonne écartée';
}

/*
  L'étape porte son avancement sur sa bordure, à pleine teinte : ni fond ni texture, qui sur une
  carte entière mangeraient le contenu. Une étape masquée est hors du voyage : elle garde ses
  hachures.
*/
function stepCardPaint(scenario, step) {
  if (step.hidden) return '';
  return ` style="--step-color:${stepStatusInfo(stepStatus(scenario, step)).color}"`;
}

/*
  Le statut de l'étape se lit, il ne se touche pas : il est déduit de l'hébergement retenu et de la
  comparaison en cours, la pastille qui s'édite est celle de l'hébergement, sur la ligne du lieu.
*/
function stepStatusBadge(scenario, step) {
  const status = stepStatusInfo(stepStatus(scenario, step));
  return /* HTML */ `<span
    class="step-status"
    title="Statut déduit de celui de l’hébergement choisi"
  >
    ${status.emoji} ${escapeHtml(status.label)}
  </span>`;
}

function stepCard(scenario, step, rank, arrival) {
  return /* HTML */ `
    <div
      id="step-card-${step.id}"
      class="step-card${step.hidden ? ' step-card-hidden' : ''}"
      ${stepCardPaint(scenario, step)}
      ondragover="overStepCard(event)"
      ondrop="dropOnStepCard(event,'${scenario.id}','${step.id}')"
    >
      <div class="step-reorder">
        <div class="step-reorder-buttons">${stepMoveButtons(scenario, step)}</div>
        ${stepDragHandle(step)}
      </div>
      <div class="step-main">
        ${stepOrderBadge(scenario, step, rank)}
        <div class="step-body">
          <div class="step-title">
            ${editableText(step.name, `renameStep('${scenario.id}','${step.id}', this.innerText)`, {
              key: `step:${step.id}:name`,
              placeholder: 'Nom de l’étape…',
            })}${stepPlaceSuffix(step)}
            <span class="step-title-dates">${dateRangeLabel(arrival, stepNights(step))}</span>
          </div>
          ${stepDetailLine(step)}
          <div class="step-stay">
            <div class="step-acc">${stepLine(scenario, step)}</div>
            ${extrasBlock(scenario, step)}
          </div>
        </div>
      </div>
      <div class="step-side">
        ${stepStatusBadge(scenario, step)}
        <div class="step-money">${stepMoney(scenario, step)}</div>
      </div>
      <div class="step-actions">
        <button
          class="icon-btn"
          onclick="openModal('step','${scenario.id}','${step.id}')"
          title="Modifier"
        >
          ${svgIcon('pencil')}
        </button>
        ${duplicateButton(`duplicateStep('${scenario.id}','${step.id}')`)}
        ${hiddenButton(step.hidden, `toggleStepHidden('${scenario.id}','${step.id}')`)}
        <button
          class="icon-btn"
          onclick="deleteStep('${scenario.id}','${step.id}')"
          title="Supprimer"
        >
          ${svgIcon('trash-2')}
        </button>
      </div>
      ${step.groupId ? '' : makeGroupButton(scenario, step)}
    </div>
  `;
}

// Le budget saisi remplace le prix calculé de l'hébergement ; sans budget, on montre le calcul.
function stepMoney(scenario, step) {
  const acc = getAccommodation(step.accommodationId);
  const auto = stepAccommodationCost(step);
  return /* HTML */ `<span class="step-total">
    ${
      !hasStepBudget(step) && auto
        ? `<span class="step-total-auto">${formatAccommodationCost(acc, auto)}</span>`
        : ''
    }
    <span class="step-budget${hasStepBudget(step) ? ' step-budget-set' : ''}"
      >${editableText(step.budget, `setStepBudget('${scenario.id}','${step.id}', this.innerText)`, {
        key: `step:${step.id}:budget`,
        placeholder: 'Budget…',
      })}${hasStepBudget(step) ? ' €' : ''}</span
    >
  </span>`;
}

/*
  Comparer commence sur l'étape qu'on a : elle devient la première colonne, sa copie la seconde. Le
  ＋ se pose à cheval sur la bordure droite, à mi-hauteur : l'option pousse la carte de côté, elle ne
  s'ajoute pas dans son contenu.
*/
function makeGroupButton(scenario, step) {
  return /* HTML */ `<button
    class="icon-btn step-fork-btn"
    title="Comparer une autre option"
    onclick="makeStepGroup('${scenario.id}','${step.id}')"
  >
    ${svgIcon('plus')}
  </button>`;
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
