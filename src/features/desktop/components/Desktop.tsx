"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";

import IconGrid from "@/features/desktop/components/IconGrid";
import Wallpaper from "@/features/desktop/components/Wallpaper";
import Taskbar from "@/features/taskbar/components/Taskbar";
import Window from "@/features/window/components/Window";
import { getDesktopIcons } from "@/features/windows/hooks/useWindowRegistry";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/features/windows/hooks/useWindowManager";

const MOBILE_BREAKPOINT = 768;

interface DesktopSurfaceProps {
  isMobile: boolean;
  selectedIconId: string | null;
  onSelectIcon: (iconId: string | null) => void;
}

function DesktopSurface({
  isMobile,
  selectedIconId,
  onSelectIcon,
}: DesktopSurfaceProps): JSX.Element {
  const { activeWindowId, openWindow, openWindows } = useWindowManager();
  const desktopIcons = useMemo(() => getDesktopIcons(), []);

  const activeMobileWindow = useMemo(() => {
    if (!isMobile) {
      return null;
    }

    const visibleWindows = openWindows.filter(
      (windowInstance) => !windowInstance.minimized,
    );

    const byActiveId = visibleWindows.find(
      (windowInstance) => windowInstance.id === activeWindowId,
    );

    if (byActiveId !== undefined) {
      return byActiveId;
    }

    return (
      [...visibleWindows].sort(
        (left, right) => right.zIndex - left.zIndex,
      )[0] ?? null
    );
  }, [activeWindowId, isMobile, openWindows]);

  const windowsToRender = useMemo(() => {
    if (!isMobile) {
      return openWindows;
    }

    return activeMobileWindow === null ? [] : [activeMobileWindow];
  }, [activeMobileWindow, isMobile, openWindows]);

  return (
    <>
      <main
        className="relative z-10 h-[calc(100dvh-var(--taskbar-height))] overflow-hidden"
        onClick={() => onSelectIcon(null)}
      >
      <IconGrid
        icons={desktopIcons}
        selectedId={selectedIconId}
        onSelectIcon={onSelectIcon}
        onOpenIcon={(icon) => {
          if (icon.windowType !== undefined) {
            openWindow(icon.windowType);
          }
        }}
      />
        <div className="desktop-window-layer" aria-live="polite">
          {windowsToRender.map((windowInstance) => (
            <Window
              key={windowInstance.id}
              windowInstance={windowInstance}
              isActive={windowInstance.id === activeWindowId}
              isMobile={isMobile}
            />
          ))}
        </div>
      </main>
      <Taskbar
        onStartClick={() => {
          // Placeholder start menu action for foundation phase.
        }}
        showClock
      />
    </>
  );
}

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
      <WindowManagerProvider>
        <DesktopSurface
          isMobile={isMobile}
          selectedIconId={selectedIconId}
          onSelectIcon={setSelectedIconId}
        />
      </WindowManagerProvider>
    </div>
  );
}
