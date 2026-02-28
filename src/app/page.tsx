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
    <main className="relative min-h-svh w-full overflow-hidden bg-background text-foreground font-[family-name:var(--font-figtree)]">
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
      <h1 className="hidden md:block absolute bottom-0 left-8 font-[family-name:var(--font-orbitron)] font-black text-[clamp(180px,23vw,350px)] leading-[0.95] select-none">
        SLBH
      </h1>

      {/* SL / BH — mobile: stacked at bottom-left */}
      <div className="md:hidden absolute bottom-14 left-7">
        <h1 className="font-[family-name:var(--font-orbitron)] font-black text-[128px] leading-[1.05] select-none">
          SL
        </h1>
        <h1 className="font-[family-name:var(--font-orbitron)] font-black text-[128px] leading-[1.05] select-none">
          BH
        </h1>
      </div>

      {/* instagram + coming soon — bottom-center on mobile only */}
      <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm tracking-[-0.84px]">
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
  );
}
