import { Icon } from '@/shared/Icon';
import { useRef } from 'react';

// The missing item is typed here and created on the spot; the field empties and keeps the focus for the next one.
export function AddByNameRow({
  id,
  placeholder,
  onAdd,
}: {
  id: string;
  placeholder: string;
  onAdd: (name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const add = () => {
    const input = inputRef.current;
    const name = input?.value.trim();
    if (!input || !name) return;
    onAdd(name);
    input.value = '';
    input.focus();
  };
  return (
    <div className="provider-option-row">
      <input id={id} ref={inputRef} type="text" placeholder={placeholder} />
      <button type="button" className="btn btn-secondary btn-small" onClick={add}>
        <Icon name="plus" />
      </button>
    </div>
  );
}
