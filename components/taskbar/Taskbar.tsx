import type { JSX } from "react";

import StartButton from "@/components/taskbar/StartButton";
import SystemTray from "@/components/taskbar/SystemTray";

interface Props {
  onStartClick: () => void;
  showClock?: boolean;
}

export default function Taskbar({
  onStartClick,
  showClock = true,
}: Props): JSX.Element {
  return (
    <footer className="win98-raised absolute bottom-0 left-0 z-20 flex h-[var(--taskbar-height)] w-full items-center justify-between border-t border-t-[#dfdfdf] bg-[#c0c0c0] px-1 py-[2px]">
      <div className="flex items-center gap-1">
        <StartButton onClick={onStartClick} />
      </div>
      <SystemTray showClock={showClock} />
    </footer>
  );
}
