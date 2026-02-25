import type { Dispatch, SetStateAction } from 'react';
import Burger from '../assets/burger.svg?react';
import ThemeToggle from './ThemeToggle';

type Props = {
  setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>;
};

function MobileHeader({ setIsSidePanelOpen }: Props) {
  return (
    <div className="w-full h-16 p-4 bg-background sticky flex justify-end z-1001 top-0 sm:hidden gap-8">
      <ThemeToggle />
      <button onClick={() => setIsSidePanelOpen(true)}>
        <Burger className="size-8  cursor-pointer" />
      </button>
    </div>
  );
}

export default MobileHeader;
