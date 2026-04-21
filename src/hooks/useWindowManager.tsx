"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { JSX, MutableRefObject, ReactNode } from "react";

import { getRegistryEntry } from "@/hooks/useWindowRegistry";
import type {
  PersistedWindowGeometry,
  WindowBounds,
  WindowInstance,
  WindowManagerContextValue,
  WindowPosition,
  WindowRect,
  WindowSize,
  WindowType,
} from "@/types/window.types";

const TASKBAR_HEIGHT = 30;
const MINIMIZE_DURATION_MS = 180;
const RESTORE_DURATION_MS = 180;
const WINDOW_ID_SUFFIX_LENGTH = 6;

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);

function getStoragePositionKey(windowType: WindowType): string {
  return `window:${windowType}:position`;
}

function getStorageSizeKey(windowType: WindowType): string {
  return `window:${windowType}:size`;
}

function isWindowPosition(value: unknown): value is WindowPosition {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.x === "number" && typeof candidate.y === "number";
}

function isWindowSize(value: unknown): value is WindowSize {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.width === "number" && typeof candidate.height === "number"
  );
}

function getViewportBounds(): WindowBounds {
  if (typeof window === "undefined") {
    return {
      width: 1366,
      height: 768 - TASKBAR_HEIGHT,
    };
  }

  return {
    width: Math.max(320, window.innerWidth),
    height: Math.max(200, window.innerHeight - TASKBAR_HEIGHT),
  };
}

function loadFromStorage(windowType: WindowType): PersistedWindowGeometry | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedPosition = window.localStorage.getItem(
      getStoragePositionKey(windowType),
    );
    const storedSize = window.localStorage.getItem(getStorageSizeKey(windowType));

    if (storedPosition === null || storedSize === null) {
      return null;
    }

    const parsedPosition: unknown = JSON.parse(storedPosition);
    const parsedSize: unknown = JSON.parse(storedSize);

    if (!isWindowPosition(parsedPosition) || !isWindowSize(parsedSize)) {
      return null;
    }

    return {
      position: parsedPosition,
      size: parsedSize,
    };
  } catch {
    return null;
  }
}

function saveToStorage(
  windowType: WindowType,
  geometry: PersistedWindowGeometry,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      getStoragePositionKey(windowType),
      JSON.stringify(geometry.position),
    );
    window.localStorage.setItem(
      getStorageSizeKey(windowType),
      JSON.stringify(geometry.size),
    );
  } catch {
    // Intentionally noop. Falling back to in-memory window state.
  }
}

function getTopVisibleWindowId(windows: WindowInstance[]): string | null {
  const topWindow = windows
    .filter((windowInstance) => !windowInstance.minimized)
    .sort((left, right) => right.zIndex - left.zIndex)[0];

  return topWindow?.id ?? null;
}

function makeWindowId(windowType: WindowType): string {
  const randomSuffix = Math.random()
    .toString(36)
    .slice(2, 2 + WINDOW_ID_SUFFIX_LENGTH);

  return `${windowType}-${Date.now()}-${randomSuffix}`;
}

function clearMinimizeTimeout(
  minimizeTimeoutsRef: MutableRefObject<Record<string, number>>,
  windowId: string,
): void {
  const timeoutId = minimizeTimeoutsRef.current[windowId];

  if (timeoutId === undefined) {
    return;
  }

  window.clearTimeout(timeoutId);
  delete minimizeTimeoutsRef.current[windowId];
}

interface WindowManagerProviderProps {
  children: ReactNode;
}

