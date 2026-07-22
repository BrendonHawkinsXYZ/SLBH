/**
 * bloomField — a two-keyframe "seed → bloom" growth morph, built on the same
 * mosaic as the home Field and /chroma's SequenceField. Given a start shape
 * (the seed) and an end shape (the bloom), each with its own palette, it samples
 * the canonical disc once and precomputes every pixel's home position, alpha,
 * and colour in *both* forms, then renders an interpolated frame at any bloom
 * amount `b` in [0,1]:
 *
 *   - form:  crossfades seed → bloom (position, alpha, colour). The seed end is
 *            already nudged `lean` of the way toward the bloom, so a still seed
 *            hints at where it is going (the "inclination").
 *   - scale: grows from `seedScale` (a tiny seed at the centre) up to 1 (full
 *            size), so the seed literally grows into the plant.
 *   - spin:  an optional unfurl — the whole form starts rotated by `spin`° and
 *            untwists to 0 as it opens.
 *
 * `b` is eased internally (easeInOut), so a linear timeline or a linear scrub
 * both read as a natural bloom. Built once at the render size; the preview draws
 * the same field through a scaled context, so what you scrub is what will export.
 */

import {
  BASE_CELL,
  DOT_RATIO,
  EDGE0,
  EDGE_NOISE_RATIO,
  INNER_FEATHER,
  MARGIN_FRAC,
  MAX_DOTS,
  type Palette,
  type RenderShape,
} from "@/lib/shapeField";

export type BloomKeyframe = { shape: RenderShape; palette: Palette };

export type GrowthOptions = {
  /** Seed size at b=0, as a fraction of full size (0.05..0.6). */
  seedScale: number;
  /** How far the seed already leans toward the bloom form at b=0 (0..0.6). */
  lean: number;
  /** Degrees the form is rotated at b=0, untwisting to 0 as it blooms. */
  spin: number;
};

export const DEFAULT_GROWTH: GrowthOptions = {
  seedScale: 0.14,
  lean: 0.16,
  spin: 40,
};

