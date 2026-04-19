import type { JSX } from "react";

interface Props {
  onClick: () => void;
}

export default function StartButton({ onClick }: Props): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="win98-raised flex h-[22px] items-center gap-1 bg-[#c0c0c0] px-[6px] py-[2px] text-[11px] font-bold text-black active:translate-x-px active:translate-y-px"
      aria-label="Open Start menu"
    >
      <span className="inline-block h-3 w-3 bg-[#00a000]" aria-hidden="true" />
      <span>Start</span>
    </button>
  );
}
