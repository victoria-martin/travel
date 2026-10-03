// Port du select type/statut avec "＋ Ajouter…" (js/word-select.js) : choisir cette option ouvre
// askNewWord, qui écrit direct dans le dictionnaire (ACCOMMODATION_TYPES…) — wordSelectChanged
// remet l'ancienne valeur en attendant, inchangé.
export function WordSelectField({
  id,
  label,
  bank,
  dict,
  defaultValue,
  unset,
  addLabel,
}: {
  id: string;
  label: string;
  bank: string;
  dict: Record<string, { label: string; emoji: string }>;
  defaultValue: string;
  unset: { label: string; emoji: string };
  addLabel: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} defaultValue={defaultValue} onChange={() => window.wordSelectChanged(id, bank)}>
        <option value="">
          {unset.emoji} {unset.label}
        </option>
        {Object.entries(dict).map(([key, word]) => (
          <option key={key} value={key}>
            {word.emoji} {word.label}
          </option>
        ))}
        <option value={window.NEW_WORD_VALUE}>＋ {addLabel}</option>
      </select>
    </div>
  );
}
