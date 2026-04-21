import type { ComponentType } from "react";

export type WindowType =
  | "about"
  | "projects"
  | "contact"
  | "resume"
  | "minesweeper"
  | "paint"
  | "doom";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowBounds {
  width: number;
  height: number;
}

export interface WindowRect extends WindowPosition, WindowSize {}

export interface WindowContentProps {
  windowId: string;
  windowType: WindowType;
  isMobile: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitWidth?: () => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
  currentZoom?: number;
  currentPage?: number;
  totalPages?: number;
  isFitWidth?: boolean;
  onTotalPagesChange?: (totalPages: number) => void;
}

export type ToolType =
  | "save"
  | "zoomIn"
  | "zoomOut"
  | "fitWidth"
  | "print"
  | "prevPage"
  | "nextPage"
  | "pageIndicator";

export interface AddressBarConfig {
  path: string;
  showGoButton: boolean;
}

export interface WindowRegistryEntry {
  title: string;
  iconName: string;
  iconPath: string;
  component: ComponentType<WindowContentProps>;
  defaultSize: WindowSize;
  minSize: WindowSize;
  resizable: boolean;
  enforceDefaultSizeOnOpen?: boolean;
  hasToolbar?: boolean;
  hasAddressBar?: boolean;
  toolbarTools?: ToolType[];
  addressBarConfig?: AddressBarConfig;
}

export interface WindowInstance {
  id: string;
  type: WindowType;
  title: string;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  isMinimizing: boolean;
  isRestoring: boolean;
  resizable: boolean;
  minSize: WindowSize;
  previousRect: WindowRect | null;
  minimizeTarget: WindowRect | null;
  restoreSource: WindowRect | null;
}

export interface PersistedWindowGeometry {
  position: WindowPosition;
  size: WindowSize;
}

export interface WindowManagerState {
  openWindows: WindowInstance[];
  activeWindowId: string | null;
}

export interface WindowManagerContextValue extends WindowManagerState {
  openWindow: (windowType: WindowType) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  toggleMaximizeWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: WindowPosition) => void;
  updateWindowSize: (
    windowId: string,
    size: WindowSize,
    position?: WindowPosition,
  ) => void;
  commitWindowGeometry: (windowId: string) => void;
  registerTaskbarButton: (windowId: string, rect: WindowRect | null) => void;
  getWindowById: (windowId: string) => WindowInstance | undefined;
  getWindowByType: (windowType: WindowType) => WindowInstance | undefined;
}
