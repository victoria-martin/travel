export function distanceLabel(meters: number): string {
  const kilometers = meters / 1000;
  return `${kilometers < 10 ? kilometers.toFixed(1).replace('.', ',') : Math.round(kilometers)} km`;
}