export function WindowManagerProvider({
  children,
}: WindowManagerProviderProps): JSX.Element {
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const openWindowsRef = useRef<WindowInstance[]>([]);
  const zIndexCounterRef = useRef<number>(200);
  const taskbarRectsRef = useRef<Record<string, WindowRect>>({});
  const minimizeTimeoutsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    openWindowsRef.current = openWindows;
  }, [openWindows]);

  const setWindows = useCallback((nextWindows: WindowInstance[]): void => {
    openWindowsRef.current = nextWindows;
    setOpenWindows(nextWindows);
  }, []);

  useEffect(() => {
    const pendingTimeouts = minimizeTimeoutsRef.current;

    return (): void => {
      Object.values(pendingTimeouts).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  const getCenteredPosition = useCallback((size: WindowSize): WindowPosition => {
    const bounds = getViewportBounds();
    const centerX = Math.max(0, bounds.width - size.width) / 2;
    const centerY = Math.max(0, bounds.height - size.height) / 2;

    return {
      x: Math.round(centerX),
      y: Math.round(centerY),
    };
  }, []);

  const openWindow = useCallback(
    (windowType: WindowType): void => {
      const registryEntry = getRegistryEntry(windowType);

      if (registryEntry === null) {
        return;
      }

      const currentWindows = openWindowsRef.current;
      const existingWindow = currentWindows.find(
        (windowInstance) => windowInstance.type === windowType,
      );

      if (existingWindow !== undefined) {
        clearMinimizeTimeout(minimizeTimeoutsRef, existingWindow.id);
        const nextZIndex = zIndexCounterRef.current++;
        const updatedWindows = currentWindows.map((windowInstance) => {
          if (windowInstance.id !== existingWindow.id) {
            return windowInstance;
          }

          return {
            ...windowInstance,
            minimized: false,
            isMinimizing: false,
            isRestoring: false,
            minimizeTarget: null,
            restoreSource: null,
            zIndex: nextZIndex,
          };
        });

        setWindows(updatedWindows);
        setActiveWindowId(existingWindow.id);

        return;
      }

      const persistedGeometry = loadFromStorage(windowType);
      const initialSize =
        persistedGeometry !== null && !registryEntry.enforceDefaultSizeOnOpen
          ? persistedGeometry.size
          : registryEntry.defaultSize;
      const initialPosition =
        persistedGeometry !== null && !registryEntry.enforceDefaultSizeOnOpen
          ? persistedGeometry.position
          : getCenteredPosition(initialSize);

      const windowId = makeWindowId(windowType);
      const nextZIndex = zIndexCounterRef.current++;

      const newWindow: WindowInstance = {
        id: windowId,
        type: windowType,
        title: registryEntry.title,
        position: initialPosition,
        size: initialSize,
        zIndex: nextZIndex,
        minimized: false,
        maximized: false,
        isMinimizing: false,
        isRestoring: false,
        resizable: registryEntry.resizable,
        minSize: registryEntry.minSize,
        previousRect: null,
        minimizeTarget: null,
        restoreSource: null,
      };

      setWindows([...currentWindows, newWindow]);
      setActiveWindowId(windowId);
    },
    [getCenteredPosition, setWindows],
  );

  const closeWindow = useCallback((windowId: string): void => {
    const updatedWindows = openWindowsRef.current.filter(
      (windowInstance) => windowInstance.id !== windowId,
    );

    setWindows(updatedWindows);
    setActiveWindowId(getTopVisibleWindowId(updatedWindows));

    clearMinimizeTimeout(minimizeTimeoutsRef, windowId);
  }, [setWindows]);

  const focusWindow = useCallback((windowId: string): void => {
    const existingWindow = openWindowsRef.current.find(
      (windowInstance) => windowInstance.id === windowId,
    );

    if (existingWindow === undefined) {
      return;
    }

    clearMinimizeTimeout(minimizeTimeoutsRef, windowId);

    const updatedWindows = openWindowsRef.current.map((windowInstance) => {
      if (windowInstance.id !== windowId) {
        return windowInstance;
      }

      return {
        ...windowInstance,
        minimized: false,
        isMinimizing: false,
        isRestoring: false,
        minimizeTarget: null,
        restoreSource: null,
        zIndex: zIndexCounterRef.current++,
      };
    });

    setWindows(updatedWindows);
    setActiveWindowId(windowId);
  }, [setWindows]);

  const finishMinimize = useCallback((windowId: string): void => {
    const updatedWindows = openWindowsRef.current.map((windowInstance) => {
      if (windowInstance.id !== windowId) {
        return windowInstance;
      }

      return {
        ...windowInstance,
        minimized: true,
        isMinimizing: false,
        isRestoring: false,
        minimizeTarget: null,
        restoreSource: null,
      };
    });

    setWindows(updatedWindows);
    setActiveWindowId(getTopVisibleWindowId(updatedWindows));
  }, [setWindows]);

  const minimizeWindow = useCallback(
    (windowId: string): void => {
      clearMinimizeTimeout(minimizeTimeoutsRef, windowId);
      const targetRect = taskbarRectsRef.current[windowId] ?? null;
      const updatedWindows = openWindowsRef.current.map((windowInstance) => {
        if (windowInstance.id !== windowId) {
          return windowInstance;
        }

        if (targetRect === null) {
          return {
            ...windowInstance,
            minimized: true,
            isMinimizing: false,
            isRestoring: false,
            minimizeTarget: null,
            restoreSource: null,
          };
        }

        return {
          ...windowInstance,
          isMinimizing: true,
          isRestoring: false,
          minimizeTarget: targetRect,
          restoreSource: null,
        };
      });

      setWindows(updatedWindows);

      if (targetRect === null) {
        setActiveWindowId(getTopVisibleWindowId(updatedWindows));

        return;
      }

      const existingTimeoutId = minimizeTimeoutsRef.current[windowId];

      if (existingTimeoutId !== undefined) {
        window.clearTimeout(existingTimeoutId);
      }

      minimizeTimeoutsRef.current[windowId] = window.setTimeout(() => {
        finishMinimize(windowId);
        delete minimizeTimeoutsRef.current[windowId];
      }, MINIMIZE_DURATION_MS);
    },
    [finishMinimize, setWindows],
  );

  const restoreWindow = useCallback((windowId: string): void => {
    clearMinimizeTimeout(minimizeTimeoutsRef, windowId);
    const sourceRect = taskbarRectsRef.current[windowId] ?? null;
    const updatedWindows = openWindowsRef.current.map((windowInstance) => {
      if (windowInstance.id !== windowId) {
        return windowInstance;
      }

      return {
        ...windowInstance,
        minimized: false,
        isMinimizing: false,
        isRestoring: sourceRect !== null,
        minimizeTarget: null,
        restoreSource: sourceRect,
        zIndex: zIndexCounterRef.current++,
      };
    });

    setWindows(updatedWindows);

    setActiveWindowId(windowId);

    if (sourceRect === null) {
      return;
    }

    const existingTimeoutId = minimizeTimeoutsRef.current[windowId];

    if (existingTimeoutId !== undefined) {
      window.clearTimeout(existingTimeoutId);
    }

    minimizeTimeoutsRef.current[windowId] = window.setTimeout(() => {
      const settledWindows = openWindowsRef.current.map((windowInstance) => {
        if (windowInstance.id !== windowId) {
          return windowInstance;
        }

        return {
          ...windowInstance,
          isRestoring: false,
          restoreSource: null,
        };
      });

      setWindows(settledWindows);
      delete minimizeTimeoutsRef.current[windowId];
    }, RESTORE_DURATION_MS);
  }, [setWindows]);

  const toggleMaximizeWindow = useCallback((windowId: string): void => {
    clearMinimizeTimeout(minimizeTimeoutsRef, windowId);
    const bounds = getViewportBounds();

    const updatedWindows = openWindowsRef.current.map((windowInstance) => {
      if (windowInstance.id !== windowId) {
        return windowInstance;
      }

      if (windowInstance.maximized && windowInstance.previousRect !== null) {
        return {
          ...windowInstance,
          position: {
            x: windowInstance.previousRect.x,
            y: windowInstance.previousRect.y,
          },
          size: {
            width: windowInstance.previousRect.width,
            height: windowInstance.previousRect.height,
          },
          previousRect: null,
          maximized: false,
          isRestoring: false,
          restoreSource: null,
          zIndex: zIndexCounterRef.current++,
        };
      }

      return {
        ...windowInstance,
        previousRect: {
          x: windowInstance.position.x,
          y: windowInstance.position.y,
          width: windowInstance.size.width,
          height: windowInstance.size.height,
        },
        position: { x: 0, y: 0 },
        size: {
          width: bounds.width,
          height: bounds.height,
        },
        maximized: true,
        isRestoring: false,
        minimizeTarget: null,
        restoreSource: null,
        zIndex: zIndexCounterRef.current++,
      };
    });

    setWindows(updatedWindows);

    setActiveWindowId(windowId);
  }, [setWindows]);

  const updateWindowPosition = useCallback(
    (windowId: string, position: WindowPosition): void => {
      const updatedWindows = openWindowsRef.current.map((windowInstance) => {
        if (windowInstance.id !== windowId || windowInstance.maximized) {
          return windowInstance;
        }

        return {
          ...windowInstance,
          position,
        };
      });

      setWindows(updatedWindows);
    },
    [setWindows],
  );

  const updateWindowSize = useCallback(
    (windowId: string, size: WindowSize, position?: WindowPosition): void => {
      const updatedWindows = openWindowsRef.current.map((windowInstance) => {
        if (windowInstance.id !== windowId || windowInstance.maximized) {
          return windowInstance;
        }

        return {
          ...windowInstance,
          size,
          position: position ?? windowInstance.position,
        };
      });

      setWindows(updatedWindows);
    },
    [setWindows],
  );

  const commitWindowGeometry = useCallback(
    (windowId: string): void => {
      const targetWindow = openWindowsRef.current.find(
        (windowInstance) => windowInstance.id === windowId,
      );

      if (targetWindow === undefined) {
        return;
      }

      saveToStorage(targetWindow.type, {
        position: targetWindow.position,
        size: targetWindow.size,
      });
    },
    [],
  );

  const registerTaskbarButton = useCallback(
    (windowId: string, rect: WindowRect | null): void => {
      if (rect === null) {
        delete taskbarRectsRef.current[windowId];

        return;
      }

      taskbarRectsRef.current[windowId] = rect;
    },
    [],
  );

  const getWindowById = useCallback(
    (windowId: string): WindowInstance | undefined => {
      return openWindows.find((windowInstance) => windowInstance.id === windowId);
    },
    [openWindows],
  );

  const getWindowByType = useCallback(
    (windowType: WindowType): WindowInstance | undefined => {
      return openWindows.find((windowInstance) => windowInstance.type === windowType);
    },
    [openWindows],
  );

  const contextValue = useMemo<WindowManagerContextValue>(
    () => ({
      openWindows,
      activeWindowId,
      openWindow,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximizeWindow,
      updateWindowPosition,
      updateWindowSize,
      commitWindowGeometry,
      registerTaskbarButton,
      getWindowById,
      getWindowByType,
    }),
    [
      activeWindowId,
      closeWindow,
      commitWindowGeometry,
      focusWindow,
      getWindowById,
      getWindowByType,
      minimizeWindow,
      openWindow,
      openWindows,
      registerTaskbarButton,
      restoreWindow,
      toggleMaximizeWindow,
      updateWindowPosition,
      updateWindowSize,
    ],
  );

  return (
    <WindowManagerContext.Provider value={contextValue}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager(): WindowManagerContextValue {
  const contextValue = useContext(WindowManagerContext);

  if (contextValue === null) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }

  return contextValue;
}
