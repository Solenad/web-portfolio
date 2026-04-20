import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

export default function AboutWindow({ isMobile }: WindowContentProps): JSX.Element {
  return (
    <div className="space-y-3 p-3 text-[12px] leading-relaxed text-[#10233f]">
      <h2 className="text-[14px] font-bold">Rohann Dizon</h2>
      <p>
        Backend-first full-stack developer focused on resilient systems,
        thoughtful DX, and authentic user experiences.
      </p>
      <p>
        This portfolio recreates the Windows XP desktop metaphor where each icon
        opens a distinct app-like window.
      </p>
      <p>
        {isMobile
          ? "Mobile fallback is active. Drag/resize is intentionally disabled on touch-first layouts."
          : "Desktop mode supports drag, resize, focus stacking, and taskbar restore interactions."}
      </p>
    </div>
  );
}
