// The month is written twice only when the stay spans two months.
export function stayRangeLabel(arrival: Date | null, nights: number): string {
  if (!arrival) return '';
  const departure = window.dateAfter(arrival, nights);
  if (nights === 0 || !departure) return window.formatStepDay(arrival);
  if (arrival.getMonth() === departure.getMonth())
    return `${arrival.getDate()}-${window.formatStepDay(departure)}`;
  return `${window.formatStepDay(arrival)} - ${window.formatStepDay(departure)}`;
}
