"use client";

import Image from "next/image";
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
    <div
      className="flex h-[26px] min-w-[110px] items-center gap-1.5 rounded-[2px] px-2 text-[11px] text-white"
      style={{
        background:
          "linear-gradient(to bottom, rgb(108, 171, 244) 0%, rgb(88, 153, 234) 45%, rgb(74, 138, 227) 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.3)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
        borderRight: "1px solid rgba(0, 0, 0, 0.2)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
        boxShadow: "0 1px 0 rgba(255, 255, 255, 0.2)",
      }}
    >
      <Image
        src="/assets/xp-icons/security.webp"
        alt="Security status"
        width={16}
        height={16}
        className="h-4 w-4"
      />
      <Image
        src="/assets/xp-icons/info.webp"
        alt="System information"
        width={16}
        height={16}
        className="h-4 w-4"
      />
      <span className="ml-1 tracking-wide [font-family:Tahoma,'Trebuchet_MS',Verdana,sans-serif] [text-shadow:0_1px_1px_rgba(0,0,0,0.5)]">
        {showClock ? clock : null}
      </span>
    </div>
  );
}
