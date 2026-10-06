import { useEffect, useLayoutEffect, useRef } from 'react';

/*
  The column headers live in their own table, outside the scroller: it copies the body table's
  column widths (sized by a flattened copy of the headers) and follows its horizontal scroll.
*/
export function useSyncedHead() {
  const headRef = useRef<HTMLDivElement>(null);
  const headTableRef = useRef<HTMLTableElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyTableRef = useRef<HTMLTableElement>(null);

  const copyWidths = () => {
    const headTable = headTableRef.current;
    const bodyTable = bodyTableRef.current;
    if (!headTable || !bodyTable) return;
    const sizers = bodyTable.querySelectorAll<HTMLElement>('thead th');
    headTable.querySelectorAll<HTMLElement>('col').forEach((col, index) => {
      col.style.width = `${sizers[index]?.offsetWidth ?? 0}px`;
    });
    headTable.style.width = `${bodyTable.offsetWidth}px`;
  };

  useLayoutEffect(copyWidths);

  useEffect(() => {
    const head = headRef.current;
    const body = bodyRef.current;
    const bodyTable = bodyTableRef.current;
    if (!head || !body || !bodyTable) return;
    const observer = new ResizeObserver(copyWidths);
    observer.observe(bodyTable);
    const follow = () => (head.scrollLeft = body.scrollLeft);
    body.addEventListener('scroll', follow);
    return () => {
      observer.disconnect();
      body.removeEventListener('scroll', follow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { headRef, headTableRef, bodyRef, bodyTableRef };
}
