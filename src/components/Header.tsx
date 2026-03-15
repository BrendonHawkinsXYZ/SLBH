"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="anim-chrome relative flex items-center justify-between px-10 pt-8 shrink-0 z-10 max-md:px-6 max-md:pt-5">
      <Link
        href="/"
        className="font-[family-name:var(--font-orbitron)] text-sm tracking-[0.1em] text-white shrink-0"
      >
        SLBH
      </Link>
      <nav>
        <a
          href="mailto:brendon@studiolabbh.xyz"
          className="font-[family-name:var(--font-inter)] text-sm uppercase text-[#F6F6F6] no-underline transition-opacity duration-[800ms] max-md:text-xs"
          style={{ transitionTimingFunction: "var(--ease-drift)" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          CONTACT
        </a>
      </nav>
    </header>
  );
}
