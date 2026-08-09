/**
 * shapeField — the generative "Field" mosaic, as a reusable, static renderer,
 * driven by a small set of parametric shape *families* with live dials.
 *
 * Same method the home Field (FieldSphere) uses: a dense grid of small coloured
 * squares sampled from a radial gradient (a fresh palette drawn from the curated
 * affect range), poured into a shape. This module is the still, deterministic
 * core — given a palette, a resolved shape, and a background, it draws one frame
 * faithfully at any pixel size (preview == export).
 *
 * A shape is a normalised polar radius function `unit(theta) -> [0,1]` (1 = the
 * circumradius). Rather than a fixed list, shapes come from FAMILIES — Polygon,
 * Star, Spike, Rose, Superellipse, Gear, Heart, Round — each exposing a few
 * numeric params (sides, points, inner radius, sharpness, …). Universal
 * MODIFIERS compose on top of any family: rotation, x/y stretch, a hollow centre,
 * and a wobble that warps any form into novel, organic (non-geometric) shapes.
 * `resolveShape()` bakes a family + params + modifiers into the `unit`/hole/sx/sy
 * the renderer needs.
 */

import { AFFECT_PALETTE } from "@/lib/affectPalette";

// Mosaic constants, shared with the video sequencer so both renderers match.
export const BASE_CELL = 2.2; // smallest pixel cell, logical px
export const MAX_DOTS = 46000; // dot budget — keeps density matched to the home Field
export const DOT_RATIO = 0.82; // pixel size as a fraction of the cell (the rest is the gap)
export const MARGIN_FRAC = 0.05; // inset from the canvas box, as a fraction of size
export const EDGE0 = 0.975; // soft-edge feather starts here (fraction of the shape radius)
export const INNER_FEATHER = 0.03; // soft inner rim for hollow shapes, in disc-radius units
// Per-dot jitter as a fraction of the cell, so the mosaic keeps the same tight
// lattice at every render size. The home Field uses a fixed 0.5px nudge, which
// is ≈0.13·cell at desktop sizes — enough to avoid a sterile grid, small enough
// that dots stay on the lattice and read as a near-solid mass (not a stipple).
export const EDGE_NOISE_RATIO = 0.13;

export type Background = "white" | "black" | "transparent";

// ── Boundary builders. Each returns a normalised unit(theta) with max ≈ 1. ──

// Regular n-gon (circumradius 1, orientation phi0): apothem / cos(offset-in-edge).
function polygonUnit(sides: number, phi0: number): (t: number) => number {
  const seg = (2 * Math.PI) / sides;
  const apothem = Math.cos(Math.PI / sides);
  return (t) => {
    let a = (t - phi0) % seg;
    if (a < 0) a += seg;
    return apothem / Math.cos(a - seg / 2);
  };
}

// n-pointed star (outer 1, inner `inner`) — a 2n-gon of alternating radii; find
// where the ray at theta crosses the current straight edge.
function starUnit(points: number, phi0: number, inner: number): (t: number) => number {
  const step = Math.PI / points;
  return (t) => {
    let a = (t - phi0) % (2 * Math.PI);
    if (a < 0) a += 2 * Math.PI;
    const k = Math.floor(a / step);
    const r0 = k % 2 === 0 ? 1 : inner;
    const r1 = k % 2 === 0 ? inner : 1;
    const a0 = k * step;
    const a1 = (k + 1) * step;
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
    return (x0 * ey - y0 * ex) / denom;
  };
}

// Pinched star: sharp cusps at the points (the angle folds back at each point);
// edges bow inward for power>1, outward (inflated) for power<1. `inner` sets how
// deep the valleys cut.
function spikeStarUnit(
  points: number,
  phi0: number,
  inner: number,
  power: number,
): (t: number) => number {
  const seg = (2 * Math.PI) / points;
  return (t) => {
    let a = (t - phi0) % seg;
    if (a < 0) a += seg;
    const f = Math.abs(a - seg / 2) / (seg / 2); // 1 at a point, 0 at a valley
    return inner + (1 - inner) * Math.pow(f, power);
  };
}

// Rose curve: |cos(k·theta)|^power. `petals` rounded lobes — fattened into a
// flower for power<1, thinned for power>1.
function roseUnit(petals: number, phi0: number, power: number): (t: number) => number {
  const k = petals / 2;
  return (t) => Math.pow(Math.abs(Math.cos(k * (t - phi0))), power);
}

