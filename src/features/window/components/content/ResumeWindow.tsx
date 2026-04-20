import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

export default function ResumeWindow({}: WindowContentProps): JSX.Element {
  return (
    <div className="space-y-3 p-3 text-[12px] leading-relaxed text-[#10233f]">
      <h2 className="text-[14px] font-bold">Resume</h2>
      <p>Download the latest resume and review core strengths.</p>
      <ul className="list-inside list-disc space-y-1">
        <li>Node.js + TypeScript backend architecture</li>
        <li>Cloud-native delivery and CI/CD workflows</li>
        <li>Performance and reliability for university-scale systems</li>
      </ul>
      <a
        className="inline-block text-[#174cbe] underline"
        href="https://example.com/resume.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Open PDF Resume
      </a>
    </div>
  );
}
