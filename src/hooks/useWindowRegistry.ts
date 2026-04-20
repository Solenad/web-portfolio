import AboutWindow from "@/features/window/components/content/AboutWindow";
import ContactWindow from "@/features/window/components/content/ContactWindow";
import DoomWindow from "@/features/window/components/content/DoomWindow";
import MinesweeperWindow from "@/features/window/components/content/MinesweeperWindow";
import PaintWindow from "@/features/window/components/content/PaintWindow";
import ProjectsWindow from "@/features/window/components/content/ProjectsWindow";
import ResumeWindow from "@/features/window/components/content/ResumeWindow";
import type { DesktopIconItem } from "@/types/desktop.types";
import type { WindowRegistryEntry, WindowType } from "@/types/window.types";

const WINDOW_REGISTRY: Record<WindowType, WindowRegistryEntry> = {
  about: {
    title: "About Me",
    iconName: "about",
    iconPath: "/assets/xp-icons/user.webp",
    component: AboutWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
  },
  projects: {
    title: "Projects",
    iconName: "projects",
    iconPath: "/assets/xp-icons/folder-closed.webp",
    component: ProjectsWindow,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 480, height: 320 },
    resizable: true,
  },
  contact: {
    title: "Contact",
    iconName: "contact",
    iconPath: "/assets/xp-icons/mail.webp",
    component: ContactWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
  },
  resume: {
    title: "Resume",
    iconName: "resume",
    iconPath: "/assets/xp-icons/pdf.webp",
    component: ResumeWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
  },
  minesweeper: {
    title: "Minesweeper",
    iconName: "minesweeper",
    iconPath: "/assets/xp-icons/minesweeper.webp",
    component: MinesweeperWindow,
    defaultSize: { width: 360, height: 460 },
    minSize: { width: 360, height: 460 },
    resizable: false,
  },
  paint: {
    title: "Paint",
    iconName: "paint",
    iconPath: "/assets/xp-icons/paint.webp",
    component: PaintWindow,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 480, height: 340 },
    resizable: true,
  },
  doom: {
    title: "DOOM",
    iconName: "doom",
    iconPath: "/assets/xp-icons/doom.webp",
    component: DoomWindow,
    defaultSize: { width: 960, height: 700 },
    minSize: { width: 640, height: 420 },
    resizable: true,
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