// Superellipse: |cos|^n + |sin|^n = 1, normalised so the farthest point reaches 1.
// One dial spans astroid (n<1) → diamond (1) → circle (2) → squircle → square.
function superellipseUnit(n: number, phi0: number): (t: number) => number {
  const corner = Math.pow(2, 0.5 - 1 / n); // raw radius at the 45° corner
  const norm = Math.max(1, corner); // points lie on the axes when n<1, on corners when n>1
  return (t) => {
    const a = t - phi0;
    const c = Math.abs(Math.cos(a));
    const s = Math.abs(Math.sin(a));
    const raw = 1 / Math.pow(Math.pow(c, n) + Math.pow(s, n), 1 / n);
    return raw / norm;
  };
}

// Gear / cog: a base circle with `teeth` square-wave radial bumps.
function gearUnit(
  teeth: number,
  phi0: number,
  base: number,
  duty: number,
): (t: number) => number {
  const period = (2 * Math.PI) / teeth;
  return (t) => {
    let a = (t - phi0) % period;
    if (a < 0) a += period;
    return a / period < duty ? 1 : base;
  };
}

// Sample a parametric closed curve into a normalised polar lookup table (max 1),
// measured from the curve's centroid. Used for shapes with no tidy r(theta).
function buildPolarLUT(
  param: (t: number) => [number, number],
  samples: number,
  bins: number,
): Float32Array {
  const xs = new Float64Array(samples);
  const ys = new Float64Array(samples);
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < samples; i++) {
    const [x, y] = param((i / samples) * 2 * Math.PI);
    xs[i] = x;
    ys[i] = y;
    cx += x;
    cy += y;
  }
  cx /= samples;
  cy /= samples;

  const lut = new Float32Array(bins);
  let maxR = 0;
  for (let i = 0; i < samples; i++) {
    const x = xs[i] - cx;
    const y = ys[i] - cy;
    let ang = Math.atan2(y, x);
    if (ang < 0) ang += 2 * Math.PI;
    const r = Math.hypot(x, y);
    const b = Math.min(bins - 1, Math.floor((ang / (2 * Math.PI)) * bins));
    if (r > lut[b]) lut[b] = r;
    if (r > maxR) maxR = r;
  }
  for (let b = 0; b < bins; b++) {
    if (lut[b] === 0) {
      let lo = b;
      let hi = b;
      while (lut[((lo % bins) + bins) % bins] === 0) lo--;
      while (lut[hi % bins] === 0) hi++;
      lut[b] = (lut[((lo % bins) + bins) % bins] + lut[hi % bins]) / 2;
    }
  }
  for (let b = 0; b < bins; b++) lut[b] /= maxR;
  return lut;
}

function sampleLUT(lut: Float32Array, theta: number): number {
  const bins = lut.length;
  let a = theta % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  const f = (a / (2 * Math.PI)) * bins;
  const i0 = Math.floor(f) % bins;
  const i1 = (i0 + 1) % bins;
  const frac = f - Math.floor(f);
  return lut[i0] * (1 - frac) + lut[i1] * frac;
}

// Classic heart curve, flipped to screen space (y down) so the point sits at the
// bottom. Sampled into a polar LUT once at module load.
const HEART_LUT = buildPolarLUT(
  (t) => {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return [x, -y];
  },
  8192,
  720,
);
function heartUnit(t: number): number {
  return sampleLUT(HEART_LUT, t);
}

// ── Families: a base form + the dials that drive it. ──

export type ParamSpec = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  /** integer dials read better without decimals */
  integer?: boolean;
};

export type ParamValues = Record<string, number>;

export type ShapeFamily = {
  id: string;
  label: string;
  params: ParamSpec[];
  build: (v: ParamValues) => (t: number) => number;
};

const UP = -Math.PI / 2; // default "point up" orientation

const p = (
  id: string,
  label: string,
  min: number,
  max: number,
  step: number,
  def: number,
  integer = false,
): ParamSpec => ({ id, label, min, max, step, default: def, integer });

