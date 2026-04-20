"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type {
  CSSProperties,
  JSX,
  MouseEvent as ReactMouseEvent,
} from "react";

import { getRegistryEntry } from "@/hooks/useWindowRegistry";
import { useWindowManager } from "@/hooks/useWindowManager";
import type {
  WindowInstance,
  WindowPosition,
  WindowSize,
} from "@/types/window.types";

interface Props {
  windowInstance: WindowInstance;
  isActive: boolean;
  isMobile: boolean;
}

type ResizeDirection =
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";

interface DragState {
  startMouseX: number;
  startMouseY: number;
  startPosition: WindowPosition;
}

interface ResizeState {
  direction: ResizeDirection;
  startMouseX: number;
  startMouseY: number;
  startSize: WindowSize;
  startPosition: WindowPosition;
}

const MINIMIZE_DURATION_MS = 180;

function getResizeCursor(direction: ResizeDirection): string {
  switch (direction) {
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "nw":
    case "se":
      return "nwse-resize";
    default:
      return "default";
  }
}

function resizeFromDirection(
  direction: ResizeDirection,
  state: ResizeState,
  event: MouseEvent,
  minSize: WindowSize,
): {
  size: WindowSize;
  position: WindowPosition;
} {
  const deltaX = event.clientX - state.startMouseX;
  const deltaY = event.clientY - state.startMouseY;

  let nextWidth = state.startSize.width;
  let nextHeight = state.startSize.height;
  let nextX = state.startPosition.x;
  let nextY = state.startPosition.y;

  if (direction.includes("e")) {
    nextWidth = Math.max(minSize.width, state.startSize.width + deltaX);
  }

  if (direction.includes("s")) {
    nextHeight = Math.max(minSize.height, state.startSize.height + deltaY);
  }

  if (direction.includes("w")) {
    nextWidth = Math.max(minSize.width, state.startSize.width - deltaX);
    const widthDiff = state.startSize.width - nextWidth;
    nextX = state.startPosition.x + widthDiff;
  }

  if (direction.includes("n")) {
    nextHeight = Math.max(minSize.height, state.startSize.height - deltaY);
    const heightDiff = state.startSize.height - nextHeight;
    nextY = state.startPosition.y + heightDiff;
  }

  return {
    size: {
      width: nextWidth,
      height: nextHeight,
    },
    position: {
      x: nextX,
      y: nextY,
    },
  };
}

