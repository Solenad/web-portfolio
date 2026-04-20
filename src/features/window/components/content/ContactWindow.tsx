import type { JSX } from "react";

import type { WindowContentProps } from "@/types/window.types";

export default function ContactWindow({}: WindowContentProps): JSX.Element {
  return (
    <div className="space-y-3 p-3 text-[12px] leading-relaxed text-[#10233f]">
      <h2 className="text-[14px] font-bold">Contact</h2>
      <p>Open to collaborations on backend-heavy full-stack systems and tooling work.</p>
      <ul className="list-inside list-disc space-y-1">
        <li>
          Email: <a className="text-[#174cbe] underline" href="mailto:rohann@example.com">rohann@example.com</a>
        </li>
        <li>
          LinkedIn: <a className="text-[#174cbe] underline" href="https://www.linkedin.com/in/rohann-dizon" target="_blank" rel="noreferrer">/in/rohann-dizon</a>
        </li>
      </ul>
    </div>
  );
}
