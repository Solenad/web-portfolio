"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";

import IconGrid from "@/features/desktop/components/IconGrid";
import Wallpaper from "@/features/desktop/components/Wallpaper";
import Taskbar from "@/features/taskbar/components/Taskbar";
import type { DesktopIconItem } from "@/types/desktop.types";

const MOBILE_BREAKPOINT = 768;

const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    id: "about",
    label: "About Me",
    iconName: "about",
    iconPath: "/assets/xp-icons/user.webp",
  },
  {
    id: "projects",
    label: "Projects",
    iconName: "projects",
    iconPath: "/assets/xp-icons/projects.png",
  },
  {
    id: "contact",
    label: "Contact",
    iconName: "contact",
    iconPath: "/assets/xp-icons/mail.webp",
  },
];

export default function Desktop(): JSX.Element {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
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

  const isMobile = useMemo(
    () => viewportWidth < MOBILE_BREAKPOINT,
    [viewportWidth],
  );

  return (
    <div className="relative h-dvh w-full overflow-hidden text-[11px]">
      <Wallpaper imagePath="/assets/wallpapers/bliss.jpg" />
      {isMobile ? (
        <main className="relative z-10 flex h-[calc(100dvh-var(--taskbar-height))] flex-col items-start gap-3 overflow-y-auto p-4 text-white">
          <h1 className="winxp-icon-label text-base">Rohann Dizon Portfolio</h1>
          <p className="max-w-sm text-[11px] leading-relaxed">
            Mobile fallback is active. Open on desktop for the full Windows XP
            experience.
          </p>
        </main>
      ) : (
        <main
          className="relative z-10 h-[calc(100dvh-var(--taskbar-height))] overflow-hidden"
          onClick={() => setSelectedIconId(null)}
        >
          <IconGrid
            icons={DESKTOP_ICONS}
            selectedId={selectedIconId}
            onSelectIcon={(iconId) => setSelectedIconId(iconId)}
          />
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
