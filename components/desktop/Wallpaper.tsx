import type { JSX } from "react";

interface Props {
  customBackground?: string;
  showPattern?: boolean;
}

export default function Wallpaper({
  customBackground,
  showPattern = false,
}: Props): JSX.Element {
  const style = customBackground
    ? { backgroundImage: customBackground }
    : { backgroundImage: "var(--wallpaper-gradient)" };

  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full bg-[var(--wallpaper-base)]"
      style={style}
    >
      {showPattern ? (
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)",
          }}
        />
      ) : null}
    </div>
  );
}
