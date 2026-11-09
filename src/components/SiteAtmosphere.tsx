"use client";

import { useEffect } from "react";
import { getSiteHorizon } from "@/lib/siteAtmosphere";

export function SiteAtmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const syncSurfaces = () => {
      frame = 0;
      const height = `${root.scrollHeight}px`;
      // Read all positions before writing styles to avoid repeated layout work.
      const surfaces = Array.from(document.querySelectorAll<HTMLElement>(".site-surface"), surface => {
        const rect = surface.getBoundingClientRect();
        return { surface, x: `${-(rect.left + window.scrollX)}px`, y: `${-(rect.top + window.scrollY)}px` };
      });
      if (root.style.getPropertyValue("--paper-height") !== height) {
        root.style.setProperty("--paper-height", height);
      }
      for (const { surface, x, y } of surfaces) {
        if (surface.style.getPropertyValue("--paper-offset-x") !== x) surface.style.setProperty("--paper-offset-x", x);
        if (surface.style.getPropertyValue("--paper-offset-y") !== y) surface.style.setProperty("--paper-offset-y", y);
      }
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(syncSurfaces); };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    // Client navigation and dialogs can introduce surfaces without resizing body.
    const mutations = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node => node instanceof HTMLElement))) schedule();
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, []);

  useEffect(() => {
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      const date = new Date();
      const color = getSiteHorizon(date);
      const root = document.documentElement;
      if (root.style.getPropertyValue("--paper-horizon") !== color) {
        root.style.setProperty("--paper-horizon", color);
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
