"use client";

import type { JSX } from "react";

import DesktopIcon from "@/features/desktop/components/DesktopIcon";
import type { DesktopIconItem } from "@/types/desktop.types";

interface Props {
  icons: DesktopIconItem[];
  selectedId: string | null;
  onSelectIcon: (iconId: string) => void;
  onOpenIcon: (icon: DesktopIconItem) => void;
}

export default function IconGrid({
  icons,
  selectedId,
  onSelectIcon,
  onOpenIcon,
}: Props): JSX.Element {
  return (
    <div className="grid h-full auto-cols-[104px] grid-flow-col grid-rows-[repeat(6,112px)] justify-start gap-2 overflow-x-auto overflow-y-hidden p-5">
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          label={icon.label}
          iconName={icon.iconName}
          iconPath={icon.iconPath}
          isSelected={selectedId === icon.id}
          onSelect={() => onSelectIcon(icon.id)}
          onOpen={() => onOpenIcon(icon)}
          windowId={icon.windowId}
          windowType={icon.windowType}
        />
      ))}
    </div>
  );
}
