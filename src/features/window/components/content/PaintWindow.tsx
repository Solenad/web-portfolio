import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

export default function PaintWindow({}: WindowContentProps): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#d4d0c8] p-3 text-[12px] text-[#10233f]">
      <h2 className="text-[14px] font-bold">Paint</h2>
      <p>Canvas placeholder. Resizable window enabled.</p>
    </div>
  );
}
