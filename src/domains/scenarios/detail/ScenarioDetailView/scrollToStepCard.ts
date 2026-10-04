export function scrollToStepCard(stepId: string | null) {
  if (!stepId) return;
  document
    .getElementById(`step-card-${stepId}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