export default function Window({
  windowInstance,
  isActive,
  isMobile,
}: Props): JSX.Element | null {
  const {
    closeWindow,
    commitWindowGeometry,
    focusWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);

  const registryEntry = getRegistryEntry(windowInstance.type);

  const contentComponent = registryEntry?.component ?? null;

  useEffect(() => {
    if (windowInstance.minimized) {
      return;
    }

    if (dragState === null) {
      return;
    }

    const handleMouseMove = (event: MouseEvent): void => {
      const deltaX = event.clientX - dragState.startMouseX;
      const deltaY = event.clientY - dragState.startMouseY;

      updateWindowPosition(windowInstance.id, {
        x: dragState.startPosition.x + deltaX,
        y: dragState.startPosition.y + deltaY,
      });
    };

    const handleMouseUp = (): void => {
      commitWindowGeometry(windowInstance.id);
      setDragState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return (): void => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    commitWindowGeometry,
    dragState,
    updateWindowPosition,
    windowInstance.id,
    windowInstance.minimized,
  ]);

  useEffect(() => {
    if (windowInstance.minimized || resizeState === null) {
      return;
    }

    const handleMouseMove = (event: MouseEvent): void => {
      const nextGeometry = resizeFromDirection(
        resizeState.direction,
        resizeState,
        event,
        windowInstance.minSize,
      );

      updateWindowSize(windowInstance.id, nextGeometry.size, nextGeometry.position);
    };

    const handleMouseUp = (): void => {
      commitWindowGeometry(windowInstance.id);
      setResizeState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return (): void => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    commitWindowGeometry,
    resizeState,
    updateWindowSize,
    windowInstance.id,
    windowInstance.minSize,
    windowInstance.minimized,
  ]);

  const handleWindowMouseDown = (): void => {
    focusWindow(windowInstance.id);
  };

  const handleTitleMouseDown = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (isMobile || windowInstance.maximized) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("button") !== null) {
      return;
    }

    focusWindow(windowInstance.id);
    setDragState({
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startPosition: windowInstance.position,
    });
  };

  const handleDoubleClickTitle = (): void => {
    if (isMobile) {
      return;
    }

    toggleMaximizeWindow(windowInstance.id);
  };

  const handleResizeMouseDown =
    (direction: ResizeDirection) =>
    (event: ReactMouseEvent<HTMLDivElement>): void => {
      if (isMobile || windowInstance.maximized || !windowInstance.resizable) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      focusWindow(windowInstance.id);
      setResizeState({
        direction,
        startMouseX: event.clientX,
        startMouseY: event.clientY,
        startSize: windowInstance.size,
        startPosition: windowInstance.position,
      });
    };

  const animatedStyle = useMemo((): CSSProperties => {
    if (!windowInstance.isMinimizing || windowInstance.minimizeTarget === null) {
      return {};
    }

    const targetScaleX = Math.max(
      0.08,
      windowInstance.minimizeTarget.width / Math.max(1, windowInstance.size.width),
    );
    const targetScaleY = Math.max(
      0.08,
      windowInstance.minimizeTarget.height /
        Math.max(1, windowInstance.size.height),
    );

    const translateX =
      windowInstance.minimizeTarget.x - windowInstance.position.x + 8;
    const translateY =
      windowInstance.minimizeTarget.y - windowInstance.position.y + 2;

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${targetScaleX}, ${targetScaleY})`,
      opacity: 0.15,
      transition: `transform ${MINIMIZE_DURATION_MS}ms ease-in, opacity ${MINIMIZE_DURATION_MS}ms ease-in`,
    };
  }, [
    windowInstance.isMinimizing,
    windowInstance.minimizeTarget,
    windowInstance.position.x,
    windowInstance.position.y,
    windowInstance.size.height,
    windowInstance.size.width,
  ]);

  if (!windowInstance.isMinimizing && windowInstance.minimized) {
    return null;
  }

  if (contentComponent === null) {
    return null;
  }

  const ContentComponent = contentComponent;

  if (isMobile) {
    return (
      <div
        className="window-mobile-modal"
        onMouseDown={handleWindowMouseDown}
        role="dialog"
        aria-modal="true"
        aria-label={windowInstance.title}
      >
        <div className="window-mobile-header">
          <span className="window-title-text">{windowInstance.title}</span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeWindow(windowInstance.id);
            }}
            className="window-control-button window-control-close"
            aria-label="Close window"
          >
            X
          </button>
        </div>
        <div className="window-content-area">
          <ContentComponent
            windowId={windowInstance.id}
            windowType={windowInstance.type}
            isMobile
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`winxp-window ${isActive ? "winxp-window-active" : "winxp-window-inactive"}`}
      onMouseDown={handleWindowMouseDown}
      style={{
        width: `${windowInstance.size.width}px`,
        height: `${windowInstance.size.height}px`,
        left: `${windowInstance.position.x}px`,
        top: `${windowInstance.position.y}px`,
        zIndex: windowInstance.zIndex,
        ...animatedStyle,
      }}
      role="dialog"
      aria-modal="false"
      aria-label={windowInstance.title}
    >
      <div
        className="winxp-window-titlebar"
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleDoubleClickTitle}
      >
        <span className="window-title-text">{windowInstance.title}</span>
        <div className="window-controls">
          <button
            type="button"
            className="window-control-button"
            onClick={(event) => {
              event.stopPropagation();
              minimizeWindow(windowInstance.id);
            }}
            aria-label="Minimize window"
          >
            <Image
              src="/assets/xp-icons/minimize"
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="h-3 w-3"
            />
          </button>
          <button
            type="button"
            className="window-control-button"
            onClick={(event) => {
              event.stopPropagation();
              toggleMaximizeWindow(windowInstance.id);
            }}
            aria-label={windowInstance.maximized ? "Restore window" : "Maximize window"}
          >
            <Image
              src="/assets/xp-icons/maximize"
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="h-3 w-3"
            />
          </button>
          <button
            type="button"
            className="window-control-button window-control-close"
            onClick={(event) => {
              event.stopPropagation();
              closeWindow(windowInstance.id);
            }}
            aria-label="Close window"
          >
            <Image
              src="/assets/xp-icons/exit"
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="h-3 w-3"
            />
          </button>
        </div>
      </div>

      <div className="window-content-area">
        <ContentComponent
          windowId={windowInstance.id}
          windowType={windowInstance.type}
          isMobile={false}
        />
      </div>

      {windowInstance.resizable && !windowInstance.maximized ? (
        <>
          <div
            className="window-resize-handle window-resize-handle-n"
            onMouseDown={handleResizeMouseDown("n")}
            style={{ cursor: getResizeCursor("n") }}
          />
          <div
            className="window-resize-handle window-resize-handle-s"
            onMouseDown={handleResizeMouseDown("s")}
            style={{ cursor: getResizeCursor("s") }}
          />
          <div
            className="window-resize-handle window-resize-handle-e"
            onMouseDown={handleResizeMouseDown("e")}
            style={{ cursor: getResizeCursor("e") }}
          />
          <div
            className="window-resize-handle window-resize-handle-w"
            onMouseDown={handleResizeMouseDown("w")}
            style={{ cursor: getResizeCursor("w") }}
          />
          <div
            className="window-resize-handle window-resize-handle-ne"
            onMouseDown={handleResizeMouseDown("ne")}
            style={{ cursor: getResizeCursor("ne") }}
          />
          <div
            className="window-resize-handle window-resize-handle-nw"
            onMouseDown={handleResizeMouseDown("nw")}
            style={{ cursor: getResizeCursor("nw") }}
          />
          <div
            className="window-resize-handle window-resize-handle-se"
            onMouseDown={handleResizeMouseDown("se")}
            style={{ cursor: getResizeCursor("se") }}
          />
          <div
            className="window-resize-handle window-resize-handle-sw"
            onMouseDown={handleResizeMouseDown("sw")}
            style={{ cursor: getResizeCursor("sw") }}
          />
        </>
      ) : null}
    </div>
  );
}
