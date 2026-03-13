"use client";

import Link from "next/link";

const NAV_LINKS = [
  { label: "MISSION", href: "/mission" },
  { label: "RESEARCH", href: "/research" },
  { label: "CONTACT", href: "mailto:brendon@studiolabbh.xyz" },
];

export default function Header() {
  return (
    <header className="anim-chrome relative flex items-center justify-between px-[38px] pt-8 shrink-0 z-10 max-md:px-6 max-md:pt-5">
      <Link
        href="/"
        className="font-[family-name:var(--font-orbitron)] text-sm tracking-[0.1em] text-white shrink-0"
      >
        SLBH
      </Link>
      <nav>
        <ul className="flex gap-6 list-none max-md:gap-[14px]">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              {href.startsWith("mailto:") ? (
                <a
                  href={href}
                  className="font-[family-name:var(--font-inter)] text-sm uppercase text-[#F6F6F6] no-underline transition-opacity duration-[800ms] max-md:text-[13px]"
                  style={{ transitionTimingFunction: "var(--ease-drift)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {label}
                </a>
              ) : (
                <Link
                  href={href}
                  className="font-[family-name:var(--font-inter)] text-sm uppercase text-[#F6F6F6] no-underline transition-opacity duration-[800ms] max-md:text-[13px]"
                  style={{ transitionTimingFunction: "var(--ease-drift)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
