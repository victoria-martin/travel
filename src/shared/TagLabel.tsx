// Port de tagLabel (js/views/inline-dropdown.js) : emoji + libellé, même markup que le trigger
// et les options d'un inline-dropdown legacy.
export function TagLabel({ emoji, label }: { emoji?: string; label: string }) {
  return (
    <>
      {emoji && <span className="inline-emoji">{emoji}</span>}
      <span className="inline-label">{label}</span>
    </>
  );
}
