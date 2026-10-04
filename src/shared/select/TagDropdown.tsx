import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TagLabel } from '../TagLabel';

/*
  Forme commune à attractionTypeDropdown/attractionStatusTag/transportModeDropdown/
  transportStatusTag (legacy) : un dictionnaire {emoji,label}, la valeur courante, un choix.
  `placeholder` couvre le cas où rien n'est choisi (`current` nul) et `beforeItems` les entrées de
  menu hors dictionnaire (ex. « Ouvrir la ressource ») — toujours fournies par l'appelant, jamais
  un flag dédié ici. Pas encore « ＋ Ajouter un mot » (askNewWord).
*/
export function TagDropdown<V extends { label: string; emoji: string }>({
  className,
  dict,
  current,
  placeholder,
  emptyOption,
  beforeItems,
  onPick,
}: {
  className: string;
  dict: Record<string, V>;
  current: V | null;
  placeholder?: React.ReactNode;
  emptyOption?: V;
  beforeItems?: React.ReactNode;
  onPick: (key: string) => void;
}) {
  return (
    <div className={`inline-dropdown ${className}`}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className={`inline-tag${current ? '' : ' inline-tag-empty'}`}
            style={{ font: 'inherit' }}
          >
            {current ? <TagLabel emoji={current.emoji} label={current.label} /> : placeholder}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="inline-menu"
            align="start"
            sideOffset={4}
            collisionPadding={8}
          >
            {beforeItems}
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