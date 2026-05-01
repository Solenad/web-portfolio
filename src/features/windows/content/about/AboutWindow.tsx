import type { JSX } from "react";
import type { WindowContentProps } from "@/types/window.types";

interface PhotoProps {
  label?: string;
  className?: string;
  variant?: "portrait" | "work" | "hobby";
}

function Photo({ label, className = "", variant = "hobby" }: PhotoProps) {
  const frameClass = variant === "portrait" 
    ? "winxp-raised border-4 border-white p-2 scale-110 z-10 shadow-xl" 
    : "winxp-raised border-2 border-white p-1 shadow-md hover:scale-105 transition-transform duration-300";

  return (
    <div className={`${frameClass} bg-white flex flex-col items-center justify-center bg-[#f0f0f0] ${className}`}>
      <div className="w-full h-full flex items-center justify-center italic text-[#10233f]/40 text-center p-2 text-[10px]">
        {variant.toUpperCase()} PHOTO
      </div>
      {label && (
        <span className="mt-1 text-[9px] font-medium text-[#10233f]/60 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}

interface AboutSectionProps {
  title: string;
  children: React.ReactNode;
  imageContent: React.ReactNode;
  reverse?: boolean;
  imageWide?: boolean;
}

function AboutSection({ title, children, imageContent, reverse = false, imageWide = false }: AboutSectionProps) {
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
      <div className={`flex items-center justify-center ${imageWidth} ${imageOrder}`}>
        {imageContent}
      </div>
    </section>
  );
}

export default function AboutWindow({ isMobile }: WindowContentProps): JSX.Element {
  return (
    <div className="h-full overflow-y-auto bg-[#ece9d8] custom-scrollbar selection:bg-[#235cdb] selection:text-white">
      {/* Small subtle header */}
      <div className="px-12 pt-10 pb-6 border-b border-[#aca899]/20 bg-gradient-to-b from-white/30 to-transparent">
        <h1 className="text-4xl font-black text-[#10233f] tracking-tight">Rohann Dizon</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-0.5 bg-[#4a7c2a] text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter">Online</span>
          <p className="text-sm text-[#10233f]/60 font-medium">Full Stack Developer & Retro Enthusiast</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-12">
        {/* Section 1: About Me */}
        <AboutSection 
          title="About Me" 
          imageWide={true}
          imageContent={
            <div className="relative w-full max-w-sm flex items-center justify-center">
              <Photo variant="portrait" className="w-64 h-80 rotate-[-1deg]" />
              <Photo variant="hobby" className="absolute -bottom-10 -right-4 w-32 h-32 rotate-[4deg] hidden md:flex" />
            </div>
          }
        >
          <p className="text-lg">
            [Placeholder: Personal bio goes here. Warm, conversational tone. Focus on background and personality.]
          </p>
          <p className="mt-4 text-[#10233f]/80 italic">
            "Building high-scale university platforms with a focus on backend excellence and nostalgic interfaces."
          </p>
        </AboutSection>

        {/* Section 2: Professional Progress */}
        <AboutSection 
          title="Professional Progress" 
          reverse={true}
          imageContent={
            <div className="relative w-full max-w-sm grid grid-cols-2 gap-4 p-4">
              <Photo variant="work" label="Architecture" className="w-full aspect-[4/5] rotate-[2deg]" />
              <Photo variant="work" label="Development" className="w-full aspect-[4/5] rotate-[-2deg] mt-8" />
            </div>
          }
        >
          <p>
            [Placeholder: Career journey, key achievements, and professional growth.]
          </p>
          <p className="mt-4">
            [Current tech focus and professional aspirations.]
          </p>
        </AboutSection>

        {/* Section 3: Interests & Hobbies */}
        <AboutSection 
          title="Interests & Hobbies" 
          imageWide={true}
          imageContent={
            <div className="relative w-full max-w-sm flex flex-wrap gap-4 justify-center items-center">
              <Photo variant="hobby" className="w-40 h-40 rotate-[-3deg]" />
              <Photo variant="hobby" className="w-36 h-36 rotate-[2deg] -mt-4" />
              <Photo variant="hobby" className="absolute -bottom-8 left-4 w-28 h-28 rotate-[6deg] opacity-60 hidden lg:flex" />
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
    </div>
  );
}
