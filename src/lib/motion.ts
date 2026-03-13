export const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
export const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_DRIFT = "cubic-bezier(0.45, 0, 0.55, 1)";

export const DELAYS = {
  orb: 0,
  delta: 1600,
  emotions: 2000,
  metrics: 2300,
  headline: 2600,
  body: 2900,
  chrome: 3200,
} as const;

export const DURATIONS = {
  orbReveal: 2400,
  ringReveal: 2500,
  elementEntrance: 900,
  chromeEntrance: 1200,
  hoverDrift: 800,
} as const;
