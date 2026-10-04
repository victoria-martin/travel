import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// Opens the legacy word form over the page; the created word is applied by `onCreate`.
export function AddWordMenuItem({
  bank,
  label,
  onCreate,
}: {
  bank: 'accommodationTypes' | 'accommodationStatuses' | 'attractionTypes' | 'attractionStatuses';
  label: string;
  onCreate: (key: string) => void;
}) {
  return (
    <DropdownMenu.Item
      asChild
      onSelect={() => window.askNewWord(bank, (word) => onCreate(word.key))}
    >
      <button type="button" className="inline-menu-item">
        ＋ {label}
      </button>
    </DropdownMenu.Item>
  );
}