export const SHAPE_FAMILIES: ShapeFamily[] = [
  { id: "round", label: "Round", params: [], build: () => () => 1 },
  {
    id: "polygon",
    label: "Polygon",
    params: [p("sides", "Sides", 3, 14, 1, 6, true)],
    build: (v) => polygonUnit(v.sides, UP),
  },
  {
    id: "superellipse",
    label: "Superellipse",
    params: [p("n", "Exponent", 0.4, 8, 0.1, 4)],
    build: (v) => superellipseUnit(v.n, 0),
  },
  {
    id: "star",
    label: "Star",
    params: [p("points", "Points", 3, 12, 1, 5, true), p("inner", "Inner radius", 0.1, 0.95, 0.01, 0.4)],
    build: (v) => starUnit(v.points, UP, v.inner),
  },
  {
    id: "spike",
    label: "Spike",
    params: [
      p("points", "Points", 3, 12, 1, 5, true),
      p("inner", "Inner radius", 0.05, 0.9, 0.01, 0.3),
      p("concavity", "Concavity", 0.4, 4, 0.1, 2.2),
    ],
    build: (v) => spikeStarUnit(v.points, UP, v.inner, v.concavity),
  },
  {
    id: "rose",
    label: "Flower",
    params: [p("petals", "Petals", 2, 16, 1, 5, true), p("fatness", "Fatness", 0.2, 3, 0.05, 0.62)],
    build: (v) => roseUnit(v.petals, UP, v.fatness),
  },
  {
    id: "gear",
    label: "Gear",
    params: [
      p("teeth", "Teeth", 4, 24, 1, 12, true),
      p("depth", "Tooth depth", 0.5, 0.95, 0.01, 0.84),
      p("duty", "Tooth width", 0.2, 0.8, 0.02, 0.46),
    ],
    build: (v) => gearUnit(v.teeth, UP, v.depth, v.duty),
  },
  { id: "heart", label: "Heart", params: [], build: () => heartUnit },
];

export function familyById(id: string): ShapeFamily {
  return SHAPE_FAMILIES.find((f) => f.id === id) ?? SHAPE_FAMILIES[0];
}

/** Default param values for a family (every dial at its default). */
export function defaultValues(familyId: string): ParamValues {
  const v: ParamValues = {};
  for (const spec of familyById(familyId).params) v[spec.id] = spec.default;
  return v;
}

// ── Universal modifiers that compose on top of any family. ──

export type Modifiers = {
  rotation: number; // degrees
  stretchX: number; // 0..1
  stretchY: number; // 0..1
  hole: number; // 0..0.85 hollow-centre fraction
  wobble: number; // 0..0.5 radial warp amount
  wobbleFreq: number; // lobes of the warp
  pixelScale: number; // mosaic cell size, ×the home-Field default (1 = default)
};

export const DEFAULT_MODIFIERS: Modifiers = {
  rotation: 0,
  stretchX: 1,
  stretchY: 1,
  hole: 0,
  wobble: 0,
  wobbleFreq: 6,
  pixelScale: 1,
};

export const MODIFIER_SPECS: { transform: ParamSpec[]; effects: ParamSpec[] } = {
  transform: [
    p("rotation", "Rotation", 0, 360, 1, 0, true),
    p("stretchX", "Stretch X", 0.3, 1, 0.01, 1),
    p("stretchY", "Stretch Y", 0.3, 1, 0.01, 1),
  ],
  effects: [
    p("hole", "Hollow", 0, 0.85, 0.01, 0),
    p("wobble", "Wobble", 0, 0.5, 0.01, 0),
    p("wobbleFreq", "Wobble lobes", 2, 16, 1, 6, true),
    p("pixelScale", "Pixel size", 0.6, 4, 0.1, 1),
  ],
};

export type RenderShape = {
  unit: (theta: number) => number;
  hole?: number;
  sx?: number;
  sy?: number;
  /**
   * Mosaic dot size, ×the lattice default. Stretch compresses the lattice along
   * an axis without shrinking the dots, so a hard squeeze fuses them into a
   * smooth gradient and the shape loses its pixels. Callers that stretch hard can
   * pass the compression back here to hold the dot-to-gap ratio. Default 1.
   */
  dotScale?: number;
};

/** Bake a family + params + modifiers into the unit/hole/stretch the renderer needs. */
export function resolveShape(
  familyId: string,
  values: ParamValues,
  mod: Modifiers,
): RenderShape {
  const base = familyById(familyId).build(values);
  const rot = (mod.rotation * Math.PI) / 180;
  const amp = mod.wobble > 0 ? mod.wobble : 0;
  const freq = mod.wobbleFreq;
  const wobbleNorm = 1 + amp; // keep the warped form within the disc
  const unit = (t: number): number => {
    const r = t - rot;
    let u = base(r);
    if (amp > 0) u = (u * (1 + amp * Math.cos(freq * r))) / wobbleNorm;
    return u > 0 ? u : 0;
  };
  return { unit, hole: mod.hole, sx: mod.stretchX, sy: mod.stretchY };
}

