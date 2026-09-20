const STEP_AREA_SHAPES = [
  { key: 'circle', label: 'Cercle' },
  { key: 'rectangle', label: 'Rectangle' },
];

function stepAreaShapeOption() {
  return /* HTML */ `<div class="step-area-option">
    <div class="step-area-label">Zone d’étape</div>
    <div class="step-area-picker">
      ${STEP_AREA_SHAPES.map(
        (shape) => `
          <label class="step-area-shape ${prefs.stepAreaShape === shape.key ? 'selected' : ''}">
            <input
              type="radio"
              name="step-area-shape"
              ${prefs.stepAreaShape === shape.key ? 'checked' : ''}
              onchange="setStepAreaShape('${shape.key}')"
            />
            <span class="step-area-preview step-area-preview-${shape.key}"></span>
            <span class="step-area-name">${shape.label}</span>
          </label>
        `,
      ).join('')}
    </div>
  </div>`;
}

// Les réglages du fil du trajet et de la zone autour d'une étape.
function trailOptions() {
  return /* HTML */ `${trailShowOption()} ${trailColorOption()} ${stepAreaShapeOption()}
  ${weatherBannerStyleOption()}`;
}
