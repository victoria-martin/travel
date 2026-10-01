import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { TagsCell } from './TagsCell';

/*
  Port de tagsCell (js/views/tags-cell.js) — pas délégué tel quel : la version legacy pilote son
  toggle via des globales posées au dernier rendu (tagsCellGetter/tagsCellField), qui supposent
  une seule ligne rendue à la fois. Une table React rend toutes ses lignes d'un coup, donc le
  toggle est réimplémenté ici (ajouter/retirer un tag d'un tableau, appeler saveNow) plutôt que
  délégué — le reste (dropdown, vocabulaire, nouveau tag) garde le même comportement.
*/
export function EditableTagsCell({
  tags,
  vocabulary,
  addLabel,
  onToggle,
}: {
  tags: string[];
  vocabulary: string[];
  addLabel: string;
  onToggle: (tag: string) => void;
}) {
  const [newTag, setNewTag] = useState('');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="tags-cell-display"
          style={{ font: 'inherit', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          {tags.length ? <TagsCell tags={tags} /> : <span className="tags-cell-add">{addLabel}</span>}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="inline-menu" align="start" sideOffset={4} collisionPadding={8}>
          {vocabulary.map((tag) => (
            <DropdownMenu.CheckboxItem
              key={tag}
              className="filter-option"
              checked={tags.includes(tag)}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={() => onToggle(tag)}
            >
              {tag}
            </DropdownMenu.CheckboxItem>
          ))}
          <div className="tags-cell-new">
            <input
              type="text"
              placeholder="Nouveau tag…"
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                const value = newTag.trim();
                if (!value) return;
                onToggle(value);
                setNewTag('');
              }}
            />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
