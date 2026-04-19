import type { JSX } from "react";

interface Props {
  imagePath?: string;
}

export default function Wallpaper({ imagePath }: Props): JSX.Element {
  const style = {
    backgroundColor: "var(--wallpaper-base)",
    backgroundImage: `url(${imagePath})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  } as const;

  return (
    <div
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={style}
    />
  );
}
