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
        {/* "coming soon" — top-right on desktop, hidden on mobile */}
        <p className="hidden md:block text-sm tracking-[-0.84px]">
          coming soon
        </p>
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

      {/* "coming soon" — bottom-center on mobile only */}
      <p className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 text-sm tracking-[-0.84px]">
        coming soon
      </p>
    </main>
  );
}
