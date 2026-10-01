import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
  emptyOption,
  onPick,
}: {
  className: string;
  dict: Record<string, V>;
  current: V;
  emptyOption?: V;
  onPick: (key: string) => void;
}) {
  return (
    <div className={`inline-dropdown ${className}`}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="inline-tag" style={{ font: 'inherit' }}>
            <TagLabel emoji={current.emoji} label={current.label} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {emptyOption && (
              <DropdownMenu.Item asChild onSelect={() => onPick('')}>
                <button
                  type="button"
                  className={`inline-menu-item ${emptyOption === current ? 'selected' : ''}`}
                >
                  <TagLabel emoji={emptyOption.emoji} label={emptyOption.label} />
                </button>
              </DropdownMenu.Item>
            )}
            {Object.entries(dict).map(([key, value]) => (
              <DropdownMenu.Item key={key} asChild onSelect={() => onPick(key)}>
                <button
                  type="button"
                  className={`inline-menu-item ${value === current ? 'selected' : ''}`}
                >
                  <TagLabel emoji={value.emoji} label={value.label} />
                </button>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
