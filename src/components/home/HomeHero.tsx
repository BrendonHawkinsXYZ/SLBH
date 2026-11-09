"use client";

import { useSyncExternalStore } from "react";
import { homeDrawings } from "@/lib/homeDrawings";
import { HeroGallery } from "./HeroGallery";

function HeroPlaceholder() {
  return <section id="home-gallery" className="site-surface" aria-label="Work from Studio Lab BH" aria-busy="true"
    style={{ flexShrink: 0, height: "calc(100svh - var(--home-nav-height))", minHeight: 240 }} />;
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function HomeHero() {
  // The drawing's random opening selection runs only on the client. The hero
  // itself is now the same at every hour; questions belong to the arrival screen.
  const hydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  return hydrated ? <HeroGallery artwork={homeDrawings} /> : <HeroPlaceholder />;
}
