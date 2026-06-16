"use client";

import { useEffect, useRef } from "react";

/**
 * FieldSphere — the hero "Field".
 *
 * A radial colour field (random hue on every load) rendered as a tight,
 * ordered (Bayer 8×8) dither of small coloured dots. Moving the pointer over
 * it repels the dots near the cursor; they spring back home and reform the
 * circle when the pointer moves away.
 *
 * Canvas 2D, no dependencies. The render loop only runs while the field is
 * disturbed and stops once everything has settled. Honours the brand
 * `field-pulse` (applied via className) and `prefers-reduced-motion`
 * (static dither, no interaction).
 */

/** Ordered 8×8 Bayer matrix — thresholds normalise to (0, 1). */
const BAYER8 = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
];

const CELL = 4; // dither cell, CSS px — small keeps the dither tight
const DOT = 2.4; // drawn dot, CSS px (< CELL leaves the stipple gaps)
const INFLUENCE = 72; // pointer disruption radius, CSS px
const PUSH = 2.6; // repulsion impulse strength
const SPRING = 0.05; // pull back toward home position
const DAMP = 0.85; // velocity damping
const REST_EPS = 0.02; // below this the field is considered settled
const IDLE_MS = 140; // reform this long after the pointer stops moving
const EDGE_NOISE = 1.5; // per-dot positional jitter, CSS px — roughens each piece
const THRESH_NOISE = 0.08; // grain on the dither on/off boundary

type Stop = { h: number; s: number; l: number; pct: number };
type Palette = { stops: Stop[]; cx: number; cy: number };

function makePalette(): Palette {
  const base = Math.random() * 360;
  const stops = Array.from({ length: 6 }, (_, i) => {
    const h = (((base + i * 50 + (Math.random() - 0.5) * 22) % 360) + 360) % 360;
    const s = 38 + Math.random() * 28;
    const l = 63 + Math.random() * 17;
    return { h, s, l, pct: i * (96 / 5) };
  });
  return { stops, cx: 18 + Math.random() * 56, cy: 10 + Math.random() * 56 };
}

