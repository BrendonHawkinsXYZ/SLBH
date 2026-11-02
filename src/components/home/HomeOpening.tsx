"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { HOME_OPENING_STORAGE_KEY } from "@/lib/homeOpening";

type Phase = "pending" | "intro" | "out" | "nav" | "bar" | "waiting" | "image" | "ready";
const HomeOpeningContext = createContext({ complete: true, onReady: () => {} });
let seenThisVisit = false;

export function useHomeOpening() {
  return useContext(HomeOpeningContext);
}

export function HomeOpening({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("pending");
  const [assetReady, setAssetReady] = useState(false);
  const shouldPlay = useRef<boolean | null>(null);
  const onReady = useCallback(() => setAssetReady(true), []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (shouldPlay.current === null) {
      let seen = seenThisVisit;
      try { seen ||= localStorage.getItem(HOME_OPENING_STORAGE_KEY) === "1"; } catch { /* Keep the in-memory preference when storage is unavailable. */ }
      shouldPlay.current = !seen && !window.location.hash && root.dataset.homeOpening !== "ready" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      seenThisVisit = true;
      try { localStorage.setItem(HOME_OPENING_STORAGE_KEY, "1"); } catch { /* Storage is optional. */ }
    }
    const initial = shouldPlay.current ? "intro" : "ready";
    root.dataset.homeOpening = initial;
    setPhase(initial);
    return () => { delete root.dataset.homeOpening; };
  }, []);

  useEffect(() => {
    if (phase === "pending") return;
    document.documentElement.dataset.homeOpening = phase;
    const next: Partial<Record<Phase, [number, Phase]>> = {
      intro: [1100, "out"],
      out: [450, "nav"],
      nav: [180, "bar"],
      bar: [320, "waiting"],
      image: [700, "ready"],
    };
    const transition = next[phase];
    if (!transition) return;
    const timer = window.setTimeout(() => setPhase(transition[1]), transition[0]);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "waiting" && assetReady) setPhase("image");
  }, [phase, assetReady]);

  useEffect(() => {
    const finish = () => setPhase("ready");
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") finish();
    };
    const pageshow = (event: PageTransitionEvent) => { if (event.persisted) finish(); };
    document.addEventListener("slbh-home-opening-skip", finish);
    document.addEventListener("keydown", keydown);
    window.addEventListener("pageshow", pageshow);
    return () => {
      document.removeEventListener("slbh-home-opening-skip", finish);
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("pageshow", pageshow);
    };
  }, []);

  return <HomeOpeningContext.Provider value={{ complete: phase === "ready", onReady }}>
    <div className="home-intro site-surface" aria-hidden={phase !== "pending" && phase !== "intro"}>
      <p>Tell me<br />how you feel</p>
    </div>
    {children}
  </HomeOpeningContext.Provider>;
}
