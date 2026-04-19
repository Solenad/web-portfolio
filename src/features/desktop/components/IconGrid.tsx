import type { JSX } from "react";

import DesktopIcon from "@/features/desktop/components/DesktopIcon";
import type { DesktopIconItem } from "@/types/desktop.types";

interface Props {
  icons: DesktopIconItem[];
}

export default function IconGrid({ icons }: Props): JSX.Element {
  return (
    <div className="grid h-full auto-cols-[104px] grid-flow-col grid-rows-[repeat(6,112px)] justify-start gap-2 overflow-x-auto overflow-y-hidden p-5">
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