export function FieldSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Explicit non-null types so the narrowing survives into the closures below.
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = makePalette();

    // Per-dot state (reordered + grouped by colour for cheap draws).
    let hx = new Float32Array(0); // home x / y
    let hy = new Float32Array(0);
    let ox = new Float32Array(0); // live offset from home
    let oy = new Float32Array(0);
    let vx = new Float32Array(0); // velocity
    let vy = new Float32Array(0);
    let groupColor: string[] = [];
    let groupStart: number[] = [];
    let count = 0;
    let size = 0; // CSS px (square)

    const pointer = { x: -9999, y: -9999, active: false, lastMove: 0 };
    let raf = 0;
    let running = false;

    function build() {
      size = canvas.clientWidth;
      if (size <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Paint the radial gradient offscreen so we can sample per-cell colour.
      const off = document.createElement("canvas");
      off.width = off.height = Math.max(2, Math.round(size));
      const octx = off.getContext("2d");
      if (!octx) return;
      const gx = (palette.cx / 100) * off.width;
      const gy = (palette.cy / 100) * off.height;
      const far = Math.max(
        Math.hypot(gx, gy),
        Math.hypot(off.width - gx, gy),
        Math.hypot(gx, off.height - gy),
        Math.hypot(off.width - gx, off.height - gy),
      );
      const grad = octx.createRadialGradient(gx, gy, 0, gx, gy, far);
      for (const st of palette.stops) {
        grad.addColorStop(st.pct / 100, `hsl(${st.h},${st.s}%,${st.l}%)`);
      }
      octx.fillStyle = grad;
      octx.fillRect(0, 0, off.width, off.height);
      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const sample = off.width / size;

      const center = size / 2;
      const radius = size / 2;
      const cols = Math.ceil(size / CELL);

      const tmpX: number[] = [];
      const tmpY: number[] = [];
      const tmpCol: string[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * CELL + CELL / 2;
          const y = j * CELL + CELL / 2;
          const d = Math.hypot(x - center, y - center) / radius;
          if (d > 1.06) continue;

          const sx = Math.min(off.width - 1, Math.floor(x * sample));
          const sy = Math.min(off.height - 1, Math.floor(y * sample));
          const p = (sy * off.width + sx) * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];

          // Density: solid core, dithered rim, sparser where the field is
          // lighter — this is what ties the dither to the colour.
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const radial = Math.min(1, Math.max(0, (1.06 - d) / 0.26));
          const coverage = radial * (1 - 0.5 * lum);
          // Ordered threshold + a little noise so edges grain rather than
          // breaking on a clean ordered boundary.
          const threshold =
            (BAYER8[j & 7][i & 7] + 0.5) / 64 + (Math.random() - 0.5) * THRESH_NOISE;
          if (coverage <= threshold) continue;

          // Jitter each piece off its grid cell so its edges read as noisy.
          tmpX.push(x + (Math.random() - 0.5) * 2 * EDGE_NOISE);
          tmpY.push(y + (Math.random() - 0.5) * 2 * EDGE_NOISE);
          // Quantise colour (steps of 8) so dots batch into few draw groups.
          tmpCol.push(`rgb(${r & 0xf8},${g & 0xf8},${b & 0xf8})`);
        }
      }

      // Sort by colour, then lay out contiguous colour groups.
      const n = tmpX.length;
      const order = Array.from({ length: n }, (_, i) => i).sort((a, b) =>
        tmpCol[a] < tmpCol[b] ? -1 : tmpCol[a] > tmpCol[b] ? 1 : 0,
      );
      hx = new Float32Array(n);
      hy = new Float32Array(n);
      groupColor = [];
      groupStart = [];
      let prev = "";
      for (let r = 0; r < n; r++) {
        const i = order[r];
        hx[r] = tmpX[i];
        hy[r] = tmpY[i];
        const c = tmpCol[i];
        if (c !== prev) {
          groupColor.push(c);
          groupStart.push(r);
          prev = c;
        }
      }
      groupStart.push(n);
      count = n;
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);

      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);
      const half = DOT / 2;
      for (let g = 0; g < groupColor.length; g++) {
        ctx.fillStyle = groupColor[g];
        const end = groupStart[g + 1];
        for (let k = groupStart[g]; k < end; k++) {
          ctx.fillRect(hx[k] + ox[k] - half, hy[k] + oy[k] - half, DOT, DOT);
        }
      }
    }

    function step() {
      if (pointer.active && performance.now() - pointer.lastMove > IDLE_MS) {
        pointer.active = false; // pointer parked → let the field reform
      }
      const infl2 = INFLUENCE * INFLUENCE;
      let moving = false;

      for (let k = 0; k < count; k++) {
        if (pointer.active) {
          const dx = hx[k] + ox[k] - pointer.x;
          const dy = hy[k] + oy[k] - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < infl2 && dist2 > 0.0001) {
            const dist = Math.sqrt(dist2);
            const f = (1 - dist / INFLUENCE) * PUSH;
            vx[k] += (dx / dist) * f;
            vy[k] += (dy / dist) * f;
          }
        }
        vx[k] = (vx[k] - ox[k] * SPRING) * DAMP;
        vy[k] = (vy[k] - oy[k] * SPRING) * DAMP;
        ox[k] += vx[k];
        oy[k] += vy[k];
        if (
          !moving &&
          (vx[k] > REST_EPS ||
            vx[k] < -REST_EPS ||
            vy[k] > REST_EPS ||
            vy[k] < -REST_EPS ||
            ox[k] > REST_EPS ||
            ox[k] < -REST_EPS ||
            oy[k] > REST_EPS ||
            oy[k] < -REST_EPS)
        ) {
          moving = true;
        }
      }

      draw();

      if (moving || pointer.active) {
        raf = requestAnimationFrame(step);
      } else {
        for (let k = 0; k < count; k++) {
          ox[k] = oy[k] = vx[k] = vy[k] = 0;
        }
        draw();
        running = false;
      }
    }

    function ensureRunning() {
      if (!running && !reduced) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    }

    function onPointer(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * size;
      const y = ((e.clientY - rect.top) / rect.height) * size;
      if (x > -INFLUENCE && x < size + INFLUENCE && y > -INFLUENCE && y < size + INFLUENCE) {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
        pointer.lastMove = performance.now();
        ensureRunning();
      } else {
        pointer.active = false;
      }
    }

    function release() {
      pointer.active = false;
      ensureRunning(); // let any lingering displacement settle
    }

    build();
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      window.addEventListener("blur", release);
    }
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("blur", release);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="field-pulse"
      style={{
        width: "min(520px, 92vw)",
        height: "min(520px, 92vw)",
        display: "block",
      }}
    />
  );
}
