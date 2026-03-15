"use client";

import { useEffect, useRef, useCallback } from "react";
import type { HSLColor } from "@/lib/chroma-types";

interface OrbCanvasProps {
  colorHistory: HSLColor[];
}

function getOrbSize(): number {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw >= 1025) return Math.min(Math.round(Math.min(vw * 0.46, vh * 0.7)), 689);
  if (vw >= 769) return Math.min(Math.round(Math.min(vw * 0.42, vh * 0.55)), 520);
  return Math.min(vw - 80, Math.round(vh * 0.38), 340);
}

export default function OrbCanvas({ colorHistory }: OrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const afRef = useRef<number | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (afRef.current !== null) {
      cancelAnimationFrame(afRef.current);
      afRef.current = null;
    }

    const d = getOrbSize();
    const blurPx = d <= 340 ? 6 : 10;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = d * dpr;
    canvas.height = d * dpr;
    canvas.style.width = d + "px";
    canvas.style.height = d + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = w / 2;

    // Most recent color: colorHistory is oldest-first, so last element = today
    const col = colorHistory[colorHistory.length - 1] ?? { hsl_h: 0, hsl_s: 0, hsl_l: 0.039 };
    const H = col.hsl_h;
    const S = Math.round(col.hsl_s * 100);
    const L = Math.round(col.hsl_l * 100);

    const renderStart = performance.now();
    const revealDuration = 2500;
    let t = 0;

    function draw() {
      t += 0.001;

      const elapsed = performance.now() - renderStart;
      const revealProgress = Math.min(elapsed / revealDuration, 1);
      const revealEased = 1 - Math.pow(1 - revealProgress, 3);

      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, w, h);

      const pulse = Math.sin(t * 0.63) * 0.006;
      const r = R * (1 + pulse);

      // Single radial gradient — Figma proportions: white core → full color at 64% → bg fade at 96%
      const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0,    `hsla(${H},${Math.round(S * 0.15)}%,95%,${revealEased})`);
      grad.addColorStop(0.64, `hsla(${H},${S}%,${L}%,${revealEased})`);
      grad.addColorStop(0.96, `hsla(0,0%,3.9%,${revealEased})`);
      grad.addColorStop(1,    `hsla(0,0%,3.9%,${revealEased})`);

      ctx!.filter = `blur(${blurPx}px)`;
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);
      ctx!.filter = "none";

      // Structural stroke circles
      const pulseScale = 1 + pulse;
      ctx!.beginPath();
      ctx!.arc(cx, cy, (R - 1) * pulseScale, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(245,245,243,${0.035 * revealEased})`;
      ctx!.lineWidth = 1 * dpr;
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.arc(cx, cy, R * (656 / 689) * pulseScale, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(245,245,243,${0.055 * revealEased})`;
      ctx!.lineWidth = 1 * dpr;
      ctx!.stroke();

      afRef.current = requestAnimationFrame(draw);
    }

    draw();
  }, [colorHistory]);

  useEffect(() => {
    render();

    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(render, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (afRef.current !== null) cancelAnimationFrame(afRef.current);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      id="orb"
      className="block rounded-full"
      aria-label="Affective field visualization — current emotional color"
    />
  );
}
