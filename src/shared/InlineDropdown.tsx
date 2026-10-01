import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

const GAP = 4;
const EDGE = 8;

/*
  Port de inline-dropdown.js (positionnement) sans son mécanisme d'ouverture globale (un `<details>`
  + openInlineMenu partagé n'a pas de sens ici, chaque InlineDropdown porte son propre état) :
  `position: fixed` échappe déjà aux scrollers qui clippent (table-wrap, colonne principale), le JS
  ne fait que calculer top/left/maxHeight en coordonnées fenêtre, au-dessus ou en dessous du
  déclencheur selon la place disponible. Pas encore porté : replacement au scroll/resize pendant
  que le menu reste ouvert (document.addEventListener('scroll', ..., true) côté legacy) — rare, le
  menu reste alors où il a été ouvert plutôt que de suivre.
*/
export function InlineDropdown({
  trigger,
  className,
  children,
}: {
  trigger: ReactNode;
  className: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    maxHeight?: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // TODO; improve this with proper components (or with a lib ?)
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const anchor = triggerRef.current!.getBoundingClientRect();
      const menu = menuRef.current!;
      menu.style.maxHeight = '';
      menu.style.minWidth = anchor.width > 200 ? `${anchor.width}px` : '';
      const box = menu.getBoundingClientRect();
      const roomBelow = window.innerHeight - anchor.bottom - GAP - EDGE;
      const roomAbove = anchor.top - GAP - EDGE;
      const below = box.height <= roomBelow || roomBelow >= roomAbove;
      const room = below ? roomBelow : roomAbove;
      const height = Math.min(box.height, room);
      const top = below ? anchor.bottom + GAP : anchor.top - GAP - height;
      const left = Math.min(Math.max(EDGE, anchor.left), window.innerWidth - box.width - EDGE);
      setPosition({ top, left, maxHeight: box.height > room ? room : undefined });
    }
    place();
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div className={`inline-dropdown ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="inline-tag"
        style={{ font: 'inherit' }}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={menuRef}
          className="inline-menu"
          style={{
            top: position?.top ?? 0,
            left: position?.left ?? 0,
            maxHeight: position?.maxHeight,
            visibility: position ? 'visible' : 'hidden',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
