/**
 * shapeField — the generative "Field" mosaic, as a reusable, static renderer.
 *
 * This is the same method the home Field (FieldSphere) uses: a dense grid of
 * small coloured squares sampled from a radial gradient (a fresh palette drawn
 * from the curated affect range), masked into a shape. The home component
 * animates and morphs; this module is the still, deterministic core — given a
 * palette, a shape, and a background, it draws one frame faithfully at any
 * pixel size. Used by the /shapes studio for both the on-screen preview and the
 * PNG export, so what you see is what you download.
 *
 * The "method" generalises past the five home shapes: any regular n-gon
 * (orientation + stretch) and any n-pointed star is just a different edge-radius
 * function r(theta), so the same disc of pixels can be poured into all of them.
 */

import { AFFECT_PALETTE } from "@/lib/affectPalette";

const BASE_CELL = 2.2; // smallest pixel cell, logical px
const MAX_DOTS = 46000; // dot budget — keeps density matched to the home Field
const DOT_RATIO = 0.82; // pixel size as a fraction of the cell (the rest is the gap)
const MARGIN_FRAC = 0.05; // inset from the canvas box, as a fraction of size
const EDGE0 = 0.975; // soft-edge feather starts here (fraction of the shape radius)
// Per-dot jitter as a fraction of the cell, so the mosaic keeps the same tight
// lattice at every render size. The home Field uses a fixed 0.5px nudge, which
// is ≈0.13·cell at desktop sizes — enough to avoid a sterile grid, small enough
// that dots stay on the lattice and read as a near-solid mass (not a stipple).
const EDGE_NOISE_RATIO = 0.13;

export type Background = "white" | "black" | "transparent";

export type ShapeKind = "circle" | "polygon" | "star";

export type ShapeDef = {
  id: string;
  label: string;
  kind: ShapeKind;
  sides?: number; // polygon sides, or star points
  phi0?: number; // orientation
  sx?: number; // horizontal stretch (<= 1)
  sy?: number; // vertical stretch (<= 1)
  inner?: number; // star inner-radius ratio
};

/**
 * The shape catalogue. The home Field cycles through the first five "general"
 * forms; everything below them is the same method opened up — more polygons,
 * orientations, a stretched rhombus, and stars.
 */
export const SHAPE_CATALOG: ShapeDef[] = [
  // ── the general five ──
  { id: "circle", label: "Circle", kind: "circle" },
  { id: "triangle", label: "Triangle", kind: "polygon", sides: 3, phi0: -Math.PI / 2 },
  { id: "square", label: "Square", kind: "polygon", sides: 4, phi0: Math.PI / 4 },
  { id: "rhombus", label: "Rhombus", kind: "polygon", sides: 4, phi0: 0, sx: 0.8 },
  { id: "heptagon", label: "Heptagon", kind: "polygon", sides: 7, phi0: -Math.PI / 2 },

  // ── the same method, opened up ──
  { id: "triangle-down", label: "Triangle ▽", kind: "polygon", sides: 3, phi0: Math.PI / 2 },
  { id: "diamond", label: "Diamond", kind: "polygon", sides: 4, phi0: 0 },
  { id: "pentagon", label: "Pentagon", kind: "polygon", sides: 5, phi0: -Math.PI / 2 },
  { id: "hexagon", label: "Hexagon", kind: "polygon", sides: 6, phi0: 0 },
  { id: "hexagon-point", label: "Hexagon ▲", kind: "polygon", sides: 6, phi0: -Math.PI / 2 },
  { id: "octagon", label: "Octagon", kind: "polygon", sides: 8, phi0: Math.PI / 8 },
  { id: "nonagon", label: "Nonagon", kind: "polygon", sides: 9, phi0: -Math.PI / 2 },
  { id: "decagon", label: "Decagon", kind: "polygon", sides: 10, phi0: 0 },
  { id: "dodecagon", label: "Dodecagon", kind: "polygon", sides: 12, phi0: 0 },
  { id: "star-5", label: "Star · 5", kind: "star", sides: 5, phi0: -Math.PI / 2, inner: 0.4 },
  { id: "star-6", label: "Star · 6", kind: "star", sides: 6, phi0: -Math.PI / 2, inner: 0.55 },
  { id: "star-8", label: "Star · 8", kind: "star", sides: 8, phi0: -Math.PI / 2, inner: 0.6 },
];

export type Stop = { color: string; pct: number };
export type Palette = { stops: Stop[]; cx: number; cy: number };

/**
 * A fresh palette: a local run of the curated affect range (for tonal cohesion)
 * and a randomly placed radial-gradient centre. Same approach as the home Field.
 */
