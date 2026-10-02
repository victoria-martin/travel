/*
  Port de editableText (js/views/inline-edit.js) — le blur enregistre sans re-render pour ne pas
  arracher le focus ni les boutons voisins, donc `onSave` ne doit JAMAIS appeler window.render().
*/
export function EditableTextCell({
  value,
  placeholder,
  onSave,
}: {
  value: string;
  placeholder: string;
  onSave: (value: string) => void;
}) {
  return (
    <span
      className="editable"
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onKeyDown={(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        event.currentTarget.blur();
      }}
      onBlur={(event) => onSave(event.currentTarget.innerText.trim())}
    >
      {value || ''}
    </span>
  );
}
