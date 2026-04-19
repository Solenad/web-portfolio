"use client";

import type { JSX } from "react";

interface Props {
  onClick: () => void;
}

export default function StartButton({ onClick }: Props): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="winxp-button group flex h-[26px] items-center gap-1.5 rounded-md bg-gradient-to-b from-[#419e38] via-[#4a7c2a] to-[#2d5a1a] px-2.5 py-[2px] text-[11px] font-bold text-white transition-all hover:brightness-110 active:translate-y-px active:shadow-inner"
      aria-label="Open Start menu"
    >
      {/* Windows XP Flag Logo - CSS-generated with 4 quadrants */}
      <span className="relative inline-flex h-[14px] w-[14px] flex-col" aria-hidden="true">
        {/* Top-left: Red */}
        <span className="absolute left-0 top-0 h-[7px] w-[7px] rounded-tl-[2px] bg-gradient-to-br from-[#ff6b6b] to-[#e53935]" />
        {/* Top-right: Green */}
        <span className="absolute right-0 top-0 h-[7px] w-[7px] rounded-tr-[2px] bg-gradient-to-bl from-[#81c784] to-[#4caf50]" />
        {/* Bottom-left: Blue */}
        <span className="absolute bottom-0 left-0 h-[7px] w-[7px] rounded-bl-[2px] bg-gradient-to-tr from-[#64b5f6] to-[#2196f3]" />
        {/* Bottom-right: Yellow */}
        <span className="absolute bottom-0 right-0 h-[7px] w-[7px] rounded-br-[2px] bg-gradient-to-tl from-[#ffd54f] to-[#ffc107]" />
      </span>
      <span>Start</span>
    </button>
  );
}
