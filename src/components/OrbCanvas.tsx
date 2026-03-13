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

    // Reverse colorHistory: API gives oldest-first, orb needs newest-first
    // ring 0 (center) = today, ring 6 = oldest
    const hist = [...colorHistory].reverse();
    const rc = 8; // 7 data rings + 1 ground ring
    const bw = R / rc;
    const renderStart = performance.now();
    const ringRevealDuration = 2500;
    let t = 0;

    function draw() {
      t += 0.001;
      const elapsed = performance.now() - renderStart;
      const revealProgress = Math.min(elapsed / ringRevealDuration, 1);
      const revealEased = 1 - Math.pow(1 - revealProgress, 3);

      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, w, h);

      const globalPulse = Math.sin(t * 0.63) * 0.006;

      // Paint rings from outermost (i=7) to innermost (i=0)
      for (let i = rc - 1; i >= 0; i--) {
        const isGround = i === rc - 1;
        const col = isGround
          ? { hsl_h: 0, hsl_s: 0, hsl_l: 0.039 }
          : hist[i];
        if (!col) continue;

        // Ring reveal: outer rings reveal first
        const orderFromOuter = (rc - 1 - i) / (rc - 1);
        const revealThreshold = orderFromOuter * 0.7;
        const ringAlpha = Math.min(
          Math.max((revealEased - revealThreshold) / 0.3, 0),
          1
        );
        if (ringAlpha <= 0 && !isGround) continue;

        const H = col.hsl_h;
        const S = isGround ? 0 : col.hsl_s;
        const L = isGround ? 3.9 : col.hsl_l * 100;

        const pulseScale = 1 + globalPulse;
        const outerR = bw * (i + 1) * pulseScale;
        const innerR = bw * i * pulseScale;

        // Per-ring breathing for inner 4 rings
        const ringBreath = i < 4 ? Math.sin(t * 0.8 + i * 0.6) * 1.2 : 0;

        const grad = ctx!.createRadialGradient(
          cx + ringBreath * 0.3,
          cy + ringBreath * 0.2,
          Math.max(0, innerR * 0.7),
          cx,
          cy,
          outerR * 1.15
        );

        const intensity =
          (isGround ? 0 : 0.35 + (1 - i / rc) * 0.55) * ringAlpha;
        const satMult = isGround ? 0 : 60 + S * 40;
        const lightMult = isGround ? 4 : L;

        if (isGround) {
          grad.addColorStop(0, "hsla(0,0%,4%,0)");
          grad.addColorStop(0.5, "hsla(0,0%,4%,0.3)");
          grad.addColorStop(1, "hsla(0,0%,4%,0.7)");
        } else if (i === 0) {
          // Center ring: white-hot core
          grad.addColorStop(
            0,
            `hsla(${H},${Math.round(S * 30)}%,93%,${0.95 * ringAlpha})`
          );
          grad.addColorStop(
            0.15,
            `hsla(${H},${Math.round(S * 55)}%,82%,${0.85 * ringAlpha})`
          );
          grad.addColorStop(
            0.35,
            `hsla(${H},${Math.round(satMult)}%,${Math.round(lightMult)}%,${intensity})`
          );
          grad.addColorStop(
            0.7,
            `hsla(${H},${Math.round(satMult * 0.6)}%,${Math.round(lightMult * 0.6)}%,${intensity * 0.3})`
          );
          grad.addColorStop(
            1,
            `hsla(${H},${Math.round(satMult * 0.3)}%,${Math.round(lightMult * 0.3)}%,0)`
          );
        } else {
          // Middle rings
          grad.addColorStop(
            0,
            `hsla(${H},${Math.round(satMult)}%,${Math.round(lightMult * 1.1)}%,0)`
          );
          grad.addColorStop(
            0.3,
            `hsla(${H},${Math.round(satMult)}%,${Math.round(lightMult)}%,${intensity * 0.8})`
          );
          grad.addColorStop(
            0.55,
            `hsla(${H},${Math.round(satMult)}%,${Math.round(lightMult)}%,${intensity})`
          );
          grad.addColorStop(
            0.75,
            `hsla(${H},${Math.round(satMult * 0.7)}%,${Math.round(lightMult * 0.7)}%,${intensity * 0.5})`
          );
          grad.addColorStop(
            1,
            `hsla(${H},${Math.round(satMult * 0.3)}%,${Math.round(lightMult * 0.4)}%,0)`
          );
        }

        ctx!.fillStyle = grad;
        ctx!.fillRect(0, 0, w, h);
      }

      // Specular highlight
      const specAlpha = 0.03 * revealEased;
      const specGrad = ctx!.createRadialGradient(
        cx,
        cy - R * 0.25,
        R * 0.02,
        cx,
        cy,
        R * 0.6
      );
      specGrad.addColorStop(0, `rgba(255,255,255,${specAlpha})`);
      specGrad.addColorStop(1, "transparent");
      ctx!.fillStyle = specGrad;
      ctx!.fillRect(0, 0, w, h);

      // Structural stroke circles
      const pulseScale = 1 + globalPulse;
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
      aria-label="Affective field visualization showing 7 days of emotional weather data"
    />
  );
}
