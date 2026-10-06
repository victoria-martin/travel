import { useEffect, useRef } from 'react';

// Publishes the column headers' height on the scroller, for its scrollbar to start below them.
export function useHeaderHeightVar() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLTableSectionElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    const head = headRef.current;
    if (!wrap || !head) return;
    const observer = new ResizeObserver(() =>
      wrap.style.setProperty('--thead-h', `${head.offsetHeight}px`),
    );
    observer.observe(head);
    return () => observer.disconnect();
  }, []);
  return { wrapRef, headRef };
}
