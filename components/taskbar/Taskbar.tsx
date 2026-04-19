"use client";

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
    <footer className="absolute bottom-0 left-0 z-20 flex h-[var(--taskbar-height)] w-full items-center justify-between border-t border-t-[#7fb2ff] bg-gradient-to-b from-[#3880e8] via-[#235cdb] to-[#1a3d8c] px-1 py-[3px] shadow-lg">
      {/* XP-style subtle highlight line at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7fb2ff] to-transparent opacity-80" />
      <div className="flex items-center gap-1">
        <StartButton onClick={onStartClick} />
      </div>
      <SystemTray showClock={showClock} />
    </footer>
  );
}