// ── Quick-start presets: a family + a few dial settings to begin from. ──

export type Preset = {
  id: string;
  label: string;
  group: string;
  familyId: string;
  values?: ParamValues;
  modifiers?: Partial<Modifiers>;
};

export const PRESETS: Preset[] = [
  { id: "circle", label: "Circle", group: "Basic", familyId: "round" },
  { id: "ellipse", label: "Ellipse", group: "Basic", familyId: "round", modifiers: { stretchY: 0.62 } },
  { id: "ring", label: "Ring", group: "Basic", familyId: "round", modifiers: { hole: 0.52 } },
  { id: "triangle", label: "Triangle", group: "Polygon", familyId: "polygon", values: { sides: 3 } },
  { id: "square", label: "Square", group: "Polygon", familyId: "polygon", values: { sides: 4 }, modifiers: { rotation: 45 } },
  { id: "pentagon", label: "Pentagon", group: "Polygon", familyId: "polygon", values: { sides: 5 } },
  { id: "hexagon", label: "Hexagon", group: "Polygon", familyId: "polygon", values: { sides: 6 } },
  { id: "octagon", label: "Octagon", group: "Polygon", familyId: "polygon", values: { sides: 8 } },
  { id: "diamond", label: "Diamond", group: "Rounded", familyId: "superellipse", values: { n: 1 } },
  { id: "squircle", label: "Squircle", group: "Rounded", familyId: "superellipse", values: { n: 4 } },
  { id: "astroid", label: "Astroid", group: "Rounded", familyId: "superellipse", values: { n: 0.6 } },
  { id: "heart", label: "Heart", group: "Organic", familyId: "heart" },
  { id: "flower", label: "Flower", group: "Organic", familyId: "rose", values: { petals: 5, fatness: 0.62 } },
  { id: "gear", label: "Gear", group: "Organic", familyId: "gear", values: { teeth: 12, depth: 0.84, duty: 0.46 } },
  { id: "blob", label: "Blob", group: "Organic", familyId: "round", modifiers: { wobble: 0.22, wobbleFreq: 7 } },
  { id: "star", label: "Star", group: "Star", familyId: "star", values: { points: 5, inner: 0.4 } },
  { id: "spike", label: "Spike", group: "Star", familyId: "spike", values: { points: 5, inner: 0.3, concavity: 2.2 } },
  { id: "burst", label: "Burst", group: "Star", familyId: "spike", values: { points: 12, inner: 0.55, concavity: 1.2 } },
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

/**
 * Deterministic palette for initial state. Server and client must render the
 * same first frame or hydration fails; callers re-roll with makePalette() in a
 * mount effect to keep the fresh-palette-per-visit behavior.
 */
export function defaultPalette(): Palette {
  const n = AFFECT_PALETTE.length;
  const count = 6;
  const step = 5;
  const stops: Stop[] = [];
  for (let i = 0; i < count; i++) {
    stops.push({ color: AFFECT_PALETTE[(i * step) % n], pct: (i * 96) / (count - 1) });
  }
  return { stops, cx: 46, cy: 38 };
}

/** One mosaic pixel: top-left corner, edge length, quantised colour and alpha. */
type CellEmit = (
  x: number,
  y: number,
  dot: number,
  r: number,
  g: number,
  b: number,
  alpha: number,
) => void;

/**
 * The single pass that builds the mosaic — walk the lattice, pour each cell into
 * the shape, hand the result to `emit`. Every output format (canvas, SVG) is a
 * different consumer of this one pass, so they can never drift apart.
 */
function emitShapeField(
  size: number,
  palette: Palette,
  shape: RenderShape,
  pixelScale: number,
  emit: CellEmit,
): void {
  if (size <= 0) return;

  const sx = shape.sx ?? 1;
  const sy = shape.sy ?? 1;
  const hole = shape.hole ?? 0;
  // Cell sized to match the home Field, scaled by the pixel-size dial (bigger =
  // chunkier mosaic). Clamped so it can't run away into a million dots.
  const scale = Math.min(6, Math.max(0.5, pixelScale));
  const cell = Math.max(BASE_CELL, Math.sqrt((size * size) / MAX_DOTS)) * scale;
  const dotSize = cell * DOT_RATIO * (shape.dotScale ?? 1);
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

  // Sample the canonical disc; pour each pixel into the chosen shape.
  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < cols; i++) {
      const px = i * cell + cell / 2;
      const py = j * cell + cell / 2;
      const nx = (px - center) / radius;
      const ny = (py - center) / radius;
      const d = Math.hypot(nx, ny);
      if (d > 1) continue; // outside the disc
      if (hole > 0 && d < hole) continue; // hollow centre

      const cx = Math.min(off.width - 1, Math.floor(px * samp));
      const cy = Math.min(off.height - 1, Math.floor(py * samp));
      const pi = (cy * off.width + cx) * 4;
      const r = data[pi] & 0xf8;
      const g = data[pi + 1] & 0xf8;
      const b = data[pi + 2] & 0xf8;

      // Soft anti-aliased rim, feathered by radius so it lands on the boundary
      // of whatever shape this pixel maps into — plus a soft inner rim for holes.
      let alpha = d <= EDGE0 ? 1 : (1 - d) / (1 - EDGE0);
      if (hole > 0) {
        const inner = (d - hole) / INNER_FEATHER;
        if (inner < alpha) alpha = inner;
      }
      alpha = Math.round(alpha * 5) / 5;
      if (alpha <= 0) continue;

      const theta = Math.atan2(ny, nx);
      const rad = d * shape.unit(theta) * radius;
      const jx = (Math.random() - 0.5) * 2 * edgeNoise;
      const jy = (Math.random() - 0.5) * 2 * edgeNoise;
      const x = center + Math.cos(theta) * rad * sx + jx;
      const y = center + Math.sin(theta) * rad * sy + jy;

      emit(x - half, y - half, dotSize, r, g, b, alpha);
    }
  }
}

