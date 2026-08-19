"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import type { WindowContentProps } from "@/types/window.types";
import SystemInfoPanel from "./components/SystemInfoPanel";

interface PhotoProps {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
  variant?: "portrait" | "work" | "hobby";
}

interface SelectedImage {
  src: string;
  alt: string;
}

function Photo({
  src,
  alt,
  label,
  className = "",
  variant = "hobby",
  onClick,
}: PhotoProps & { onClick?: (image: SelectedImage) => void }) {
  const frameClass =
    variant === "portrait"
      ? "winxp-raised border-4 border-white p-2 scale-110 z-10 shadow-xl hover:scale-120 transition-transform duration-300"
      : "winxp-raised border-2 border-white p-1 shadow-md hover:scale-105 transition-transform duration-300";

  const isInteractive = src !== undefined && src !== "" && onClick !== undefined;

  const handleClick = (): void => {
    if (isInteractive && src !== undefined && onClick !== undefined) {
      onClick({ src, alt: alt ?? label ?? "Image" });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={isInteractive ? `View ${alt ?? label ?? "image"}` : undefined}
      className={`${frameClass} ${isInteractive ? "group relative cursor-pointer" : ""} bg-white flex flex-col items-center justify-center bg-[#f0f0f0] ${className}`}
    >
      {src ? (
        <img src={src} alt={alt || ""} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center italic text-[#10233f]/40 text-center p-2 text-[10px]">
          {variant.toUpperCase()} PHOTO
        </div>
      )}
      {isInteractive && (
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
          <span className="px-3 py-1 rounded-sm bg-[#ece9d8] text-[#10233f] text-xs font-bold border border-white shadow-[1px_1px_0_rgba(0,0,0,0.35)]">
            [ Click ]
          </span>
        </span>
      )}
      {label && (
        <span className="mt-1 text-[9px] font-medium text-[#10233f]/60 uppercase tracking-wider">
          {label}
        </span>
      )}
    </button>
  );
}

interface AboutSectionProps {
  title: string;
  children: React.ReactNode;
  imageContent: React.ReactNode;
  reverse?: boolean;
  imageWide?: boolean;
}

function AboutSection({
  title,
  children,
  imageContent,
  reverse = false,
  imageWide = false,
}: AboutSectionProps) {
  const textOrder = reverse ? "order-1" : "order-2";
  const imageOrder = reverse ? "order-2" : "order-1";

  const textWidth = imageWide ? "w-[45%]" : "w-[55%]";
  const imageWidth = imageWide ? "w-[55%]" : "w-[45%]";

  return (
    <section className="flex gap-12 py-16 first:pt-8 last:pb-24">
      <div className={`flex flex-col gap-6 ${textWidth} ${textOrder}`}>
        <h3 className="text-2xl font-bold flex items-center gap-3 text-[#10233f]">
          <span className="w-3 h-3 rounded-sm bg-[#235cdb] rotate-45 shadow-[1px_1px_0_rgba(0,0,0,0.2)]" />
          {title}
        </h3>
        <div className="winxp-inset bg-[#eef3fb] p-8 rounded-sm leading-relaxed text-[#10233f] shadow-inner backdrop-blur-sm">
          {children}
        </div>
      </div>
      <div
        className={`flex items-center justify-center ${imageWidth} ${imageOrder}`}
      >
        {imageContent}
      </div>
    </section>
  );
}

const techBadges = [
  { icon: "⚛", label: "React", url: "https://react.dev", color: "#2D9CD9" },
  { icon: "▲", label: "Next.js", url: "https://nextjs.org", color: "#000000" },
  {
    icon: "TS",
    label: "TypeScript",
    url: "https://www.typescriptlang.org",
    color: "#3178C6",
  },
  {
    icon: "🐘",
    label: "PostgreSQL",
    url: "https://www.postgresql.org",
    color: "#4169E1",
  },
  { icon: "🟢", label: "Node.js", url: "https://nodejs.org", color: "#339933" },
  {
    icon: "JS",
    label: "JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    color: "#C4A600",
  },
];

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AboutWindow({
  isMobile,
}: WindowContentProps): JSX.Element {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  useEffect(() => {
    if (selectedImage === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <div className="h-full relative flex flex-col bg-[#eef3fb] selection:bg-[#235cdb] selection:text-white">
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {/* Small subtle header */}
        <div className="px-12 pt-10 pb-6 border-b border-[#aca899]/20 bg-gradient-to-b from-white/30 to-transparent">
          <div className="flex items-start justify-between gap-8">
            <div>
              <h1 className="text-4xl font-black text-[#10233f] tracking-tight">
                Rohann Gabriel D. Dizon <span className="text-xl font-medium ml-1 text-[#4a7c2a]">Roe</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-[#4a7c2a] text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter">
                  Online
                </span>
                <p className="text-sm text-[#10233f]/60 font-medium">
                  Full Stack Developer
                </p>
              </div>
              <p className="text-[11px] italic text-[#10233f]/50 mt-1">
                Manila, Philippines
              </p>
              <p className="text-[11px] text-[#10233f]/60 mt-0.5">
                3rd Year Computer Science @ De La Salle University
              </p>
              <p className="text-[11px] text-[#10233f]/60">
                Digital Transformation Intern @ Philip Morris International
              </p>
              <p className="text-[11px] text-[#10233f]/60">
                Software Developer Intern @ Siklab
              </p>
              <p className="text-[11px] text-[#10233f]/60">
                Tech Lead of Research and Development @ La Salle Computer Society
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-shrink-0">
              {techBadges.map((badge) => (
                <a
                  key={badge.label}
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-sm border text-[11px] font-semibold transition-transform duration-150 hover:scale-110 whitespace-nowrap"
                  style={{
                    borderColor: badge.color,
                    color: badge.color,
                    backgroundColor: hexToRgba(badge.color, 0.1),
                  }}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-12">
          {/* Section 1: About Me */}
          <AboutSection
            title="About Me"
            imageWide={true}
            imageContent={
              <div className="relative w-full max-w-sm flex items-center justify-center">
                <Photo
                  variant="portrait"
                  className="w-84 h-100 rotate-[-1deg]"
                  src="/assets/about-me/roe1.webp"
                  alt="Roe Portrait 1"
                  onClick={setSelectedImage}
                />
                <Photo
                  variant="hobby"
                  className="absolute -bottom-10 -right-10 w-40 h-40 rotate-[4deg] hidden md:flex z-20"
                  src="/assets/about-me/roe2.webp"
                  alt="Roe Portrait 2"
                  onClick={setSelectedImage}
                />
              </div>
            }
          >
            <p>
              Hi! I&apos;m <span className="font-bold">Roe</span>, a 3rd year
              computer science undergraduate in DLSU. I&apos;ve completed
              internships as a Software Developer Intern at Siklab and as a
              Digital Transformation Intern at Philip Morris International, and
              I&apos;ve retired as the Tech Lead for R&amp;D in La Salle
              Computer Society.
            </p>
            <p className="mt-3 ">
              I do love programming. The mere act of producing wonders akin to
              magic just through lines of code pleases me. On top of that, the
              satisfaction from an accomplished project or a solved problem is
              dopamine for me. That&apos;s why I think that I&apos;ll be
              developing applications for as long as I live.
            </p>

            <p className="mt-3 text-[#10233f]/80 italic">
              PS. Thanks for sticking around my website!
            </p>
          </AboutSection>

          {/* Section 2: Professional Progress */}
          <AboutSection
            title="Professional Progress"
            reverse={true}
            imageContent={
              <div className="relative w-full max-w-sm grid grid-cols-2 gap-4 p-4">
                <Photo
                  variant="work"
                  label="PMFTC Intern"
                  className="w-full aspect-[4/5] rotate-[2deg]"
                  src="/assets/about-me/professional_roe.jpg"
                  alt="Roe at PMFTC Office"
                  onClick={setSelectedImage}
                />
                <Photo
                  variant="work"
                  label="Team Collaboration"
                  className="w-full aspect-[4/5] rotate-[-2deg] mt-8"
                  src="/assets/about-me/pmftc-team.webp"
                  alt="Roe with team members"
                  onClick={setSelectedImage}
                />
              </div>
            }
          >
            <p>
              I started off as a software developer for La Salle Computer
              Society&apos;s Research and Development Committee, building apps that
              service the org — including a website used by the entire DLSU,
              catering over 30,000 students. After a year, I stepped up as Tech
              Lead, guiding 22 student developers through 17 projects. I loved the
              community we built, and I hope my committee learned from me just as I
              learned from them.
            </p>
            <p className="mt-4">
              Not long afterwards, I took my first dips into the corporate world as
              a Software Developer Intern at Siklab, shipping 4 websites with 4-6k
              edge requests daily each. Then I joined Philip Morris Fortune Tobacco
              Inc. in Taguig City as a Digital Transformation Intern, getting my
              hands dirty with digitizing the company&apos;s processes.
            </p>
            <p className="mt-4">
              Right now, I&apos;m done with my internships and ready to graduate.
              After I graduate, I hope to work immediately.
            </p>
          </AboutSection>

          {/* Section 3: Interests & Hobbies */}
          <AboutSection
            title="Interests & Hobbies"
            imageWide={true}
            imageContent={
              <div className="relative w-full max-w-sm flex flex-wrap gap-4 justify-center items-center">
                <Photo variant="hobby" className="w-40 h-40 rotate-[-3deg]" />
                <Photo
                  variant="hobby"
                  className="w-36 h-36 rotate-[2deg] -mt-4"
                />
                <Photo
                  variant="hobby"
                  className="absolute -bottom-8 left-4 w-28 h-28 rotate-[6deg] opacity-60 hidden lg:flex"
                />
              </div>
            }
          >
            <p>
              [Placeholder: Personal interests, hobbies, and what I do for fun.]
            </p>
            <p className="mt-4 text-[#10233f]/70">
              [Anything else that makes me, me.]
            </p>
          </AboutSection>
        </div>

        {/* Continuous footer/spacer */}
        <div className="h-32 bg-gradient-to-t from-white/10 to-transparent" />

        {/* System Info Panel */}
        <div className="px-12 pb-8">
          <SystemInfoPanel
            os="Windows"
            kernel="WIN32_NT 10.0.268"
            shell="PowerShell"
            wm="GlazeWM"
            editor="Neovim"
            terminal="Wezterm"
            theme="Catppuccin Macchiato"
            agents="Opencode + Customized Openspec"
            disk="195.12 / 200 GiB"
          />
        </div>
      </div>

      {selectedImage !== null && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedImage.alt} preview`}
        >
          <div
            className="winxp-raised bg-[#ece9d8] p-2 max-w-[92%] max-h-[92%] flex flex-col gap-2 shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-6 px-1">
              <span className="text-[11px] font-bold text-[#10233f] truncate">
                {selectedImage.alt}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="px-2 py-0.5 rounded-sm bg-[#ece9d8] border border-[#aca899] text-[11px] font-bold text-[#10233f] shadow-[1px_1px_0_rgba(0,0,0,0.2)] hover:bg-[#f7f7f2] transition-colors"
                aria-label="Close image preview"
              >
                ✕
              </button>
            </div>
            <div className="winxp-inset bg-white overflow-auto">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
