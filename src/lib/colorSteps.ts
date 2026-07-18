/**
 * colorSteps — the color-blend engine behind the /steps instrument.
 *
 * Illustrator's Blend tool, distilled to its essence: take a chain of colour
 * stops and generate a run of evenly spaced steps between them (the "Specified
 * Steps" mode), then draw them as flat bands — or as a continuous gradient.
 *
 * Interpolation runs in one of three spaces:
 *   • rgb — straight channel lerp in sRGB. Matches Illustrator's default RGB
 *     blend (a red→white blend passes through clean pinks).
 *   • hsl — walks hue the short way round the wheel; keeps chroma up through
 *     the middle of a blend.
 *   • lab — CIELAB (D65). Perceptually even steps — equal visual jumps — which
 *     is usually what a stepped swatch strip actually wants.
 *
 * The module is framework-free: parsing/interpolation are pure, and the single
 * render function just needs a 2D context, so the same code drives the live
 * preview (DPR-scaled) and the exact-pixel PNG export (preview == export).
 */

export type Space = "rgb" | "hsl" | "lab";
export type Orientation = "horizontal" | "vertical";
export type Mode = "stepped" | "smooth";

type RGB = { r: number; g: number; b: number }; // 0..255

// ── Hex parsing / formatting ──────────────────────────────────────────────

