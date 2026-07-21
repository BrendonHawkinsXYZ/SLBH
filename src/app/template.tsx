"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { DURATIONS, EASE_OUT } from "@/lib/motion";

/* Route transition — re-mounts per navigation, fading page content in
   while StatusBar/Nav/Footer (outside <main>) stay static.
   First load renders instantly (SSR paint stays visible; the discovery
   stagger owns the intro) — the fade only plays on client navigations.
   The flex styles must mirror <main> in layout.tsx: pages like the home
   hero rely on the flex chain to fill the viewport. */

let hasLoadedOnce = false;

export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [isFirstLoad] = useState(() => !hasLoadedOnce);
  useEffect(() => {
    hasLoadedOnce = true;
  }, []);
  return (
    <motion.div
      initial={isFirstLoad || reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATIONS.flick, ease: EASE_OUT }}
      style={{ flex: 1, display: "flex", flexDirection: "column" }}
    >
      {children}
    </motion.div>
  );
}
