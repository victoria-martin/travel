import { ModalContentContext } from '@/shared/modal/ModalContentContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useContext, type ReactNode } from 'react';

// A menu's portal: into the open modal when inside one, into the body otherwise.
export function MenuPortal({ children }: { children: ReactNode }) {
  const container = useContext(ModalContentContext);
  return <DropdownMenu.Portal container={container ?? undefined}>{children}</DropdownMenu.Portal>;
}
