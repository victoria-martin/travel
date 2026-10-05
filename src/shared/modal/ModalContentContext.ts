import { createContext } from 'react';

// The open modal's content element: menus opened inside it portal there, since the Dialog blocks clicks outside.
export const ModalContentContext = createContext<HTMLElement | null>(null);
