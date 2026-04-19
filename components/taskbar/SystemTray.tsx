"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";

interface Props {
  showClock?: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SystemTray({ showClock = true }: Props): JSX.Element {
  const [clock, setClock] = useState<string>(() => formatTime(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(formatTime(new Date()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-[22px] min-w-[78px] items-center justify-center rounded border border-[#1a3d8c] bg-[#1a3d8c] px-2 text-[11px] text-white shadow-inner">
      <span className="font-semibold tracking-wide drop-shadow-sm">
        {showClock ? clock : null}
      </span>
    </div>
  );
}
