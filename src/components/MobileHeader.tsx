import type { Dispatch, SetStateAction } from 'react';
import Burger from '../assets/burger.svg?react';

type Props = {
  setIsSidePanelOpen: Dispatch<SetStateAction<boolean>>;
};

function MobileHeader({ setIsSidePanelOpen }: Props) {
  return (
    <div className="w-full h-16 p-4 bg-background sticky flex justify-end z-1001 top-0 xs:hidden">
      <button onClick={() => setIsSidePanelOpen(true)}>
        <Burger className="size-8 invert cursor-pointer" />
      </button>
    </div>
  );
}

export default MobileHeader;
