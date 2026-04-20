import AboutWindow from "@/features/window/components/content/AboutWindow";
import ContactWindow from "@/features/window/components/content/ContactWindow";
import DoomWindow from "@/features/window/components/content/DoomWindow";
import MinesweeperWindow from "@/features/window/components/content/MinesweeperWindow";
import PaintWindow from "@/features/window/components/content/PaintWindow";
import ProjectsWindow from "@/features/window/components/content/ProjectsWindow";
import ResumeWindow from "@/features/window/components/content/ResumeWindow";
import type { WindowRegistryEntry, WindowType } from "@/types/window.types";

const WINDOW_REGISTRY: Record<WindowType, WindowRegistryEntry> = {
  about: {
    title: "About Me",
    iconPath: "/assets/xp-icons/user.webp",
    component: AboutWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
  },
  projects: {
    title: "Projects",
    iconPath: "/assets/xp-icons/projects.png",
    component: ProjectsWindow,
    defaultSize: { width: 800, height: 600 },
    minSize: { width: 480, height: 320 },
    resizable: true,
  },
  contact: {
    title: "Contact",
    iconPath: "/assets/xp-icons/mail.webp",
    component: ContactWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
  },
  resume: {
    title: "Resume",
    iconPath: "/assets/xp-icons/my-computer.webp",
    component: ResumeWindow,
    defaultSize: { width: 600, height: 400 },
    minSize: { width: 360, height: 260 },
    resizable: true,
  },
  minesweeper: {
    title: "Minesweeper",
    iconPath: "/assets/xp-icons/minesweeper.webp",
    component: MinesweeperWindow,
    defaultSize: { width: 360, height: 460 },
    minSize: { width: 360, height: 460 },
    resizable: false,
  },
  paint: {
    title: "Paint",
    iconPath: "/assets/xp-icons/camera.webp",
    component: PaintWindow,
    defaultSize: { width: 900, height: 650 },
    minSize: { width: 480, height: 340 },
    resizable: true,
  },
  doom: {
    title: "DOOM",
    iconPath: "/assets/xp-icons/chrome.webp",
    component: DoomWindow,
    defaultSize: { width: 960, height: 700 },
    minSize: { width: 640, height: 420 },
    resizable: true,
  },
};

export function getRegistryEntry(windowType: string): WindowRegistryEntry | null {
  if (windowType in WINDOW_REGISTRY) {
    return WINDOW_REGISTRY[windowType as WindowType];
  }

  return null;
}

export function useWindowRegistry(): {
  registry: Record<WindowType, WindowRegistryEntry>;
  getRegistryEntry: (windowType: string) => WindowRegistryEntry | null;
} {
  return {
    registry: WINDOW_REGISTRY,
    getRegistryEntry,
  };
}
