"use client";

import { useEffect, useRef } from "react";
import { AFFECT_PALETTE } from "@/lib/affectPalette";

/**
 * FieldSphere — the hero "Field".
 *
 * A dense grid of small coloured squares sampled from a radial gradient (a fresh
 * palette drawn from the curated affect range on every load). Reads as a solid
 * mass at a glance and resolves into pixels up close. The mass slowly MORPHS
 * between shapes — circle → triangle → square → rhombus → heptagon and round —
 * and a fresh load also picks a random starting shape, so the field is a new
 * colour *and* a new shape each visit ("emotion is a shape, a field"). Moving the
 * pointer over it repels nearby pixels; they spring back to their home in the
 * current (or morphing) shape.
 *
 * Canvas 2D, no dependencies. The render loop runs while the field is morphing or
 * disturbed and rests in between. Honours the brand `field-pulse` (className) and
 * `prefers-reduced-motion` (static shape, no morph, no interaction).
 */

const BASE_CELL = 2.2; // smallest pixel cell, CSS px
const MAX_DOTS = 46000; // dot budget — keeps full-bleed density near the original disc
const DOT_RATIO = 0.82; // pixel size as a fraction of the cell (the rest is the gap)
const MARGIN = 40; // inset from the canvas box so the shape + disruption never clip
const EDGE0 = 0.975; // soft-edge feather starts here (fraction of the shape radius)
const EDGE_NOISE = 0.5; // per-pixel jitter, CSS px — keeps the rim from being a sterile lattice

// Pointer "gravity" — unchanged feel.
const INFLUENCE = 72;
const PUSH = 2.6;
const SPRING = 0.05;
const DAMP = 0.85;
const REST_EPS = 0.02;
const IDLE_MS = 140;

// Shape morphing.
const HOLD_MS = 3500; // dwell on each shape
const MORPH_MS = 1800; // transition between shapes

// Shapes the field cycles through. sides < 3 → circle (constant radius). phi0 sets
// orientation; sx/sy stretch the form (rhombus = a horizontally-squished diamond).
type ShapeDef = { sides: number; phi0: number; sx: number; sy: number };
const SHAPES: ShapeDef[] = [
  { sides: 0, phi0: 0, sx: 1, sy: 1 }, // circle
  { sides: 3, phi0: -Math.PI / 2, sx: 1, sy: 1 }, // triangle (point up)
  { sides: 4, phi0: Math.PI / 4, sx: 1, sy: 1 }, // square (flat top)
  { sides: 4, phi0: 0, sx: 0.8, sy: 1 }, // rhombus (diamond, narrowed)
  { sides: 7, phi0: -Math.PI / 2, sx: 1, sy: 1 }, // heptagon (point up)
];

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Edge radius of a regular n-gon (circumradius R, orientation phi0) at angle theta.
function polyRadius(sides: number, phi0: number, theta: number, R: number): number {
  if (sides < 3) return R; // circle
  const seg = (2 * Math.PI) / sides;
  let a = theta - phi0;
  a = ((a % seg) + seg) % seg; // wrap into [0, seg)
  return (R * Math.cos(Math.PI / sides)) / Math.cos(a - seg / 2);
}

type Stop = { color: string; pct: number };
type Palette = { stops: Stop[]; cx: number; cy: number };

function makePalette(): Palette {
  const n = AFFECT_PALETTE.length;
  const anchor = Math.floor(Math.random() * n);
  const count = 6;
  const step = 5; // walk a local run of the curated palette for tonal cohesion
  const stops: Stop[] = [];
  for (let i = 0; i < count; i++) {
    const jitter = Math.floor((Math.random() - 0.5) * 6);
    const idx = (((anchor + i * step + jitter) % n) + n) % n;
    stops.push({ color: AFFECT_PALETTE[idx], pct: (i * 96) / (count - 1) });
  }
  return { stops, cx: 18 + Math.random() * 56, cy: 10 + Math.random() * 56 };
}

