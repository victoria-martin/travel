import { Icon } from './Icon';

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="list-search" title="Rechercher">
      <span className="list-search-icon">
        <Icon name="search" />
      </span>
      <input
        type="search"
        placeholder="Rechercher…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
