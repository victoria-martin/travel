import { InlineDropdown } from './InlineDropdown';
import { TagLabel } from './TagLabel';

/*
  Forme commune à attractionTypeDropdown/attractionStatusTag/transportModeDropdown/
  transportStatusTag (legacy) : un dictionnaire {emoji,label}, la valeur courante, un choix.
  Pas encore « Ouvrir la ressource » ni « ＋ Ajouter un mot » (askNewWord) dans le menu.
*/
export function VocabularyDropdown<V extends { label: string; emoji: string }>({
  className,
  dict,
  current,
  onPick,
}: {
  className: string;
  dict: Record<string, V>;
  current: V;
  onPick: (key: string) => void;
}) {
  return (
    <InlineDropdown
      className={className}
      trigger={<TagLabel emoji={current.emoji} label={current.label} />}
    >
      {Object.entries(dict).map(([key, value]) => (
        <button
          key={key}
          type="button"
          className={`inline-menu-item ${value === current ? 'selected' : ''}`}
          onClick={() => onPick(key)}
        >
          <TagLabel emoji={value.emoji} label={value.label} />
        </button>
      ))}
    </InlineDropdown>
  );
}
