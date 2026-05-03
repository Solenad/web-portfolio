"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, JSX } from "react";

import DesktopIcon from "@/features/desktop/components/DesktopIcon";
import type { DesktopIconItem } from "@/types/desktop.types";

const ROW_HEIGHT = 112;
const COLUMN_WIDTH = 104;
const COLUMN_GAP = 8;
const HORIZONTAL_PADDING = 40;
const EDGE_BUFFER = 2;
const VERTICAL_PADDING = 40;
const DEFAULT_ROWS = 6;
const RESIZE_DEBOUNCE_MS = 100;

interface Props {
  icons: DesktopIconItem[];
  selectedId: string | null;
  onSelectIcon: (iconId: string) => void;
  onOpenIcon: (icon: DesktopIconItem) => void;
}

export default function IconGrid({
  icons,
  selectedId,
  onSelectIcon,
  onOpenIcon,
}: Props): JSX.Element {
  const gridRef = useRef<HTMLDivElement>(null);
  const [rowCount, setRowCount] = useState<number>(DEFAULT_ROWS);

  const recalculateRows = useCallback((): void => {
    if (gridRef.current === null) {
      return;
    }

    const availableHeight = gridRef.current.clientHeight;
    const availableWidth = gridRef.current.clientWidth;
    const usableWidth = Math.max(0, availableWidth - HORIZONTAL_PADDING);

    const usableHeight = Math.max(
      0,
      availableHeight - VERTICAL_PADDING - EDGE_BUFFER,
    );
    const heightRows = Math.max(1, Math.floor(usableHeight / ROW_HEIGHT));
    const bufferedWidth = Math.max(0, usableWidth - EDGE_BUFFER);
    const maxCols = Math.max(
      1,
      Math.floor(
        (bufferedWidth + COLUMN_GAP) / (COLUMN_WIDTH + COLUMN_GAP),
      ),
    );
    const minRowsForWidth = Math.max(1, Math.ceil(icons.length / maxCols));
    setRowCount(Math.max(heightRows, minRowsForWidth));
  }, [icons.length]);

  useEffect(() => {
    recalculateRows();

    const gridElement = gridRef.current;
    if (gridElement === null) {
      return;
    }

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new ResizeObserver(() => {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        recalculateRows();
      }, RESIZE_DEBOUNCE_MS);
    });

    observer.observe(gridElement);

    return () => {
      observer.disconnect();

      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }
    };
  }, [recalculateRows]);

  const gridStyle = {
    gridTemplateRows: `repeat(${rowCount}, ${ROW_HEIGHT}px)`,
  } as CSSProperties;

  return (
    <div
      ref={gridRef}
      className="grid h-full auto-cols-[104px] grid-flow-col justify-start gap-2 overflow-x-hidden overflow-y-auto p-5"
      style={gridStyle}
    >
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          label={icon.label}
          iconName={icon.iconName}
          iconPath={icon.iconPath}
          isSelected={selectedId === icon.id}
          onSelect={() => onSelectIcon(icon.id)}
          onOpen={() => onOpenIcon(icon)}
          windowId={icon.windowId}
          windowType={icon.windowType}
        />
      ))}
    </div>
  );
}