/** Parse #rgb / #rrggbb (with or without the hash) into 0..255 channels. */
export function parseHex(input: string): RGB | null {
  let s = input.trim().replace(/^#/, "");
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  if (s.length !== 6 || /[^0-9a-fA-F]/.test(s)) return null;
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

function clamp255(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

/** Format 0..255 channels as an uppercase #RRGGBB string. */
export function toHex({ r, g, b }: RGB): string {
  const h = (v: number) => clamp255(v).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

/** Normalise any accepted colour string to #RRGGBB, or null if unparseable. */
export function normalizeHex(input: string): string | null {
  const rgb = parseHex(input);
  return rgb ? toHex(rgb) : null;
}

// ── sRGB ↔ CIELAB (D65) ────────────────────────────────────────────────────

function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return clamp255(v * 255);
}

// D65 reference white.
const Xn = 0.95047;
const Yn = 1.0;
const Zn = 1.08883;

type LAB = { L: number; a: number; b: number };

function rgbToLab({ r, g, b }: RGB): LAB {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);
  const X = (rl * 0.4124 + gl * 0.3576 + bl * 0.1805) / Xn;
  const Y = (rl * 0.2126 + gl * 0.7152 + bl * 0.0722) / Yn;
  const Z = (rl * 0.0193 + gl * 0.1192 + bl * 0.9505) / Zn;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(X);
  const fy = f(Y);
  const fz = f(Z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

function labToRgb({ L, a, b }: LAB): RGB {
  const fy = (L + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;
  const fi = (t: number) => {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };
  const X = Xn * fi(fx);
  const Y = Yn * fi(fy);
  const Z = Zn * fi(fz);
  const rl = X * 3.2406 - Y * 1.5372 - Z * 0.4986;
  const gl = -X * 0.9689 + Y * 1.8758 + Z * 0.0415;
  const bl = X * 0.0557 - Y * 0.204 + Z * 1.057;
  return { r: linearToSrgb(rl), g: linearToSrgb(gl), b: linearToSrgb(bl) };
}

// ── sRGB ↔ HSL ──────────────────────────────────────────────────────────────

type HSL = { h: number; s: number; l: number }; // h 0..360, s/l 0..1

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  const d = max - min;
  if (d > 1e-6) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  return { h, s, l };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = ((h % 360) + 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = l - c / 2;
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

// ── Interpolation ─────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Interpolate between two colours at t∈[0,1], in the chosen space. */
function mix(a: RGB, b: RGB, t: number, space: Space): RGB {
  if (t <= 0) return a;
  if (t >= 1) return b;
  if (space === "rgb") {
    return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) };
  }
  if (space === "lab") {
    const la = rgbToLab(a);
    const lb = rgbToLab(b);
    return labToRgb({
      L: lerp(la.L, lb.L, t),
      a: lerp(la.a, lb.a, t),
      b: lerp(la.b, lb.b, t),
    });
  }
  // hsl — walk hue the short way; carry a greyscale endpoint's hue from the other.
  const ha = rgbToHsl(a);
  const hb = rgbToHsl(b);
  let h0 = ha.h;
  let h1 = hb.h;
  if (ha.s < 1e-4) h0 = h1;
  if (hb.s < 1e-4) h1 = h0;
  let dh = h1 - h0;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return hslToRgb({ h: h0 + dh * t, s: lerp(ha.s, hb.s, t), l: lerp(ha.l, hb.l, t) });
}

// ── Ramps ───────────────────────────────────────────────────────────────────

/**
 * Sample the whole multi-stop chain at a global t∈[0,1] — the continuous form
 * used for smooth gradients. t maps evenly across the segments between stops.
 */
export function sampleRamp(stops: string[], t: number, space: Space): string {
  const rgbs = stops.map(parseHex).filter((c): c is RGB => c !== null);
  if (rgbs.length === 0) return "#000000";
  if (rgbs.length === 1) return toHex(rgbs[0]);
  const segs = rgbs.length - 1;
  const scaled = Math.min(Math.max(t, 0), 1) * segs;
  const i = Math.min(Math.floor(scaled), segs - 1);
  return toHex(mix(rgbs[i], rgbs[i + 1], scaled - i, space));
}

/**
 * The discrete swatch run — Illustrator's "Specified Steps". `steps` intermediate
 * colours are inserted between each pair of stops; the stops themselves are kept.
 * A two-stop ramp with steps=5 yields 7 swatches (2 stops + 5 between).
 */
export function buildRamp(stops: string[], steps: number, space: Space): string[] {
  const rgbs = stops.map(parseHex).filter((c): c is RGB => c !== null);
  if (rgbs.length === 0) return [];
  if (rgbs.length === 1) return [toHex(rgbs[0])];
  const n = Math.max(0, Math.round(steps));
  const out: string[] = [];
  for (let s = 0; s < rgbs.length - 1; s++) {
    const a = rgbs[s];
    const b = rgbs[s + 1];
    out.push(toHex(a));
    for (let i = 1; i <= n; i++) out.push(toHex(mix(a, b, i / (n + 1), space)));
  }
  out.push(toHex(rgbs[rgbs.length - 1]));
  return out;
}

/** Total swatch count a stepped ramp will produce, for UI readouts. */
export function swatchCount(stopCount: number, steps: number): number {
  if (stopCount <= 1) return Math.max(stopCount, 0);
  return (stopCount - 1) * (Math.max(0, Math.round(steps)) + 1) + 1;
}

// ── Rendering ─────────────────────────────────────────────────────────────

/** Relative luminance (0..1) for choosing a readable label colour. */
function luminance(hex: string): number {
  const c = parseHex(hex);
  if (!c) return 0;
  return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;
}

export type RampConfig = {
  stops: string[];
  steps: number;
  space: Space;
  mode: Mode;
  orientation: Orientation;
  labels?: boolean;
};

/**
 * Draw a ramp into the logical box [0,w]×[0,h]. The caller owns the canvas:
 * DPR-scale the context for a crisp preview, or use an identity transform at the
 * exact pixel size for a PNG export. Bands land on integer pixel boundaries so
 * flat swatches stay seam-free at any size.
 */
export function renderRamp(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  { stops, steps, space, mode, orientation, labels = false }: RampConfig,
): void {
  ctx.clearRect(0, 0, w, h);
  if (w <= 0 || h <= 0) return;
  const horizontal = orientation === "horizontal";
  const axis = horizontal ? w : h;

  if (mode === "smooth") {
    // One flat slice per pixel along the axis — honours the interpolation space
    // exactly (a canvas gradient would re-interpolate in sRGB between stops).
    const n = Math.max(1, Math.round(axis));
    for (let i = 0; i < n; i++) {
      const t = n <= 1 ? 0 : i / (n - 1);
      ctx.fillStyle = sampleRamp(stops, t, space);
      if (horizontal) ctx.fillRect(i, 0, 1, h);
      else ctx.fillRect(0, i, w, 1);
    }
    return;
  }

  const colors = buildRamp(stops, steps, space);
  const m = colors.length;
  if (m === 0) return;

  for (let k = 0; k < m; k++) {
    const start = Math.floor((k * axis) / m);
    const end = Math.floor(((k + 1) * axis) / m);
    const thick = end - start;
    ctx.fillStyle = colors[k];
    if (horizontal) ctx.fillRect(start, 0, thick, h);
    else ctx.fillRect(0, start, w, thick);

    if (!labels) continue;
    // Optional baked-in hex label, contrast-aware, auto-sized to the band. Skip
    // when the band is too small to hold legible text.
    const bandW = horizontal ? thick : w;
    const bandH = horizontal ? h : thick;
    const size = Math.min(bandH * 0.5, bandW * 0.34, 34);
    if (size < 7) continue;
    ctx.save();
    ctx.fillStyle = luminance(colors[k]) > 0.6 ? "rgba(10,10,10,0.72)" : "rgba(245,245,243,0.92)";
    ctx.font = `500 ${size}px ui-monospace, "SF Mono", Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const cx = horizontal ? start + thick / 2 : w / 2;
    const cy = horizontal ? h / 2 : start + thick / 2;
    ctx.fillText(colors[k], cx, cy);
    ctx.restore();
  }
}
