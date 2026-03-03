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
    <>
      <main className="relative min-h-svh w-full overflow-hidden bg-background text-foreground font-[family-name:var(--font-inter)]">
        {/* Top bar */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start lowercase">
          <p className="anim-fade-in text-sm tracking-[0.56px] leading-[1.245]" style={{ animationDuration: '800ms', animationDelay: '300ms' }}>
            {location} | {time}
          </p>
          {/* instagram + coming soon — top-right on desktop, hidden on mobile */}
          <div className="anim-fade-in hidden md:flex items-center gap-6 text-sm tracking-[-0.84px]" style={{ animationDuration: '600ms', animationDelay: '300ms' }}>
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
        <h1 className="anim-fade-up hidden md:block absolute bottom-8 left-8 font-[family-name:var(--font-orbitron)] font-black text-[clamp(180px,23vw,350px)] leading-[0.95] select-none" style={{ animationDuration: '1000ms', animationDelay: '800ms' }}>
          SLBH
        </h1>

        {/* SL / BH — mobile: stacked at bottom-left */}
        <div className="anim-fade-up md:hidden absolute bottom-7 left-7" style={{ animationDuration: '1000ms', animationDelay: '800ms' }}>
          <h1 className="font-[family-name:var(--font-orbitron)] font-black text-[128px] leading-[1.05] select-none">
            SL
          </h1>
          <h1 className="font-[family-name:var(--font-orbitron)] font-black text-[128px] leading-[1.05] select-none">
            BH
          </h1>
        </div>

        {/* instagram + coming soon — bottom-center on mobile only */}
        <div className="anim-fade-in md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm tracking-[-0.84px] lowercase" style={{ animationDuration: '600ms', animationDelay: '300ms' }}>
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
      </main>

      {/* Spectrum line — outside main to avoid overflow clipping */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex" style={{ height: '2px' }}>
        <span className="flex-1" style={{ background: '#D42B2B' }} />
        <span className="flex-1" style={{ background: '#E86510' }} />
        <span className="flex-1" style={{ background: '#C8C400' }} />
        <span className="flex-1" style={{ background: '#1A8C1A' }} />
        <span className="flex-1" style={{ background: '#0A8C7A' }} />
        <span className="flex-1" style={{ background: '#0A1E6E' }} />
        <span className="flex-1" style={{ background: '#5C0FAD' }} />
      </div>
    </>
  );
}
