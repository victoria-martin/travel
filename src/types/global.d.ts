export {};

/*
  Interop avec le legacy (scripts classiques, tout en globales) : ce fichier ne déclare que ce dont
  le pont React (src/store/legacyBridge.ts, src/main.tsx) a besoin. Pas une tentative de typer
  l'app legacy en entier.
*/
declare global {
  interface Window {
    state: any;
    currentTravelId: () => string | null;
    ofCurrentTravel: <T extends { travelId: string }>(items: T[]) => T[];
    REACT_VIEWS: Record<string, () => React.JSX.Element>;
    mountReactView: (container: HTMLElement, viewKey: string) => boolean;
    unmountReactView: () => void;
    __reactStateSubscribers?: Set<() => void>;
    svgIcon: (name: string, opts?: { fill?: boolean; className?: string }) => string;
    toggleAttractionFavorite: (id: string) => void;
    attractionType: (type: string) => { label: string; emoji: string; color: string };
    attractionStatus: (status: string) => { label: string; emoji: string };
    coordsLabel: (p: { lat: string; lng: string }) => string;
    hiddenColumns: (kind: string) => string[];
    toggleColumn: (kind: string, key: string) => void;
    ATTRACTION_TYPES: Record<string, { label: string; emoji: string; color: string }>;
    ATTRACTION_STATUSES: Record<string, { label: string; emoji: string }>;
    setAttractionType: (id: string, type: string) => void;
    setAttractionStatus: (id: string, status: string) => void;
    expenseAmountLabel: (cost: { amount: string; recurrence: string }) => string;
    expenseRecurrence: (recurrence: string) => { label: string; emoji: string };
  }
}
