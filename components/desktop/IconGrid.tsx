import type { JSX } from "react";

import DesktopIcon from "@/components/icons/DesktopIcon";
import type { DesktopIconItem } from "@/types/desktop.types";

interface Props {
  icons: DesktopIconItem[];
}

export default function IconGrid({ icons }: Props): JSX.Element {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,80px)] justify-start gap-y-0 p-5 [grid-auto-rows:80px] [column-gap:0] [row-gap:0]">
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          label={icon.label}
          iconName={icon.iconName}
          iconPath={icon.iconPath}
        />
      ))}
    </div>
  );
}
