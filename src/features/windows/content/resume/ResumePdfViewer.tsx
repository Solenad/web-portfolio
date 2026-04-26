"use client";

import { Document, Page, pdfjs } from "react-pdf";
import type { JSX } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface Props {
  file: string;
  pageNumber: number;
  pageWidth: number | undefined;
  pageScale: number | undefined;
  onLoadSuccess: (numPages: number) => void;
  onLoadError: (errorMessage: string) => void;
}

export default function ResumePdfViewer({
  file,
  pageNumber,
  pageWidth,
  pageScale,
  onLoadSuccess,
  onLoadError,
}: Props): JSX.Element {
  return (
    <Document
      file={file}
      loading={<p className="window-pdf-loading">Loading resume PDF...</p>}
      onLoadSuccess={({ numPages }) => {
        onLoadSuccess(numPages);
      }}
      onLoadError={(error: Error) => {
        onLoadError(error.message);
      }}
      error={
        <p className="window-pdf-loading">
          Resume PDF is missing. Add `public/assets/resume.pdf`.
        </p>
      }
    >
      <Page
        pageNumber={pageNumber}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        width={pageWidth}
        scale={pageScale}
      />
    </Document>
  );
}