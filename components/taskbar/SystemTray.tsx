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
    <div className="win98-inset flex h-[22px] min-w-[78px] items-center justify-center bg-[#c0c0c0] px-2 text-[11px] text-black">
      {showClock ? clock : null}
    </div>
  );
}
