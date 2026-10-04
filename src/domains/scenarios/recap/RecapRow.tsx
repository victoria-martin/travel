export function RecapRow({
  label,
  amount,
  className,
}: {
  label: string;
  amount: string;
  className?: string;
}) {
  return (
    <div className={`acc-recap-row${className ? ` ${className}` : ''}`}>
      <span>{label}</span>
      <span></span>
      <strong>{amount}</strong>
    </div>
  );
}