export function FieldSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctxMaybe = canvas.getContext("2d");
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = makePalette();

    // Per-pixel constants (colour-sorted order).
    let theta = new Float32Array(0);
    let rho = new Float32Array(0);
    let jx = new Float32Array(0); // rim jitter, applied in every shape
    let jy = new Float32Array(0);
    let homeX: Float32Array[] = []; // per-shape home positions
    let homeY: Float32Array[] = [];

    // Per-pixel dynamic state.
    let hx = new Float32Array(0); // live home (current shape / morph blend)
    let hy = new Float32Array(0);
    let ox = new Float32Array(0); // offset from home
    let oy = new Float32Array(0);
    let vx = new Float32Array(0); // velocity
    let vy = new Float32Array(0);
    let groupColor: string[] = [];
    let groupStart: number[] = [];
    let count = 0;
    let size = 0; // CSS px (square)
    let dotSize = BASE_CELL * DOT_RATIO;

    // Morph schedule (persists across rebuilds so resizing never snaps the shape).
    let shapeFrom = Math.floor(Math.random() * SHAPES.length);
    let shapeTo = shapeFrom;
    let phase: "hold" | "morph" = "hold";
    let morphStart = 0;
    let holdUntil = performance.now() + HOLD_MS;

    const pointer = { x: -9999, y: -9999, active: false, lastMove: 0 };
    let raf = 0;
    let running = false;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    // Blend the live home arrays from the current schedule state.
    function applyHome() {
      if (phase === "morph") {
        const e = easeInOut(Math.min(1, (performance.now() - morphStart) / MORPH_MS));
        const ax = homeX[shapeFrom];
        const ay = homeY[shapeFrom];
        const bx = homeX[shapeTo];
        const by = homeY[shapeTo];
        for (let k = 0; k < count; k++) {
          hx[k] = ax[k] + (bx[k] - ax[k]) * e;
          hy[k] = ay[k] + (by[k] - ay[k]) * e;
        }
      } else {
        hx.set(homeX[shapeFrom]);
        hy.set(homeY[shapeFrom]);
      }
    }

    function build() {
      size = canvas.clientWidth;
      if (size <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Cell sized so even the densest shape (square, fill ≈ 1) stays under budget.
      const cell = Math.max(BASE_CELL, Math.sqrt((size * size) / MAX_DOTS));
      dotSize = cell * DOT_RATIO;

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
        grad.addColorStop(st.pct / 100, st.color);
      }
      octx.fillStyle = grad;
      octx.fillRect(0, 0, off.width, off.height);
      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const samp = off.width / size;

      const center = size / 2;
      const radius = size / 2 - MARGIN;
      const cols = Math.ceil(size / cell);

      // Sample the canonical disc; store each pixel's polar coords + colour.
      const tmpTheta: number[] = [];
      const tmpRho: number[] = [];
      const tmpJx: number[] = [];
      const tmpJy: number[] = [];
      const tmpCol: string[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < cols; i++) {
          const x = i * cell + cell / 2;
          const y = j * cell + cell / 2;
          const nx = (x - center) / radius;
          const ny = (y - center) / radius;
          const d = Math.hypot(nx, ny);
          if (d > 1) continue; // every cell inside the disc is filled — no dropout

          const cx = Math.min(off.width - 1, Math.floor(x * samp));
          const cy = Math.min(off.height - 1, Math.floor(y * samp));
          const p = (cy * off.width + cx) * 4;
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];

          // Soft anti-aliased rim — feathered by radius, so it lands on the
          // boundary of whatever shape this pixel maps into.
          let a = d <= EDGE0 ? 1 : (1 - d) / (1 - EDGE0);
          a = Math.round(a * 5) / 5;
          if (a <= 0) continue;

          tmpTheta.push(Math.atan2(ny, nx));
          tmpRho.push(d);
          tmpJx.push((Math.random() - 0.5) * 2 * EDGE_NOISE);
          tmpJy.push((Math.random() - 0.5) * 2 * EDGE_NOISE);
          tmpCol.push(`rgba(${r & 0xf8},${g & 0xf8},${b & 0xf8},${a})`);
        }
      }

      // Sort by colour, then lay out contiguous colour groups (cheap draws).
      const nPix = tmpTheta.length;
      const order = Array.from({ length: nPix }, (_, i) => i).sort((a, b) =>
        tmpCol[a] < tmpCol[b] ? -1 : tmpCol[a] > tmpCol[b] ? 1 : 0,
      );
      theta = new Float32Array(nPix);
      rho = new Float32Array(nPix);
      jx = new Float32Array(nPix);
      jy = new Float32Array(nPix);
      groupColor = [];
      groupStart = [];
      let prev = "";
      for (let r = 0; r < nPix; r++) {
        const i = order[r];
        theta[r] = tmpTheta[i];
        rho[r] = tmpRho[i];
        jx[r] = tmpJx[i];
        jy[r] = tmpJy[i];
        const c = tmpCol[i];
        if (c !== prev) {
          groupColor.push(c);
          groupStart.push(r);
          prev = c;
        }
      }
      groupStart.push(nPix);
      count = nPix;

      // Precompute every pixel's home in every shape (same colour-sorted order).
      homeX = [];
      homeY = [];
      for (let s = 0; s < SHAPES.length; s++) {
        const sh = SHAPES[s];
        const HX = new Float32Array(nPix);
        const HY = new Float32Array(nPix);
        for (let k = 0; k < nPix; k++) {
          const th = theta[k];
          const rad = rho[k] * polyRadius(sh.sides, sh.phi0, th, radius);
          HX[k] = center + Math.cos(th) * rad * sh.sx + jx[k];
          HY[k] = center + Math.sin(th) * rad * sh.sy + jy[k];
        }
        homeX.push(HX);
        homeY.push(HY);
      }

      hx = new Float32Array(nPix);
      hy = new Float32Array(nPix);
      ox = new Float32Array(nPix);
      oy = new Float32Array(nPix);
      vx = new Float32Array(nPix);
      vy = new Float32Array(nPix);

      applyHome();
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);
      const half = dotSize / 2;
      for (let g = 0; g < groupColor.length; g++) {
        ctx.fillStyle = groupColor[g];
        const end = groupStart[g + 1];
        for (let k = groupStart[g]; k < end; k++) {
          ctx.fillRect(hx[k] + ox[k] - half, hy[k] + oy[k] - half, dotSize, dotSize);
        }
      }
    }

    function step() {
      const now = performance.now();

      // ── advance the morph schedule ──
      let morphing = false;
      if (phase === "hold" && !reduced && now >= holdUntil) {
        shapeFrom = shapeTo;
        shapeTo = (shapeFrom + 1) % SHAPES.length;
        morphStart = now;
        phase = "morph";
      }
      if (phase === "morph") {
        const t = Math.min(1, (now - morphStart) / MORPH_MS);
        const e = easeInOut(t);
        const ax = homeX[shapeFrom];
        const ay = homeY[shapeFrom];
        const bx = homeX[shapeTo];
        const by = homeY[shapeTo];
        for (let k = 0; k < count; k++) {
          hx[k] = ax[k] + (bx[k] - ax[k]) * e;
          hy[k] = ay[k] + (by[k] - ay[k]) * e;
        }
        if (t >= 1) {
          shapeFrom = shapeTo;
          phase = "hold";
          holdUntil = now + HOLD_MS;
        } else {
          morphing = true;
        }
      }

      // ── pointer repulsion + spring back to the (possibly moving) home ──
      if (pointer.active && now - pointer.lastMove > IDLE_MS) {
        pointer.active = false;
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

      if (morphing || moving || pointer.active) {
        raf = requestAnimationFrame(step);
      } else {
        for (let k = 0; k < count; k++) {
          ox[k] = oy[k] = vx[k] = vy[k] = 0;
        }
        draw();
        running = false;
        scheduleWake(); // come back for the next morph
      }
    }

    function scheduleWake() {
      if (reduced) return;
      if (holdTimer) clearTimeout(holdTimer);
      const wait = Math.max(0, holdUntil - performance.now());
      holdTimer = setTimeout(ensureRunning, wait + 16);
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
      ensureRunning();
    }

    build();
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerdown", onPointer, { passive: true });
      window.addEventListener("blur", release);
      ensureRunning(); // kick the morph cycle
    }
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      if (holdTimer) clearTimeout(holdTimer);
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
        width: "min(92vh, 92vw)",
        height: "min(92vh, 92vw)",
        display: "block",
      }}
    />
  );
}
