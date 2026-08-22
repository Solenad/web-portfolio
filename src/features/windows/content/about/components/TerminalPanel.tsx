import type { JSX } from "react";

interface TerminalPanelProps {
  title: string;
  children: React.ReactNode;
  bodyClassName?: string;
}

export default function TerminalPanel({
  title,
  children,
  bodyClassName = "p-8",
}: TerminalPanelProps): JSX.Element {
  return (
    <div className="bg-[rgba(36,39,58,0.7)] backdrop-blur-md border border-[rgba(73,77,100,0.6)] rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="relative flex items-center justify-center py-2.5 bg-[rgba(64,64,102,0.75)] border-b border-[rgba(73,77,100,0.6)]">
        <span className="absolute left-3 flex items-center gap-1.5" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#ed8796] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
          <span className="w-3 h-3 rounded-full bg-[#eed49f] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
          <span className="w-3 h-3 rounded-full bg-[#a6da95] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
        </span>
        <span className="text-xs font-bold text-[var(--ctp-subtext1)] truncate px-10">
          {title}
        </span>
      </div>
      <div className={`${bodyClassName} leading-relaxed text-[var(--ctp-text)]`}>
        {children}
      </div>
    </div>
  );
}