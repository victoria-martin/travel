export function RoadRow({ label, note, amount }: { label: string; note: string; amount: string }) {
  return (
    <div className="acc-recap-row acc-recap-sub">
      <span>{label}</span>
      <span className="acc-recap-nights">{note}</span>
      <strong>{amount}</strong>
    </div>
  );
}