/**
 * Draw one frame of the field into `ctx`, filling the logical box [0,size]².
 * The caller owns the canvas: for a crisp HiDPI preview, scale the context by
 * devicePixelRatio and pass the CSS size; for an exact-pixel PNG export, use an
 * identity transform and pass the pixel size (e.g. 2000). Density is keyed to
 * `size`, so the composition reads identically at every scale.
 */
export function renderShapeField(
  ctx: CanvasRenderingContext2D,
  size: number,
  palette: Palette,
  shape: RenderShape,
  background: Background,
  pixelScale = 1,
): void {
  ctx.clearRect(0, 0, size, size);
  if (background === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
  } else if (background === "black") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
  }

  // Adjacent cells usually share a quantised colour, so only touch fillStyle on
  // a change.
  let lastFill = "";
  emitShapeField(size, palette, shape, pixelScale, (x, y, dot, r, g, b, alpha) => {
    const fill = `rgba(${r},${g},${b},${alpha})`;
    if (fill !== lastFill) {
      ctx.fillStyle = fill;
      lastFill = fill;
    }
    ctx.fillRect(x, y, dot, dot);
  });
}

function hex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Trim coordinates to a tenth of a pixel — invisible, and a third off the file. */
function num(n: number): string {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

/**
 * The same frame as a standalone SVG string, one <rect> per mosaic pixel. Colour
 * and alpha are already quantised by the renderer, so the rects collapse into a
 * handful of <g fill> groups — the file stays editable in any vector tool and
 * scales past the pixel size it was generated at.
 *
 * `size` still sets the density (as it does for canvas) as well as the viewBox,
 * so an SVG generated at 2000 matches the 2000px PNG dot-for-dot.
 */
export function shapeFieldToSvg(
  size: number,
  palette: Palette,
  shape: RenderShape,
  background: Background,
  pixelScale = 1,
): string {
  const groups = new Map<string, string[]>();
  emitShapeField(size, palette, shape, pixelScale, (x, y, dot, r, g, b, alpha) => {
    const key = `${hex(r, g, b)} ${alpha}`;
    let rects = groups.get(key);
    if (!rects) groups.set(key, (rects = []));
    rects.push(
      `<rect x="${num(x)}" y="${num(y)}" width="${num(dot)}" height="${num(dot)}"/>`,
    );
  });

  const out: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
  ];
  if (background !== "transparent") {
    out.push(
      `<rect width="${size}" height="${size}" fill="${background === "white" ? "#ffffff" : "#000000"}"/>`,
    );
  }
  for (const [key, rects] of groups) {
    const [fill, alpha] = key.split(" ");
    const opacity = alpha === "1" ? "" : ` fill-opacity="${alpha}"`;
    out.push(`<g fill="${fill}"${opacity}>`, rects.join(""), `</g>`);
  }
  out.push(`</svg>`);
  return out.join("\n");
}
