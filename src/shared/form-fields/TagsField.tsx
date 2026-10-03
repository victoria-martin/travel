import { useState } from 'react';
import { Icon } from '../Icon';

/*
  Port de tagsField (js/views/tags-field.js) — champ de modale, à distinguer d'EditableTagsCell
  (shared/cells/), qui est une cellule de tableau avec un tout autre chrome (déclencheur + menu
  déroulant Radix). Ici, tous les tags cochés restent affichés en ligne avec leur croix de retrait,
  plus un champ libre en dessous (Entrée ou virgule valide) — même forme que le legacy.
  Entièrement contrôlé (`tags`/`onChange`), contrairement aux autres champs d'un formulaire de
  modale encore non contrôlés : une liste qui s'ajoute/se retire a besoin d'un re-rendu à chaque
  geste, un simple `defaultValue` ne suffit pas.
*/
export function TagsField({
  label,
  tags,
  vocabulary,
  onChange,
}: {
  label: string;
  tags: string[];
  vocabulary: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState('');
  const options = vocabulary.filter((tag) => !tags.includes(tag));

  function commit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="tags-field">
        {tags.map((tag, index) => (
          <span key={tag} className="tag-chip tag-chip-editable">
            {tag}
            <button
              type="button"
              className="tag-chip-remove"
              title="Retirer"
              onClick={() => onChange(tags.filter((_, tagIndex) => tagIndex !== index))}
            >
              <Icon name="x" />
            </button>
          </span>
        ))}
        <input
          type="text"
          list="tags-field-options"
          placeholder="Ajouter…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ',') return;
            event.preventDefault();
            commit(draft);
            setDraft('');
          }}
        />
        <datalist id="tags-field-options">
          {options.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
