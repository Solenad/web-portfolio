import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

export default function MinesweeperWindow({}: WindowContentProps): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#c0c0c0] p-3 text-[12px] text-[#10233f]">
      <h2 className="text-[14px] font-bold">Minesweeper</h2>
      <p>Game window placeholder. Fixed-size mode enabled.</p>
    </div>
  );
}
