"use client";

import type { JSX } from "react";

import StartButton from "@/features/taskbar/components/start-button/StartButton";
import SystemTray from "@/features/taskbar/components/SystemTray";
import TaskbarButton from "@/features/taskbar/components/TaskbarButton";
import { useWindowManager } from "@/features/windows/hooks/useWindowManager";

interface Props {
  onStartClick: () => void;
  showClock?: boolean;
}

export default function Taskbar({
  onStartClick,
  showClock = true,
}: Props): JSX.Element {
  const { activeWindowId, openWindows } = useWindowManager();

  const taskbarGradient =
    "linear-gradient(to bottom, rgb(31, 47, 134) 0%, rgb(49, 101, 196) 3%, rgb(54, 130, 229) 6%, rgb(68, 144, 230) 10%, rgb(56, 131, 229) 12%, rgb(43, 113, 224) 15%, rgb(38, 99, 218) 18%, rgb(35, 91, 214) 20%, rgb(34, 88, 213) 23%, rgb(33, 87, 214) 38%, rgb(36, 93, 219) 54%, rgb(37, 98, 223) 86%, rgb(36, 95, 220) 89%, rgb(33, 88, 212) 92%, rgb(29, 78, 192) 95%, rgb(25, 65, 165) 98%)";

  return (
    <footer
      className="absolute bottom-0 left-0 z-20 flex h-[var(--taskbar-height)] w-full items-center justify-between shadow-lg"
      style={{ background: taskbarGradient }}
    >
      {/* XP-style subtle highlight line at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7fb2ff] to-transparent opacity-80" />
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <StartButton onClick={onStartClick} />
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pr-1">
          {openWindows.map((windowInstance) => (
            <TaskbarButton
              key={windowInstance.id}
              windowInstance={windowInstance}
              isActive={windowInstance.id === activeWindowId}
            />
          ))}
        </div>
      </div>
      <SystemTray showClock={showClock} />
    </footer>
  );
}
