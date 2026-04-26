import AboutWindow from "@/features/windows/content/about/AboutWindow";
import ContactWindow from "@/features/windows/content/contact/ContactWindow";
import DoomWindow from "@/features/windows/content/doom/DoomWindow";
import MinesweeperWindow from "@/features/windows/content/minesweeper/MinesweeperWindow";
import PaintWindow from "@/features/windows/content/paint/PaintWindow";
import ProjectsWindow from "@/features/windows/content/projects/ProjectsWindow";
import ResumeWindow from "@/features/windows/content/resume/ResumeWindow";
import type { DesktopIconItem } from "@/types/desktop.types";
import type {
  AddressBarConfig,
  ToolType,
  WindowRegistryEntry,
  WindowType,
} from "@/types/window.types";

const RESUME_TOOLBAR_TOOLS: ToolType[] = [
  "save",
  "zoomIn",
  "zoomOut",
  "fitWidth",
  "print",
  "prevPage",
  "pageIndicator",
  "nextPage",
];

const RESUME_ADDRESS_BAR: AddressBarConfig = {
  path: "C:\\Rohann\\Desktop\\Resume",
  showGoButton: true,
};

const WINDOW_REGISTRY: Record<WindowType, WindowRegistryEntry> = {
  about: {
    title: "About Me",
    iconName: "about",
    iconPath: "/assets/xp-icons/user.webp",
    component: AboutWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
    hasToolbar: false,
    hasAddressBar: false,
  },
  projects: {
    title: "Projects",
    iconName: "projects",
    iconPath: "/assets/xp-icons/folder-closed.webp",
    component: ProjectsWindow,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 480, height: 320 },
    resizable: true,
    hasToolbar: false,
    hasAddressBar: false,
  },
  contact: {
    title: "Contact",
    iconName: "contact",
    iconPath: "/assets/xp-icons/mail.webp",
    component: ContactWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
    hasToolbar: false,
    hasAddressBar: false,
  },
  resume: {
    title: "Resume",
    iconName: "resume",
    iconPath: "/assets/xp-icons/pdf.webp",
    component: ResumeWindow,
    defaultSize: { width: 980, height: 700 },
    minSize: { width: 560, height: 420 },
    resizable: true,
    enforceDefaultSizeOnOpen: true,
    hasToolbar: true,
    hasAddressBar: true,
    toolbarTools: RESUME_TOOLBAR_TOOLS,
    addressBarConfig: RESUME_ADDRESS_BAR,
  },
  minesweeper: {
    title: "Minesweeper",
    iconName: "minesweeper",
    iconPath: "/assets/xp-icons/minesweeper.webp",
    component: MinesweeperWindow,
    defaultSize: { width: 360, height: 460 },
    minSize: { width: 360, height: 460 },
    resizable: false,
    hasToolbar: false,
    hasAddressBar: false,
  },
  paint: {
    title: "Paint",
    iconName: "paint",
    iconPath: "/assets/xp-icons/paint.webp",
    component: PaintWindow,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 480, height: 340 },
    resizable: true,
    hasToolbar: false,
    hasAddressBar: false,
  },
  doom: {
    title: "DOOM",
    iconName: "doom",
    iconPath: "/assets/xp-icons/doom.webp",
    component: DoomWindow,
    defaultSize: { width: 960, height: 700 },
    minSize: { width: 640, height: 420 },
    resizable: true,
    hasToolbar: false,
    hasAddressBar: false,
  },
};

export function getDesktopIcons(): DesktopIconItem[] {
  return (Object.keys(WINDOW_REGISTRY) as WindowType[]).map((windowType) => {
    const entry = WINDOW_REGISTRY[windowType];

    return {
      id: windowType,
      label: entry.title,
      iconName: entry.iconName,
      iconPath: entry.iconPath,
      windowId: `window-${windowType}`,
      windowType,
    };
  });
}

export function getRegistryEntry(
  windowType: string,
): WindowRegistryEntry | null {
  if (windowType in WINDOW_REGISTRY) {
    return WINDOW_REGISTRY[windowType as WindowType];
  }

  return null;
}

export function useWindowRegistry(): {
  registry: Record<WindowType, WindowRegistryEntry>;
  getRegistryEntry: (windowType: string) => WindowRegistryEntry | null;
  getDesktopIcons: () => DesktopIconItem[];
} {
  return {
    registry: WINDOW_REGISTRY,
    getRegistryEntry,
    getDesktopIcons,
  };
}