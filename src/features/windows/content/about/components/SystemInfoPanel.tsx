import type { JSX } from "react";

interface SystemInfoItem {
  label: string;
  value: string;
  accent?: boolean;
}

interface SystemInfoPanelProps {
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

function InfoRow({ label, value, accent = false }: SystemInfoItem): JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          accent ? "bg-[#235cdb]" : "bg-[#4a7c2a]"
        }`}
      />
      <span className="text-[10px] text-[#235cdb] font-semibold uppercase tracking-tight min-w-[52px]">
        {label}
      </span>
      <span className="text-[10px] text-[#10233f]/80 truncate">{value}</span>
    </div>
  );
}

export default function SystemInfoPanel({
  os,
  kernel,
  shell,
  wm,
  editor,
  terminal,
  theme,
  agents,
  disk,
}: SystemInfoPanelProps): JSX.Element {
  const leftColumn: SystemInfoItem[] = [
    { label: "OS", value: os },
    { label: "Kernel", value: kernel },
    { label: "Shell", value: shell },
    { label: "WM", value: wm },
    { label: "Editor", value: editor },
  ];

  const rightColumn: SystemInfoItem[] = [
    { label: "Terminal", value: terminal, accent: true },
    { label: "Theme", value: theme, accent: true },
    { label: "Agents", value: agents, accent: true },
    { label: "Disk", value: disk, accent: true },
  ];

  return (
    <div className="winxp-raised bg-[#ece9d8] p-3 rounded-sm">
      <div className="text-[9px] font-bold text-[#10233f]/60 uppercase tracking-wider mb-2 border-b border-[#aca899]/30 pb-1">
        System Info
      </div>
      <div className="flex gap-6">
        <div className="flex flex-col gap-1">
          {leftColumn.map((item) => (
            <InfoRow key={item.label} {...item} />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {rightColumn.map((item) => (
            <InfoRow key={item.label} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}