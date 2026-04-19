"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";

import IconGrid from "@/components/desktop/IconGrid";
import Wallpaper from "@/components/desktop/Wallpaper";
import Taskbar from "@/components/taskbar/Taskbar";
import type { DesktopIconItem } from "@/types/desktop.types";

const MOBILE_BREAKPOINT = 768;

const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    id: "about",
    label: "About Me",
    iconName: "about",
    iconPath: "/assets/about-me.png",
  },
  {
    id: "projects",
    label: "Projects",
    iconName: "projects",
    iconPath: "/assets/projects.png",
  },
  {
    id: "contact",
    label: "Contact",
    iconName: "contact",
    iconPath: "/assets/contact.png",
  },
];

export default function Desktop(): JSX.Element {
  const [viewportWidth, setViewportWidth] = useState<number>(() => {
    if (typeof window === "undefined") {
      return MOBILE_BREAKPOINT;
    }

    return window.innerWidth;
  });

  useEffect(() => {
    const handleResize = (): void => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = useMemo(() => viewportWidth < MOBILE_BREAKPOINT, [viewportWidth]);

  return (
    <div className="relative h-dvh w-full overflow-hidden text-[11px]">
      <Wallpaper showPattern={false} />
      {isMobile ? (
        <main className="relative z-10 flex h-[calc(100dvh-var(--taskbar-height))] flex-col items-start gap-3 overflow-y-auto p-4 text-white">
          <h1 className="win98-icon-label text-base">Rohann Dizon Portfolio</h1>
          <p className="max-w-sm text-[11px] leading-relaxed">
            Mobile fallback is active. Open on desktop for the full Windows 98
            experience.
          </p>
        </main>
      ) : (
        <main className="relative z-10 h-[calc(100dvh-var(--taskbar-height))] overflow-hidden">
          <IconGrid icons={DESKTOP_ICONS} />
        </main>
      )}
      <Taskbar
        onStartClick={() => {
          // Placeholder start menu action for foundation phase.
        }}
        showClock
      />
    </div>
  );
}
