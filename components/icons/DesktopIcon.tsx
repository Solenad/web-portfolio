"use client";

import Image from "next/image";
import { useState } from "react";
import type { JSX } from "react";

interface Props {
  label: string;
  iconName: string;
  iconPath?: string;
  onOpen?: () => void;
}

export default function DesktopIcon({
  label,
  iconName,
  iconPath,
  onOpen,
}: Props): JSX.Element {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = (): void => {
    setIsSelected(true);
  };

  const handleDoubleClick = (): void => {
    if (onOpen) {
      onOpen();
    }
  };

  const hasImage = Boolean(iconPath);

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`flex w-[80px] flex-col items-center gap-1 p-1 text-[11px] focus:outline-none ${
        isSelected ? "bg-[#000080]/35" : "bg-transparent"
      }`}
      aria-label={label}
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        {hasImage ? (
          <Image
            src={iconPath ?? ""}
            alt={`${label} icon`}
            width={32}
            height={32}
            className="h-8 w-8"
          />
        ) : (
          <span className="win98-raised flex h-8 w-8 items-center justify-center bg-[#c0c0c0] text-[8px] font-bold text-black">
            {iconName.slice(0, 3).toUpperCase()}
          </span>
        )}
      </span>
      <span className="win98-icon-label line-clamp-2 text-center leading-[1.1] break-words">
        {label}
      </span>
    </button>
  );
}
