"use client";

import { useEffect, useState } from "react";
import { MorphShape } from "./MorphShape";

/** One quiet breath on arrival; navigation never waits for this introduction. */
export function Arrival() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try { if (sessionStorage.getItem("slbh-arrived")) return; } catch { /* Optional session memory. */ }
    let timer = 0;
    const frame = requestAnimationFrame(() => {
      try { sessionStorage.setItem("slbh-arrived", "1"); } catch { /* Optional session memory. */ }
      setVisible(true);
      timer = window.setTimeout(() => setVisible(false), 2400);
    });
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer); };
  }, []);
  return visible ? <div className="arrival" aria-hidden="true"><MorphShape /></div> : null;
}
