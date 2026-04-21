import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

export default function DoomWindow({}: WindowContentProps): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#120a08] p-3 text-[12px] text-[#f5e9dd]">
      <h2 className="text-[14px] font-bold tracking-wide">DOOM</h2>
      <p>Retro game placeholder. Plug in playable embed later.</p>
    </div>
  );
}
