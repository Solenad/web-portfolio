"use client";

import { useCallback, useEffect, useRef } from "react";
import type { JSX } from "react";

import { useWindowManager } from "@/hooks/useWindowManager";
import type { WindowInstance } from "@/types/window.types";

interface Props {
  windowInstance: WindowInstance;
  isActive: boolean;
}

export default function TaskbarButton({
  windowInstance,
  isActive,
}: Props): JSX.Element {
  const {
    activeWindowId,
    focusWindow,
    minimizeWindow,
    registerTaskbarButton,
    restoreWindow,
  } = useWindowManager();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const syncTaskbarRect = useCallback((): void => {
    const button = buttonRef.current;

    if (button === null) {
      return;
    }

    const rect = button.getBoundingClientRect();

    registerTaskbarButton(windowInstance.id, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
  }, [registerTaskbarButton, windowInstance.id]);

  useEffect(() => {
    syncTaskbarRect();

    window.addEventListener("resize", syncTaskbarRect);
    window.addEventListener("scroll", syncTaskbarRect, true);

    return () => {
      window.removeEventListener("resize", syncTaskbarRect);
      window.removeEventListener("scroll", syncTaskbarRect, true);
      registerTaskbarButton(windowInstance.id, null);
    };
  }, [registerTaskbarButton, syncTaskbarRect, windowInstance.id]);

  const handleClick = (): void => {
    if (windowInstance.minimized) {
      restoreWindow(windowInstance.id);

      return;
    }

    if (activeWindowId === windowInstance.id && isActive) {
      minimizeWindow(windowInstance.id);

      return;
    }

    focusWindow(windowInstance.id);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={`winxp-taskbar-button ${isActive && !windowInstance.minimized ? "winxp-taskbar-button-active" : "winxp-taskbar-button-idle"}`}
      aria-label={`Toggle ${windowInstance.title} window`}
      title={windowInstance.title}
    >
      <span className="truncate">{windowInstance.title}</span>
    </button>
  );
}
