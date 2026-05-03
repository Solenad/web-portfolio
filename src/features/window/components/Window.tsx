"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, JSX, MouseEvent as ReactMouseEvent } from "react";

import { getRegistryEntry } from "@/features/windows/hooks/useWindowRegistry";
import { useWindowManager } from "@/features/windows/hooks/useWindowManager";
import type {
  ToolType,
  WindowInstance,
  WindowPosition,
  WindowSize,
} from "@/types/window.types";

interface Props {
  windowInstance: WindowInstance;
  isActive: boolean;
  isMobile: boolean;
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

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
const RESTORE_DURATION_MS = 180;
const WINDOW_MENU_ITEMS = ["File", "View", "Favorites", "Tools", "Help"];
const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function shouldRenderToolbarDivider(
  previousTool: ToolType | null,
  currentTool: ToolType,
): boolean {
  if (previousTool === null) {
    return false;
  }

  if (currentTool === "print") {
    return previousTool !== "print";
  }

  if (currentTool === "prevPage") {
    return previousTool !== "prevPage";
  }

  return false;
}

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
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isClosing, setIsClosing] = useState(false);
  const isFirstRender = useRef(true);
  /* eslint-disable */
  const showFadeIn = isFirstRender.current && !windowInstance.isRestoring;
  /* eslint-enable */

  const registryEntry = getRegistryEntry(windowInstance.type);
  const hasToolbar = registryEntry?.hasToolbar ?? false;
  const hasAddressBar = registryEntry?.hasAddressBar ?? false;
  const toolbarTools = registryEntry?.toolbarTools ?? [];
  const addressBarConfig = registryEntry?.addressBarConfig;

  const contentComponent = registryEntry?.component ?? null;

  const handleZoomIn = useCallback((): void => {
    setCurrentZoom((previousZoom) => {
      return clampNumber(previousZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
    });
  }, []);

  const handleZoomOut = useCallback((): void => {
    setCurrentZoom((previousZoom) => {
      return clampNumber(previousZoom - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
    });
  }, []);

  const handlePrevPage = useCallback((): void => {
    setCurrentPage((previousPage) => {
      return Math.max(1, previousPage - 1);
    });
  }, []);

  const handleNextPage = useCallback((): void => {
    setCurrentPage((previousPage) => {
      const maxPages = Math.max(1, totalPages);
      return Math.min(maxPages, previousPage + 1);
    });
  }, [totalPages]);

  const handleSave = useCallback((): void => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/assets/resume.pdf";
    downloadLink.download = "resume.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, []);

  const handlePrint = useCallback((): void => {
    window.print();
  }, []);

  const handleTotalPagesChange = useCallback((nextTotalPages: number): void => {
    setTotalPages(nextTotalPages);
    setCurrentPage((previousPage) => {
      const boundedMax = Math.max(1, nextTotalPages);
      return Math.min(previousPage, boundedMax);
    });
  }, []);

  const handleClose = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      if (isClosing) {
        return;
      }
      setIsClosing(true);
      setTimeout(() => {
        closeWindow(windowInstance.id);
      }, 150);
    },
    [closeWindow, windowInstance.id, isClosing],
  );

  const renderToolbarTool = useCallback(
    (tool: ToolType): JSX.Element => {
      const pageCount = Math.max(totalPages, 1);

      switch (tool) {
        case "save":
          return (
            <button
              type="button"
              className="window-toolbar-button transition-hover"
              onClick={handleSave}
            >
              <Image
                src="/assets/xp-icons/save.webp"
                alt="Save Button"
                width={24}
                height={24}
                className="window-toolbar-button-icon"
                aria-hidden="true"
              />
              <span>Save</span>
            </button>
          );
        case "zoomIn":
          return (
            <button
              type="button"
              className="window-toolbar-button transition-hover"
              onClick={handleZoomIn}
            >
              <Image
                src="/assets/xp-icons/zoomin.webp"
                alt="Zoom In Button"
                width={24}
                height={24}
                className="window-toolbar-button-icon"
                aria-hidden="true"
              />
              <span>Zoom In</span>
            </button>
          );
        case "zoomOut":
          return (
            <button
              type="button"
              className="window-toolbar-button transition-hover"
              onClick={handleZoomOut}
            >
              <Image
                src="/assets/xp-icons/zoomout.webp"
                alt="Zoom Out Button"
                width={24}
                height={24}
                className="window-toolbar-button-icon"
                aria-hidden="true"
              />
              <span>Zoom Out</span>
            </button>
          );
        case "print":
          return (
            <button
              type="button"
              className="window-toolbar-button transition-hover"
              onClick={handlePrint}
            >
              <Image
                src="/assets/xp-icons/printer.webp"
                alt=""
                width={24}
                height={24}
                className="window-toolbar-button-icon"
                aria-hidden="true"
              />
              <span>Print</span>
            </button>
          );
        case "prevPage":
          return (
            <button
              type="button"
              className="window-toolbar-button transition-hover"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
          );
        case "nextPage":
          return (
            <button
              type="button"
              className="window-toolbar-button transition-hover"
              onClick={handleNextPage}
              disabled={currentPage >= pageCount}
            >
              Next
            </button>
          );
        case "pageIndicator":
          return (
            <span className="window-toolbar-indicator">
              Page {Math.min(currentPage, pageCount)} of {pageCount}
            </span>
          );
        case "github":
          return (
            <a
              href="https://github.com/rohanndizon"
              target="_blank"
              rel="noopener noreferrer"
              className="window-toolbar-button transition-hover"
            >
              <Image
                src="/assets/xp-icons/folder-closed.webp"
                alt=""
                width={20}
                height={20}
                className="window-toolbar-button-icon"
                aria-hidden="true"
              />
              <span>GitHub</span>
            </a>
          );
        case "linkedin":
          return (
            <a
              href="https://linkedin.com/in/rohanndizon"
              target="_blank"
              rel="noopener noreferrer"
              className="window-toolbar-button transition-hover"
            >
              <Image
                src="/assets/xp-icons/user.webp"
                alt=""
                width={20}
                height={20}
                className="window-toolbar-button-icon"
                aria-hidden="true"
              />
              <span>LinkedIn</span>
            </a>
          );
        default:
          return <span />;
      }
    },
    [
      currentPage,
      handleNextPage,
      handlePrevPage,
      handlePrint,
      handleSave,
      handleZoomIn,
      handleZoomOut,
      totalPages,
    ],
  );

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

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

      const rawX = dragState.startPosition.x + deltaX;
      const rawY = dragState.startPosition.y + deltaY;

      const minVisibleWidth = 100;
      const clampedX = Math.max(
        -(windowInstance.size.width - minVisibleWidth),
        Math.min(rawX, window.innerWidth - minVisibleWidth),
      );
      const clampedY = Math.max(0, rawY);

      updateWindowPosition(windowInstance.id, {
        x: clampedX,
        y: clampedY,
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
    windowInstance.size.width,
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

      updateWindowSize(
        windowInstance.id,
        nextGeometry.size,
        nextGeometry.position,
      );
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

  const handleTitleMouseDown = (
    event: ReactMouseEvent<HTMLDivElement>,
  ): void => {
    if (isMobile) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest("button") !== null) {
      return;
    }

    // Drag-to-restore: if maximized, restore first then position window with cursor on titlebar
    if (windowInstance.maximized && windowInstance.previousRect !== null) {
      toggleMaximizeWindow(windowInstance.id);

      // After restoring, position window so cursor is over the titlebar area
      const titlebarHeight = 28;
      const newWidth = windowInstance.previousRect.width;

      // Center the window horizontally on the cursor, keep vertically positioned
      // so cursor is on the titlebar (slightly above center)
      let newX = event.clientX - newWidth / 2;
      let newY = event.clientY - titlebarHeight / 2;

      // Clamp to viewport bounds (at least 100px visible)
      const minVisibleWidth = 100;
      newX = Math.max(
        -(newWidth - minVisibleWidth),
        Math.min(newX, window.innerWidth - minVisibleWidth),
      );
      newY = Math.max(0, newY);

      updateWindowPosition(windowInstance.id, { x: newX, y: newY });

      setDragState({
        startMouseX: event.clientX,
        startMouseY: event.clientY,
        startPosition: { x: newX, y: newY },
      });

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
    if (
      !windowInstance.isMinimizing ||
      windowInstance.minimizeTarget === null
    ) {
      if (
        !windowInstance.isRestoring ||
        windowInstance.restoreSource === null
      ) {
        return {};
      }

      const sourceScaleX = Math.max(
        0.08,
        windowInstance.restoreSource.width /
          Math.max(1, windowInstance.size.width),
      );
      const sourceScaleY = Math.max(
        0.08,
        windowInstance.restoreSource.height /
          Math.max(1, windowInstance.size.height),
      );

      const sourceTranslateX =
        windowInstance.restoreSource.x - windowInstance.position.x + 8;
      const sourceTranslateY =
        windowInstance.restoreSource.y - windowInstance.position.y + 2;

      return {
        "--window-restore-from-transform": `translate(${sourceTranslateX}px, ${sourceTranslateY}px) scale(${sourceScaleX}, ${sourceScaleY})`,
        transform: `translate(${sourceTranslateX}px, ${sourceTranslateY}px) scale(${sourceScaleX}, ${sourceScaleY})`,
        opacity: 0.15,
        animation: `window-restore ${RESTORE_DURATION_MS}ms ease-out forwards`,
      } as CSSProperties;
    }

    const targetScaleX = Math.max(
      0.08,
      windowInstance.minimizeTarget.width /
        Math.max(1, windowInstance.size.width),
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
    windowInstance.isRestoring,
    windowInstance.minimizeTarget,
    windowInstance.restoreSource,
    windowInstance.position.x,
    windowInstance.position.y,
    windowInstance.size.height,
    windowInstance.size.width,
  ]);

  const contentProps = {
    windowId: windowInstance.id,
    windowType: windowInstance.type,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onPrevPage: handlePrevPage,
    onNextPage: handleNextPage,
    onSave: handleSave,
    onPrint: handlePrint,
    currentZoom,
    currentPage,
    totalPages,
    onTotalPagesChange: handleTotalPagesChange,
  };

  const toolbarElement =
    hasToolbar && toolbarTools.length > 0 ? (
      <div className="window-toolbar" role="toolbar" aria-label="Window tools">
        {toolbarTools.map((tool, index) => {
          const previousTool = index > 0 ? toolbarTools[index - 1] : null;
          const shouldRenderDivider = shouldRenderToolbarDivider(
            previousTool,
            tool,
          );

          return (
            <div
              key={`${windowInstance.id}-${tool}-${index}`}
              className="window-toolbar-item"
            >
              {shouldRenderDivider ? (
                <span className="window-toolbar-divider" aria-hidden="true" />
              ) : null}
              {renderToolbarTool(tool)}
            </div>
          );
        })}
      </div>
    ) : null;

  const addressBarElement =
    hasAddressBar && addressBarConfig !== undefined ? (
      <div className="window-address-bar" aria-label="Window address bar">
        <span className="window-address-bar-label">Address</span>
        <div className="window-address-bar-input">
          <Image
            src={registryEntry?.iconPath ?? "/assets/xp-icons/user.webp"}
            alt=""
            width={16}
            height={16}
            className="window-address-bar-icon"
            aria-hidden="true"
          />
          <span className="window-address-bar-path">
            {addressBarConfig.path}
          </span>
        </div>
        {addressBarConfig.showGoButton ? (
          <button
            type="button"
            className="window-address-bar-go"
            onClick={(event) => {
              event.preventDefault();
            }}
            aria-label="Go button placeholder"
          >
            <span aria-hidden="true">Go</span>
          </button>
        ) : null}
      </div>
    ) : null;

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
        className={`window-mobile-modal ${showFadeIn ? "fade-in" : ""} ${isClosing ? "fade-out" : ""}`}
        onMouseDown={handleWindowMouseDown}
        role="dialog"
        aria-modal="true"
        aria-label={windowInstance.title}
      >
        <div className="window-mobile-header">
          <div className="flex items-center gap-2">
            <Image
              src={registryEntry?.iconPath ?? "/assets/xp-icons/user.webp"}
              alt=""
              width={20}
              height={20}
              className="window-titlebar-icon"
              aria-hidden="true"
            />
            <span className="window-title-text">{windowInstance.title}</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="window-control-button transition-hover"
            aria-label="Close window"
          >
            <Image
              src="/assets/xp-icons/exit"
              alt=""
              aria-hidden="true"
              width={21}
              height={21}
              className="window-control-icon"
            />
          </button>
          <div className="ml-auto bg-[#fafafa] h-full px-4 flex items-center">
            <Image
              width={18}
              height={18}
              alt="xp_logo"
              src="/assets/xp-icons/xp_logo.webp"
            />
          </div>
        </div>

        {toolbarElement}
        {addressBarElement}

        <div className="window-content-area">
          <ContentComponent {...contentProps} isMobile />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`winxp-window ${showFadeIn ? "fade-in" : ""} ${isClosing ? "fade-out" : ""} ${isActive ? "winxp-window-active" : "winxp-window-inactive"}`}
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
        <div className="flex items-center gap-2">
          <Image
            src={registryEntry?.iconPath ?? "/assets/xp-icons/user.webp"}
            alt=""
            width={20}
            height={20}
            className="window-titlebar-icon"
            aria-hidden="true"
          />
          <span className="window-title-text">{windowInstance.title}</span>
        </div>
        <div className="window-controls">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              minimizeWindow(windowInstance.id);
            }}
            className="window-control-button transition-hover"
            aria-label="Minimize window"
          >
            <Image
              src="/assets/xp-icons/minimize"
              alt=""
              aria-hidden="true"
              width={21}
              height={21}
              className="window-control-icon"
            />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleMaximizeWindow(windowInstance.id);
            }}
            className="window-control-button transition-hover"
            aria-label={
              windowInstance.maximized ? "Restore window" : "Maximize window"
            }
          >
            <Image
              src="/assets/xp-icons/maximize"
              alt=""
              aria-hidden="true"
              width={21}
              height={21}
              className="window-control-icon"
            />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="window-control-button"
            aria-label="Close window"
          >
            <Image
              src="/assets/xp-icons/exit"
              alt=""
              aria-hidden="true"
              width={21}
              height={21}
              className="window-control-icon"
            />
          </button>
        </div>
      </div>

      <div className="window-menubar" role="toolbar" aria-label="Window menu">
        {WINDOW_MENU_ITEMS.map((item) => (
          <button
            key={item}
            type="button"
            className="window-menu-item transition-hover"
          >
            {item}
          </button>
        ))}
        <div className="ml-auto bg-[#fafafa] h-full px-4 flex items-center">
          <Image
            width={18}
            height={18}
            alt="xp_logo"
            src="/assets/xp-icons/xp_logo.webp"
          />
        </div>
      </div>

      {toolbarElement}
      {addressBarElement}

      <div className="window-content-area">
        <ContentComponent {...contentProps} isMobile={false} />
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
