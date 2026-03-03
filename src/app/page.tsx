"use client";

import { useEffect, useState } from "react";

function useLocationAndTime() {
  const [location, setLocation] = useState("United States");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(`${formatted} | ${timeStr}`);
    };

    // Attempt geolocation for city/region
    if ("geolocation" in navigator) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data.city) {
            setLocation(data.city);
          } else if (data.country_name) {
            setLocation(data.country_name);
          }
        })
        .catch(() => {
          // Keep default
        });
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return { location, time };
}

export default function Home() {
  const { location, time } = useLocationAndTime();

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-background text-foreground font-[family-name:var(--font-inter)]">
      {/* Top bar */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
        <p className="text-sm tracking-[0.56px] leading-[1.245]">
          {location} | {time}
        </p>
        {/* instagram + coming soon — top-right on desktop, hidden on mobile */}
        <div className="hidden md:flex items-center gap-6 text-sm tracking-[-0.84px]">
          <a
            href="https://www.instagram.com/studiolabbh"
            target="_blank"
            rel="noopener noreferrer"
            className="relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out"
          >
            instagram
          </a>
          <p>coming soon</p>
        </div>
      </div>

      {/* SLBH — desktop: single line at bottom-left */}
      <h1 className="hidden md:block absolute bottom-16 left-8 font-[family-name:var(--font-orbitron)] font-black text-[clamp(180px,23vw,350px)] leading-[0.95] select-none">
        SLBH
      </h1>

      {/* SL / BH — mobile: stacked at bottom-left */}
      <div className="md:hidden absolute bottom-28 left-7">
        <h1 className="font-[family-name:var(--font-orbitron)] font-black text-[128px] leading-[1.05] select-none">
          SL
        </h1>
        <h1 className="font-[family-name:var(--font-orbitron)] font-black text-[128px] leading-[1.05] select-none">
          BH
        </h1>
      </div>

      {/* instagram + coming soon — bottom-center on mobile only */}
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm tracking-[-0.84px]">
        <a
          href="https://www.instagram.com/studiolabbh"
          target="_blank"
          rel="noopener noreferrer"
          className="relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out"
        >
          instagram
        </a>
        <p>coming soon</p>
      </div>

      {/* Spectrum line + footer — pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* 2px spectrum line */}
        <div className="flex w-full" style={{ height: '2px' }}>
          <span className="flex-1" style={{ background: '#D42B2B' }} />
          <span className="flex-1" style={{ background: '#E86510' }} />
          <span className="flex-1" style={{ background: '#C8C400' }} />
          <span className="flex-1" style={{ background: '#1A8C1A' }} />
          <span className="flex-1" style={{ background: '#0A8C7A' }} />
          <span className="flex-1" style={{ background: '#0A1E6E' }} />
          <span className="flex-1" style={{ background: '#5C0FAD' }} />
        </div>
        {/* Footer text */}
        <div className="flex justify-end items-center px-8 py-4">
          {/* Mobile — abbreviated */}
          <p className="md:hidden font-[family-name:var(--font-orbitron)] text-[9px] tracking-[0.15em] text-foreground/40 uppercase">
            ACG · STUDIO LAB BH
          </p>
          {/* Desktop — full */}
          <p className="hidden md:block font-[family-name:var(--font-orbitron)] text-[10px] tracking-[0.2em] text-foreground/40 uppercase">
            AFFECTIVE COMPUTATIONAL GEOMETRY · STUDIO LAB BH
          </p>
        </div>
      </div>
    </main>
  );
}
