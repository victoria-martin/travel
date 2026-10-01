/*
  Port de listSearchField (js/views/table.js). Le legacy restaure le focus/la position du curseur
  à la main après chaque frappe, parce que render() reconstruit tout le DOM — React garde le même
  <input>, ce correctif n'a pas d'équivalent à écrire ici.
*/
export function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="list-search" title="Rechercher">
      <span className="sr-only">Rechercher</span>
      <input
        type="search"
        placeholder="Rechercher…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
