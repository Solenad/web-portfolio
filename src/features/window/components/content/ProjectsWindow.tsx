import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

export default function ProjectsWindow({}: WindowContentProps): JSX.Element {
  return (
    <div className="space-y-3 p-3 text-[12px] leading-relaxed text-[#10233f]">
      <h2 className="text-[14px] font-bold">Projects</h2>
      <p>Selected systems and products built for university-scale and organizational workflows.</p>
      <ul className="list-inside list-disc space-y-1">
        <li>
          <a
            className="text-[#174cbe] underline"
            href="https://github.com/Solenad"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Portfolio
          </a>
        </li>
        <li>
          <a
            className="text-[#174cbe] underline"
            href="https://www.linkedin.com/in/rohann-dizon"
            target="_blank"
            rel="noreferrer"
          >
            Professional Case Studies
          </a>
        </li>
      </ul>
    </div>
  );
}
