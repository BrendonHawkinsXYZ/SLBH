"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MorphShape } from "./MorphShape";

export function AmbientShape() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [renderShape, setRenderShape] = useState(false);

  useEffect(() => {
    if (visible) return;
    // Retain the canvas for the 600ms opacity transition before stopping it.
    const timeout = window.setTimeout(() => setRenderShape(false), 600);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const nextVisible = window.scrollY > 0;
      setVisible(nextVisible);
      if (nextVisible) setRenderShape(true);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  if (pathname !== "/") return null;
  return <div className={`floating-shape${visible ? " floating-shape--visible" : ""}`} aria-hidden="true">
    {renderShape && <MorphShape />}
  </div>;
}
