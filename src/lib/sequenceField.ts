/**
 * sequenceField — the Field mosaic as a morphing sequence, for the /chroma video
 * tool. Same idea as the home Field's shape morph, generalised: given an ordered
 * list of resolved shapes (each with its own palette), it samples the canonical
 * disc once, precomputes every pixel's home position, alpha, and colour in each
 * shape, then renders an interpolated frame at any timeline progress. Position,
 * alpha (so hollow shapes fade their centres), and colour all crossfade, so a
 * slot's palette dissolves into the next as the form transforms.
 *
 * Built once at the export resolution; the preview draws the same field through
 * a scaled context, so the loop you see is exactly the clip you download.
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

export type Slot = { shape: RenderShape; palette: Palette };

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class SequenceField {
  private count = 0;
  private size: number;
  private cell: number;
  private dotSize: number;
  private jx = new Float32Array(0);
  private jy = new Float32Array(0);
  // Per-slot, per-pixel state (colour-stable jitter shared across slots).
  private homeX: Float32Array[] = [];
  private homeY: Float32Array[] = [];
  private alpha: Float32Array[] = [];
  private cr: Uint8Array[] = [];
  private cg: Uint8Array[] = [];
  private cb: Uint8Array[] = [];

  readonly slots: number;

  constructor(size: number, slots: Slot[], pixelScale = 1) {
    this.size = size;
    this.slots = slots.length;
    const scale = Math.min(6, Math.max(0.5, pixelScale));
    this.cell = Math.max(BASE_CELL, Math.sqrt((size * size) / MAX_DOTS)) * scale;
    this.dotSize = this.cell * DOT_RATIO;
    this.build(slots);
  }

  private build(slots: Slot[]) {
    const { size, cell } = this;
    const center = size / 2;
    const radius = size / 2 - size * MARGIN_FRAC;
    const cols = Math.ceil(size / cell);
    const edgeNoise = cell * EDGE_NOISE_RATIO;

    // Canonical disc sample (shared by every slot).
    const theta: number[] = [];
    const dist: number[] = [];
    const jxArr: number[] = [];
    const jyArr: number[] = [];
    const sxList: number[] = [];
    const syList: number[] = [];
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
        sxList.push(px); // remember the canvas position for colour sampling
        syList.push(py);
      }
    }
    const n = theta.length;
    this.count = n;
    this.jx = Float32Array.from(jxArr);
    this.jy = Float32Array.from(jyArr);

    this.homeX = [];
    this.homeY = [];
    this.alpha = [];
    this.cr = [];
    this.cg = [];
    this.cb = [];

    for (const slot of slots) {
      const { shape, palette } = slot;
      const sx = shape.sx ?? 1;
      const sy = shape.sy ?? 1;
      const hole = shape.hole ?? 0;

      // Colour: sample this slot's radial gradient at each pixel's disc position.
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
        HX[k] = center + Math.cos(th) * rad * sx + this.jx[k];
        HY[k] = center + Math.sin(th) * rad * sy + this.jy[k];

        let a = d <= EDGE0 ? 1 : (1 - d) / (1 - EDGE0);
        if (hole > 0) {
          const inner = (d - hole) / INNER_FEATHER;
          if (inner < a) a = inner;
        }
        A[k] = a < 0 ? 0 : a;

        if (data) {
          const cx = Math.min(off.width - 1, Math.floor(sxList[k] * samp));
          const cy = Math.min(off.height - 1, Math.floor(syList[k] * samp));
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
   * Draw the field centred at (cx, cy) for a timeline `progress` in [0,1).
   * `hold` is the fraction of each slot spent steady before morphing to the next.
   */
  render(ctx: CanvasRenderingContext2D, cx: number, cy: number, progress: number, hold = 0.45) {
    const N = this.slots;
    if (N === 0) return;
    const p = ((progress % 1) + 1) % 1;
    const slotF = p * N;
    const seg = Math.floor(slotF) % N;
    const local = slotF - Math.floor(slotF);
    let e: number;
    let next: number;
    if (N === 1 || local < hold) {
      e = 0;
      next = seg;
    } else {
      e = easeInOut((local - hold) / (1 - hold));
      next = (seg + 1) % N;
    }

    const offX = cx - this.size / 2;
    const offY = cy - this.size / 2;
    const half = this.dotSize / 2;
    const dot = this.dotSize;

    const ax = this.homeX[seg];
    const ay = this.homeY[seg];
    const bx = this.homeX[next];
    const by = this.homeY[next];
    const aa = this.alpha[seg];
    const ba = this.alpha[next];
    const ar = this.cr[seg];
    const ag = this.cg[seg];
    const ab = this.cb[seg];
    const nr = this.cr[next];
    const ng = this.cg[next];
    const nb = this.cb[next];

    let lastFill = "";
    for (let k = 0; k < this.count; k++) {
      let a = aa[k] + (ba[k] - aa[k]) * e;
      a = Math.round(a * 5) / 5;
      if (a <= 0) continue;
      const x = ax[k] + (bx[k] - ax[k]) * e + offX;
      const y = ay[k] + (by[k] - ay[k]) * e + offY;
      const r = (ar[k] + (nr[k] - ar[k]) * e) & 0xf8;
      const g = (ag[k] + (ng[k] - ag[k]) * e) & 0xf8;
      const b = (ab[k] + (nb[k] - ab[k]) * e) & 0xf8;
      const fill = `rgba(${r},${g},${b},${a})`;
      if (fill !== lastFill) {
        ctx.fillStyle = fill;
        lastFill = fill;
      }
      ctx.fillRect(x - half, y - half, dot, dot);
    }
  }
}
