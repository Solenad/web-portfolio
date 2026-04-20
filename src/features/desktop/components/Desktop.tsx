"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";

import IconGrid from "@/features/desktop/components/IconGrid";
import Wallpaper from "@/features/desktop/components/Wallpaper";
import Taskbar from "@/features/taskbar/components/Taskbar";
import Window from "@/features/window/components/Window";
import {
  WindowManagerProvider,
  useWindowManager,
} from "@/hooks/useWindowManager";
import type { DesktopIconItem } from "@/types/desktop.types";

const MOBILE_BREAKPOINT = 768;

const DESKTOP_ICONS: DesktopIconItem[] = [
  {
    id: "about",
    label: "About Me",
    iconName: "about",
    iconPath: "/assets/xp-icons/user.webp",
    windowId: "window-about",
    windowType: "about",
  },
  {
    id: "projects",
    label: "Projects",
    iconName: "projects",
    iconPath: "/assets/xp-icons/projects.png",
    windowId: "window-projects",
    windowType: "projects",
  },
  {
    id: "contact",
    label: "Contact",
    iconName: "contact",
    iconPath: "/assets/xp-icons/mail.webp",
    windowId: "window-contact",
    windowType: "contact",
  },
  {
    id: "resume",
    label: "Resume",
    iconName: "resume",
    iconPath: "/assets/xp-icons/my-computer.webp",
    windowId: "window-resume",
    windowType: "resume",
  },
  {
    id: "minesweeper",
    label: "Minesweeper",
    iconName: "minesweeper",
    iconPath: "/assets/xp-icons/minesweeper.webp",
    windowId: "window-minesweeper",
    windowType: "minesweeper",
  },
  {
    id: "paint",
    label: "Paint",
    iconName: "paint",
    iconPath: "/assets/xp-icons/camera.webp",
    windowId: "window-paint",
    windowType: "paint",
  },
  {
    id: "doom",
    label: "DOOM",
    iconName: "doom",
    iconPath: "/assets/xp-icons/chrome.webp",
    windowId: "window-doom",
    windowType: "doom",
  },
];

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
      [...visibleWindows].sort((left, right) => right.zIndex - left.zIndex)[0] ??
      null
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
          icons={DESKTOP_ICONS}
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
