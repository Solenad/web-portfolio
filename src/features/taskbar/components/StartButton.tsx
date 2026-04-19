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
      className="h-[30px] w-[95px] cursor-pointer overflow-hidden bg-[url('/assets/xp-icons/start-button.webp')] bg-contain bg-center bg-no-repeat hover:bg-[url('/assets/xp-icons/start-button-hover.webp')] active:bg-[url('/assets/xp-icons/start-button-clicked.webp')] focus:outline-none"
      aria-label="Open Start menu"
    >
      <span className="sr-only">Start</span>
    </button>
  );
}
