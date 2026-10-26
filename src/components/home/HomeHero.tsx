"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import type { Artwork } from "@/lib/artwork";
import { getHomeHeroMode } from "@/lib/homeHero";

function HeroPlaceholder() {
  return <section id="home-gallery" className="site-surface" aria-label="Work from Studio Lab BH" aria-busy="true"
    style={{ flexShrink: 0, height: "calc(100svh - var(--home-nav-height))", minHeight: 400 }} />;
}

const HeroGallery = dynamic(() => import("./HeroGallery").then(module => module.HeroGallery), { loading: HeroPlaceholder });
const QuestionHero = dynamic(() => import("./QuestionHero").then(module => module.QuestionHero), { loading: HeroPlaceholder });
const getMode = () => getHomeHeroMode(new Date());
const getServerMode = () => null;

function subscribeTime(callback: () => void) {
  let timer = 0;
  const update = () => {
    window.clearTimeout(timer);
    callback();
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
}

export function HomeHero({ artwork }: { artwork: Artwork[] }) {
  const mode = useSyncExternalStore(subscribeTime, getMode, getServerMode);

  // Wait for the visitor's clock instead of rendering the server's time zone.
  if (mode === null) return <HeroPlaceholder />;
  return mode === "images"
    ? <HeroGallery artwork={artwork} />
    : <QuestionHero artwork={artwork} />;
}
