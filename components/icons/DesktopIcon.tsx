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
  const [imageFailed, setImageFailed] = useState(false);

  const handleClick = (): void => {
    setIsSelected(true);
  };

  const handleDoubleClick = (): void => {
    if (onOpen) {
      onOpen();
    }
  };

  const hasImage = Boolean(iconPath) && !imageFailed;

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`flex w-[96px] flex-col items-center gap-1 p-1 text-[11px] focus:outline-none ${
        isSelected ? "winxp-icon-selected" : "bg-transparent"
      }`}
      aria-label={label}
    >
      <span className="relative flex h-12 w-12 items-center justify-center">
        {hasImage ? (
          <Image
            src={iconPath ?? ""}
            alt={`${label} icon`}
            width={48}
            height={48}
            className="winxp-icon h-12 w-12"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="winxp-icon flex h-12 w-12 items-center justify-center bg-gradient-to-b from-[#6ea9ff] to-[#235cdb] text-[10px] font-bold text-white">
            {iconName.slice(0, 3).toUpperCase()}
          </span>
        )}
      </span>
      <span className="winxp-icon-label line-clamp-2 text-center leading-[1.1] break-words">
        {label}
      </span>
    </button>
  );
}