export const GROWTH_SPECS = [
  { id: "seedScale", label: "Seed size", min: 0.05, max: 0.6, step: 0.01, default: 0.14 },
  { id: "lean", label: "Seed lean", min: 0, max: 0.6, step: 0.01, default: 0.16 },
  { id: "spin", label: "Unfurl spin", min: -180, max: 180, step: 1, default: 40, integer: true },
] as const;

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class BloomField {
  private count = 0;
  private size: number;
  private cell: number;
  private dotSize: number;
  // Per-keyframe, per-pixel state (index-aligned; [0] = seed, [1] = bloom).
  private homeX: Float32Array[] = [];
  private homeY: Float32Array[] = [];
  private alpha: Float32Array[] = [];
  private cr: Uint8Array[] = [];
  private cg: Uint8Array[] = [];
  private cb: Uint8Array[] = [];

  constructor(size: number, seed: BloomKeyframe, bloom: BloomKeyframe, pixelScale = 1) {
    this.size = size;
    const scale = Math.min(6, Math.max(0.5, pixelScale));
    this.cell = Math.max(BASE_CELL, Math.sqrt((size * size) / MAX_DOTS)) * scale;
    this.dotSize = this.cell * DOT_RATIO;
    this.build([seed, bloom]);
  }

  private build(frames: BloomKeyframe[]) {
    const { size, cell } = this;
    const center = size / 2;
    const radius = size / 2 - size * MARGIN_FRAC;
    const cols = Math.ceil(size / cell);
    const edgeNoise = cell * EDGE_NOISE_RATIO;

    // Canonical disc sample — shared by both keyframes so dot k pairs up across
    // the morph. Jitter is baked in once so the mosaic lattice stays stable.
    const theta: number[] = [];
    const dist: number[] = [];
    const jxArr: number[] = [];
    const jyArr: number[] = [];
    const pxList: number[] = [];
    const pyList: number[] = [];
    for (let j = 0; j < cols; j++) {
      for (let i = 0; i < cols; i++) {
        const px = i * cell + cell / 2;
        const py = j * cell + cell / 2;
        const nx = (px - center) / radius;
        const ny = (py - center) / radius;
        const d = Math.hypot(nx, ny);
        if (d > 1) continue;
        theta.push(Math.atan2(ny, nx));
        dist.push(d);
        jxArr.push((Math.random() - 0.5) * 2 * edgeNoise);
        jyArr.push((Math.random() - 0.5) * 2 * edgeNoise);
        pxList.push(px);
        pyList.push(py);
      }
    }
    const n = theta.length;
    this.count = n;

    this.homeX = [];
    this.homeY = [];
    this.alpha = [];
    this.cr = [];
    this.cg = [];
    this.cb = [];

    for (const frame of frames) {
      const { shape, palette } = frame;
      const sx = shape.sx ?? 1;
      const sy = shape.sy ?? 1;
      const hole = shape.hole ?? 0;

      // Colour: sample this keyframe's radial gradient at each pixel's disc spot.
      const off = document.createElement("canvas");
      off.width = off.height = Math.max(2, Math.round(size));
      const octx = off.getContext("2d");
      const gx = (palette.cx / 100) * off.width;
      const gy = (palette.cy / 100) * off.height;
      const far = Math.max(
        Math.hypot(gx, gy),
        Math.hypot(off.width - gx, gy),
        Math.hypot(gx, off.height - gy),
        Math.hypot(off.width - gx, off.height - gy),
      );
      let data: Uint8ClampedArray | null = null;
      if (octx) {
        const grad = octx.createRadialGradient(gx, gy, 0, gx, gy, far);
        for (const st of palette.stops) grad.addColorStop(st.pct / 100, st.color);
        octx.fillStyle = grad;
        octx.fillRect(0, 0, off.width, off.height);
        data = octx.getImageData(0, 0, off.width, off.height).data;
      }
      const samp = off.width / size;

      const HX = new Float32Array(n);
      const HY = new Float32Array(n);
      const A = new Float32Array(n);
      const CR = new Uint8Array(n);
      const CG = new Uint8Array(n);
      const CB = new Uint8Array(n);

      for (let k = 0; k < n; k++) {
        const th = theta[k];
        const d = dist[k];
        const rad = d * shape.unit(th) * radius;
        // Store home positions relative to the shape centre, so render() can
        // scale and rotate the whole form about any draw point.
        HX[k] = Math.cos(th) * rad * sx + jxArr[k];
        HY[k] = Math.sin(th) * rad * sy + jyArr[k];

        let a = d <= EDGE0 ? 1 : (1 - d) / (1 - EDGE0);
        if (hole > 0) {
          const inner = (d - hole) / INNER_FEATHER;
          if (inner < a) a = inner;
        }
        A[k] = a < 0 ? 0 : a;

        if (data) {
          const cx = Math.min(off.width - 1, Math.floor(pxList[k] * samp));
          const cy = Math.min(off.height - 1, Math.floor(pyList[k] * samp));
          const p = (cy * off.width + cx) * 4;
          CR[k] = data[p] & 0xf8;
          CG[k] = data[p + 1] & 0xf8;
          CB[k] = data[p + 2] & 0xf8;
        }
      }
      this.homeX.push(HX);
      this.homeY.push(HY);
      this.alpha.push(A);
      this.cr.push(CR);
      this.cg.push(CG);
      this.cb.push(CB);
    }
  }

  /**
   * Draw the bloom centred at (cx, cy) for a bloom amount `b` in [0,1]
   * (0 = seed, 1 = full bloom). `b` is eased internally.
   */
  render(ctx: CanvasRenderingContext2D, cx: number, cy: number, b: number, growth: GrowthOptions) {
    if (this.count === 0) return;
    const bb = b < 0 ? 0 : b > 1 ? 1 : b;
    const k = easeInOut(bb);

    const lean = growth.lean;
    // Form blend: lean at the seed, 1 at the bloom.
    const e = lean + (1 - lean) * k;
    // Scale: seedScale at the seed, 1 at the bloom.
    const s = growth.seedScale + (1 - growth.seedScale) * k;
    // Unfurl: spin° at the seed, untwisting to 0 as it opens.
    const rot = ((growth.spin * Math.PI) / 180) * (1 - k);
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const ax = this.homeX[0];
    const ay = this.homeY[0];
    const bx = this.homeX[1];
    const by = this.homeY[1];
    const aa = this.alpha[0];
    const ba = this.alpha[1];
    const ar = this.cr[0];
    const ag = this.cg[0];
    const ab = this.cb[0];
    const nr = this.cr[1];
    const ng = this.cg[1];
    const nb = this.cb[1];

    const half = this.dotSize / 2;
    const dot = this.dotSize;

    let lastFill = "";
    for (let i = 0; i < this.count; i++) {
      let a = aa[i] + (ba[i] - aa[i]) * e;
      a = Math.round(a * 5) / 5;
      if (a <= 0) continue;

      // Morphed home position (relative to centre), then scaled + rotated.
      const hx = ax[i] + (bx[i] - ax[i]) * e;
      const hy = ay[i] + (by[i] - ay[i]) * e;
      const x = cx + (hx * cosR - hy * sinR) * s;
      const y = cy + (hx * sinR + hy * cosR) * s;

      const r = (ar[i] + (nr[i] - ar[i]) * e) & 0xf8;
      const g = (ag[i] + (ng[i] - ag[i]) * e) & 0xf8;
      const bl = (ab[i] + (nb[i] - ab[i]) * e) & 0xf8;
      const fill = `rgba(${r},${g},${bl},${a})`;
      if (fill !== lastFill) {
        ctx.fillStyle = fill;
        lastFill = fill;
      }
      ctx.fillRect(x - half, y - half, dot, dot);
    }
  }
}
