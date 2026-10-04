const STEP_AREA_SHAPES = [
  { key: 'circle', label: 'Cercle' },
  { key: 'rectangle', label: 'Rectangle' },
];

window.STEP_AREA_SHAPES = STEP_AREA_SHAPES;

function stepAreaShapeOption() {
  const options = STEP_AREA_SHAPES.map((shape) => ({
    key: shape.key,
    label: shape.label,
    preview: `<span class="radio-card-preview-${shape.key}"></span>`,
  }));
  return radioCardField(
    'Zone d’étape',
    'step-area-shape',
    options,
    prefs.stepAreaShape,
    'setStepAreaShape',
  );
}

// Les réglages du fil du trajet et de la zone autour d'une étape.
function trailOptions() {
  return /* HTML */ `${trailShowOption()} ${trailColorOption()} ${stepAreaShapeOption()}
  ${weatherBannerStyleOption()}`;
}
