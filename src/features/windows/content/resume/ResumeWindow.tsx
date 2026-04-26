"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

const ResumePdfViewer = dynamic(
  () => import("@/features/windows/content/resume/ResumePdfViewer"),
  {
    ssr: false,
    loading: () => <p className="window-pdf-loading">Loading resume PDF...</p>,
  },
);

const RESUME_PDF_PATH = "/assets/resume.pdf";
const PAGE_HORIZONTAL_PADDING = 24;

function clampPage(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function ResumeWindow({
  currentPage,
  currentZoom,
  totalPages,
  isFitWidth,
  onTotalPagesChange,
}: WindowContentProps): JSX.Element {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  const resolvedPage = currentPage ?? 1;
  const resolvedZoom = currentZoom ?? 1;

  const updateContainerWidth = useCallback((): void => {
    if (pdfContainerRef.current === null) {
      return;
    }

    const nextWidth = Math.max(
      240,
      pdfContainerRef.current.clientWidth - PAGE_HORIZONTAL_PADDING,
    );

    setContainerWidth(nextWidth);
  }, []);

  useEffect(() => {
    updateContainerWidth();

    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("resize", updateContainerWidth);

    return (): void => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, [updateContainerWidth]);

  const pageWidth = useMemo((): number | undefined => {
    if (!isFitWidth) {
      return undefined;
    }

    return containerWidth > 0 ? containerWidth : undefined;
  }, [containerWidth, isFitWidth]);

  const pageScale = useMemo((): number | undefined => {
    if (isFitWidth) {
      return undefined;
    }

    return resolvedZoom;
  }, [isFitWidth, resolvedZoom]);

  const handleLoadSuccess = useCallback(
    (numPages: number): void => {
      setLoadError(null);
      onTotalPagesChange?.(numPages);
    },
    [onTotalPagesChange],
  );

  const handleLoadError = useCallback(
    (errorMessage: string): void => {
      setLoadError(errorMessage);
      onTotalPagesChange?.(0);
    },
    [onTotalPagesChange],
  );

  const boundedPage = clampPage(resolvedPage, 1, Math.max(1, totalPages ?? 1));

  return (
    <div ref={pdfContainerRef} className="window-pdf-viewer">
      {loadError !== null ? (
        <div className="window-pdf-error" role="alert">
          <h2 className="text-[14px] font-bold">Resume PDF not available</h2>
          <p>Unable to load `{RESUME_PDF_PATH}`.</p>
          <p>Place `resume.pdf` in `public/assets/` and reload the page.</p>
          <p className="text-[11px] text-[#4b5a74]">
            Technical details: {loadError}
          </p>
        </div>
      ) : null}

      <div className="window-pdf-scroll-region">
        <ResumePdfViewer
          file={RESUME_PDF_PATH}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={handleLoadError}
          pageNumber={boundedPage}
          pageWidth={pageWidth}
          pageScale={pageScale}
        />
      </div>
    </div>
  );
}