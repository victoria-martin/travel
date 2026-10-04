// Below 1100px the rail is hidden in CSS: reserving a 0px column would still leave the grid gap.
export function scenarioRailHidden(): boolean {
  return window.matchMedia('(max-width: 1100px)').matches;
}
