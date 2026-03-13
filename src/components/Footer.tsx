"use client";

export default function Footer() {
  return (
    <footer className="anim-chrome shrink-0 px-[38px] pb-6 max-md:px-6 max-md:pb-4 max-md:pt-2 mt-auto">
      <div className="h-px bg-[#3A3A3A] mb-[14px] max-md:mb-2" />
      <div className="flex justify-between items-center">
        <div className="font-[family-name:var(--font-orbitron-regular)] text-sm tracking-[0.1em] text-[#3A3A3A] whitespace-pre max-md:text-[11px]">
          © STUDIO LAB BH 2026
        </div>
        <div>
          <a
            href="https://www.instagram.com/studiolabbh"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-inter)] text-sm uppercase text-[#3A3A3A] no-underline tracking-[-0.06em] transition-colors duration-[800ms] max-md:text-[11px]"
            style={{ transitionTimingFunction: "var(--ease-drift)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#A0A0A0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#3A3A3A")}
          >
            INSTAGRAM
          </a>
        </div>
      </div>
    </footer>
  );
}
