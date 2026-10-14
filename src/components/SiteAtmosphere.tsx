"use client";

import { useEffect } from "react";
import { getSiteBlack } from "@/lib/siteAtmosphere";

export function SiteAtmosphere() {
  useEffect(() => {
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      const color = getSiteBlack(new Date()).color;
      const root = document.documentElement;
      if (root.style.getPropertyValue("--paper") !== color) {
        root.style.setProperty("--paper", color);
      }
      // Re-read local time each minute to handle day boundaries, daylight saving,
      // and device-clock changes while a page remains open.
      if (!document.hidden) {
        timer = window.setTimeout(update, 60_000 - (Date.now() % 60_000) + 20);
      }
    };
    update();
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    window.addEventListener("pageshow", update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  return null;
}
