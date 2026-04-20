import type { WindowType } from "@/types/window.types";

export interface DesktopIconItem {
  id: string;
  label: string;
  iconName: string;
  iconPath?: string;
  windowId?: string;
  windowType?: WindowType;
}
