"use client";

import { useEffect, useRef } from "react";
import { GenerativeField } from "@/lib/generativeField";

/** A fresh, continuously generated Chroma field on every mount. */
export function MorphShape() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let size = 500;
    let field: GenerativeField | null = null;
    let frame = 0, last = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const draw = (now: number) => {
      if (last) field?.advance(Math.min(now - last, 64));
      last = now;
      context.clearRect(0, 0, size, size);
      field?.render(context, size / 2, size / 2);
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const width = Math.round(canvas.getBoundingClientRect().width);
      if (!width || (width === size && field)) return;
      size = width;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.height = Math.round(size * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      if (field) field.resize(size);
      else field = new GenerativeField(size);
      resume();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    document.addEventListener("visibilitychange", resume);
    motion.addEventListener("change", resume);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      motion.removeEventListener("change", resume);
    };
  }, []);
  return <canvas ref={ref} className="morph-shape" width={500} height={500} aria-hidden="true" />;
}
