import type { JSX } from "react";

interface FastfetchPanelProps {
  os: string;
  kernel: string;
  shell: string;
  wm: string;
  editor: string;
  terminal: string;
  theme: string;
  agents: string;
  disk: string;
}

const LABEL_WIDTH_CLASS = "w-[88px]";

function InfoRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-baseline gap-2 whitespace-pre">
      <span
        className={`text-[11px] text-[var(--ctp-blue)] font-semibold flex-shrink-0 ${LABEL_WIDTH_CLASS}`}
      >
        {label}:
      </span>
      <span className="text-[11px] text-[var(--ctp-text)] truncate">{value}</span>
    </div>
  );
}

export default function FastfetchPanel({
  os,
  kernel,
  shell,
  wm,
  editor,
  terminal,
  theme,
  agents,
  disk,
}: FastfetchPanelProps): JSX.Element {
  const infoRows = [
    { label: "OS", value: os },
    { label: "Kernel", value: kernel },
    { label: "Shell", value: shell },
    { label: "WM", value: wm },
    { label: "Editor", value: editor },
    { label: "Terminal", value: terminal },
    { label: "Theme", value: theme },
    { label: "Agents", value: agents },
    { label: "Disk", value: disk },
  ];

  return (
    <div className="bg-[rgba(36,39,58,0.7)] backdrop-blur-md border border-[var(--ctp-surface2)]/60 rounded-lg p-6 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex flex-col items-center md:items-start gap-1 text-left whitespace-pre">
          <div className="text-[13px] leading-snug text-[var(--ctp-mauve)]">
            {" /\_/\\"}
          </div>
          <div className="text-[13px] leading-snug text-[var(--ctp-mauve)]">
            {"( o.o )"}
          </div>
          <div className="text-[13px] leading-snug text-[var(--ctp-mauve)]">
            {" > ^ <"}
          </div>
          <div className="mt-2 text-sm font-bold text-[var(--ctp-blue)]">
            roe@macchiato
          </div>
          <div className="text-[11px] text-[var(--ctp-green)]">
            {"~ $ "}fastfetch
          </div>
        </div>
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {infoRows.map((row) => (
            <InfoRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    </div>
  );
}