export function makePalette(): Palette {
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

// Edge radius of a regular n-gon (circumradius R, orientation phi0) at angle theta.
function polyRadius(sides: number, phi0: number, theta: number, R: number): number {
  const seg = (2 * Math.PI) / sides;
  let a = theta - phi0;
  a = ((a % seg) + seg) % seg; // wrap into [0, seg)
  return (R * Math.cos(Math.PI / sides)) / Math.cos(a - seg / 2);
}

// Edge radius of an n-pointed star (outer R, inner R*inner) at angle theta.
// The star is a 2n-gon of alternating radii; this finds where the ray at theta
// crosses the current edge.
function starRadius(points: number, phi0: number, inner: number, theta: number, R: number): number {
  const stepAng = Math.PI / points; // angle between adjacent (outer↔inner) vertices
  let a = (theta - phi0) % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  const k = Math.floor(a / stepAng);
  const r0 = k % 2 === 0 ? R : R * inner; // vertex at k*stepAng
  const r1 = k % 2 === 0 ? R * inner : R; // vertex at (k+1)*stepAng
  const a0 = k * stepAng;
  const a1 = (k + 1) * stepAng;
  const x0 = r0 * Math.cos(a0);
  const y0 = r0 * Math.sin(a0);
  const x1 = r1 * Math.cos(a1);
  const y1 = r1 * Math.sin(a1);
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const ex = x1 - x0;
  const ey = y1 - y0;
  const denom = dx * ey - dy * ex;
  if (Math.abs(denom) < 1e-9) return r0;
  return (x0 * ey - y0 * ex) / denom; // distance along the ray to the edge
}

// The shape's edge radius at a given angle — circle, polygon, or star.
function shapeRadius(shape: ShapeDef, theta: number, R: number): number {
  if (shape.kind === "circle") return R;
  const sides = shape.sides ?? 3;
  const phi0 = shape.phi0 ?? 0;
  if (shape.kind === "star") {
    return starRadius(sides, phi0, shape.inner ?? 0.45, theta, R);
  }
  return polyRadius(sides, phi0, theta, R);
}

/**
 * Draw one frame of the field into `ctx`, filling the logical box [0,size]².
 * The caller owns the canvas: for a crisp HiDPI preview, scale the context by
 * devicePixelRatio and pass the CSS size; for an exact-pixel PNG export, use an
 * identity transform and pass the pixel size (e.g. 500 or 1000). Density is keyed
 * to `size`, so the composition reads identically at every scale.
 */
export function renderShapeField(
  ctx: CanvasRenderingContext2D,
  size: number,
  palette: Palette,
  shape: ShapeDef,
  background: Background,
): void {
  ctx.clearRect(0, 0, size, size);
  if (background === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
  } else if (background === "black") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
  }
  if (size <= 0) return;

  const sx = shape.sx ?? 1;
  const sy = shape.sy ?? 1;
  const cell = Math.max(BASE_CELL, Math.sqrt((size * size) / MAX_DOTS));
  const dotSize = cell * DOT_RATIO;
  const half = dotSize / 2;
  const edgeNoise = cell * EDGE_NOISE_RATIO;

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
  const radius = size / 2 - size * MARGIN_FRAC;
  const cols = Math.ceil(size / cell);

  // Sample the canonical disc; pour each pixel into the chosen shape. Adjacent
  // cells usually share a quantised colour, so only touch fillStyle on a change.
  let lastFill = "";
  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < cols; i++) {
      const px = i * cell + cell / 2;
      const py = j * cell + cell / 2;
      const nx = (px - center) / radius;
      const ny = (py - center) / radius;
      const d = Math.hypot(nx, ny);
      if (d > 1) continue; // every cell inside the disc is filled — no dropout

      const cx = Math.min(off.width - 1, Math.floor(px * samp));
      const cy = Math.min(off.height - 1, Math.floor(py * samp));
      const p = (cy * off.width + cx) * 4;
      const r = data[p] & 0xf8;
      const g = data[p + 1] & 0xf8;
      const b = data[p + 2] & 0xf8;

      // Soft anti-aliased rim, feathered by radius so it lands on the boundary
      // of whatever shape this pixel maps into.
      let alpha = d <= EDGE0 ? 1 : (1 - d) / (1 - EDGE0);
      alpha = Math.round(alpha * 5) / 5;
      if (alpha <= 0) continue;

      const theta = Math.atan2(ny, nx);
      const rad = d * shapeRadius(shape, theta, radius);
      const jx = (Math.random() - 0.5) * 2 * edgeNoise;
      const jy = (Math.random() - 0.5) * 2 * edgeNoise;
      const x = center + Math.cos(theta) * rad * sx + jx;
      const y = center + Math.sin(theta) * rad * sy + jy;

      const fill = `rgba(${r},${g},${b},${alpha})`;
      if (fill !== lastFill) {
        ctx.fillStyle = fill;
        lastFill = fill;
      }
      ctx.fillRect(x - half, y - half, dotSize, dotSize);
    }
  }
}
