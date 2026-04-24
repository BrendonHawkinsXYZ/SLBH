import type { Easing, Transition, Variants } from "motion/react";

/* ═══ SLBH MOTION SYSTEM ═══
   See spec §1.4. Easing and durations are locked. */

export const EASE_OUT: Easing = [0.22, 0.61, 0.36, 1];
export const EASE_IN_OUT: Easing = [0.65, 0, 0.35, 1];

export const DURATIONS = {
  fast: 0.6,
  base: 0.9,
  slow: 1.2,
} as const;

/* Discovery — structural order of first-load reveal. */
export const DISCOVERY_DELAYS = {
  substrate: 0,
  structural: 0.4,
  primary: 1.0,
  editorial: 1.7,
  readout: 2.4,
} as const;

export type DiscoveryLayer = keyof typeof DISCOVERY_DELAYS;

/* Research spectrum for color transitions (drift rule).
   Red → Orange → Yellow → Green → Teal → Navy → Purple */
export const RESEARCH_SPECTRUM = [
  "#FF3B30",
  "#FF8A3D",
  "#FFD23D",
  "#4AB24A",
  "#00D1B2",
  "#1F3A8A",
  "#A85FF7",
] as const;

/* Reveal variants — 6px rise, 0.9s, ease-out. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

export function revealTransition(layer: DiscoveryLayer): Transition {
  return {
    duration: DURATIONS.base,
    ease: EASE_OUT,
    delay: DISCOVERY_DELAYS[layer],
  };
}
