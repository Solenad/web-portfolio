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
      className={`flex w-[104px] flex-col items-center gap-1.5 p-1 text-[11px] focus:outline-none ${isSelected ? "winxp-icon-selected" : "bg-transparent"
        }`}
      aria-label={label}
    >
      <span className="relative flex h-[72px] w-[72px] items-center justify-center">
        {hasImage ? (
          <Image
            src={iconPath ?? ""}
            alt={`${label} icon`}
            width={72}
            height={72}
            className="winxp-icon h-[72px] w-[72px]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="winxp-icon flex h-[72px] w-[72px] items-center justify-center rounded-[4px] bg-gradient-to-b from-[#6ea9ff] to-[#235cdb] text-[12px] font-bold text-white">
            {iconName.slice(0, 3).toUpperCase()}
          </span>
        )}
      </span>
      <span className="winxp-icon-label w-[72px] line-clamp-2 text-center leading-[1.15] break-words [font-family:Tahoma,'Trebuchet_MS',Verdana,sans-serif]">
        {label}
      </span>
    </button>
  );
}
