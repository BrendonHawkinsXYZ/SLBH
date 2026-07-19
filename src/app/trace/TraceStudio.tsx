"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_TRACE,
  luminanceMap,
  otsuThreshold,
  traceImage,
  traceToSvg,
  type TraceOptions,
  type TraceResult,
} from "@/lib/imageTrace";

// Sources larger than this are downscaled before tracing — plenty for a logo,
// and it keeps a re-trace comfortably under a slider-drag frame budget.
const MAX_WORK_SIZE = 1600;

type Source = {
  lum: Uint8Array;
  w: number;
  h: number;
  label: string;
};

type Ground = "transparent" | "white" | "black";
const GROUNDS: { id: Ground; label: string }[] = [
  { id: "transparent", label: "Checker" },
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
];

type DialSpec = { id: keyof TraceOptions; label: string; min: number; max: number; step: number };
const DIALS: DialSpec[] = [
  { id: "threshold", label: "Threshold", min: 1, max: 254, step: 1 },
  { id: "despeckle", label: "Despeckle", min: 0, max: 150, step: 1 },
  { id: "smoothing", label: "Smoothing", min: 0.2, max: 6, step: 0.1 },
  { id: "simplify", label: "Simplify", min: 0.2, max: 3, step: 0.1 },
  { id: "cornerAngle", label: "Corner angle", min: 30, max: 160, step: 1 },
];

function formatDial(spec: DialSpec, v: number): string {
  if (spec.id === "cornerAngle") return `${Math.round(v)}°`;
  if (spec.step >= 1) return String(Math.round(v));
  return v.toFixed(1);
}

// Deterministic PRNG for the built-in sample sketch.
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A plausible "scanned sketch": rough-edged mark, a knockout, dust, a stroke. */
function drawSampleSketch(ctx: CanvasRenderingContext2D, S: number): void {
  const rnd = mulberry32(20260719);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, S, S);
  const cx = S * 0.5;
  const cy = S * 0.46;

  // Five-petal mark with a jittered, hand-drawn edge.
  ctx.fillStyle = "#161616";
  ctx.beginPath();
  const N = 720;
  for (let i = 0; i <= N; i++) {
    const th = (i / N) * Math.PI * 2;
    const petal = 0.56 + 0.44 * Math.pow(Math.abs(Math.cos(th * 2.5)), 0.85);
    const r = S * 0.34 * petal * (1 + (rnd() - 0.5) * 0.05);
    const x = cx + Math.cos(th) * r;
    const y = cy + Math.sin(th) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Knockout — a counter, so the trace has to keep a hole.
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(cx + S * 0.02, cy - S * 0.01, S * 0.075, S * 0.06, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // A gestural underline stroke.
  ctx.strokeStyle = "#2c2c2c";
  ctx.lineWidth = S * 0.015;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(S * 0.16, S * 0.84);
  ctx.bezierCurveTo(S * 0.34, S * 0.95, S * 0.62, S * 0.9, S * 0.85, S * 0.79);
  ctx.stroke();

  // Scanner dust — some dark enough to trace, for Despeckle to eat.
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = rnd() < 0.5 ? "#555555" : "#c4c4c4";
    ctx.beginPath();
    ctx.arc(rnd() * S, rnd() * S, 0.6 + rnd() * 1.7, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function TraceStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  // The downscaled source bitmap, kept for the ghost underlay.
  const workRef = useRef<HTMLCanvasElement | null>(null);

  const [src, setSrc] = useState<Source | null>(null);
  const [opts, setOpts] = useState<TraceOptions>(DEFAULT_TRACE);
  const [result, setResult] = useState<TraceResult | null>(null);
  const [fill, setFill] = useState("#0A0A0A");
  const [ground, setGround] = useState<Ground>("transparent");
  const [ghost, setGhost] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const setOpt = useCallback((id: keyof TraceOptions, v: number | boolean) => {
    setOpts((prev) => ({ ...prev, [id]: v }));
  }, []);

  // ── Source loading ──
  const adoptCanvas = useCallback((work: HTMLCanvasElement, label: string) => {
    const ctx = work.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const img = ctx.getImageData(0, 0, work.width, work.height);
    const lum = luminanceMap(img);
    workRef.current = work;
    setOpts((prev) => ({ ...prev, threshold: otsuThreshold(lum), invert: false }));
    setSrc({ lum, w: work.width, h: work.height, label });
  }, []);

  const loadBlob = useCallback(
    async (blob: Blob, label: string) => {
      try {
        const bmp = await createImageBitmap(blob);
        const scale = Math.min(1, MAX_WORK_SIZE / Math.max(bmp.width, bmp.height));
        const w = Math.max(1, Math.round(bmp.width * scale));
        const h = Math.max(1, Math.round(bmp.height * scale));
        const work = document.createElement("canvas");
        work.width = w;
        work.height = h;
        const ctx = work.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(bmp, 0, 0, w, h);
        bmp.close();
        adoptCanvas(work, label);
      } catch {
        // Not a decodable image — ignore.
      }
    },
    [adoptCanvas],
  );

  const loadSample = useCallback(() => {
    const S = 900;
    const work = document.createElement("canvas");
    work.width = work.height = S;
    const ctx = work.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    drawSampleSketch(ctx, S);
    adoptCanvas(work, "Sample sketch");
  }, [adoptCanvas]);

  // Auto-load the sample so the instrument opens alive, not empty.
  useEffect(() => {
    let cancelled = false;
    // Defer a tick so the first paint isn't blocked by the trace.
    const t = window.setTimeout(() => {
      if (!cancelled) loadSample();
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [loadSample]);

  // Paste an image anywhere on the page.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/"),
      );
      const file = item?.getAsFile();
      if (file) loadBlob(file, "Pasted image");
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [loadBlob]);

  // ── Trace: debounced re-run on any source/param change. ──
  useEffect(() => {
    if (!src) return;
    const t = window.setTimeout(() => {
      setResult(traceImage(src.lum, src.w, src.h, opts));
    }, 60);
    return () => window.clearTimeout(t);
  }, [src, opts]);

  // ── Preview: ghost source under the traced vector, DPR-crisp. ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const render = () => {
      raf = 0;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW <= 0 || cssH <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      const scale = Math.min(cssW / result.width, cssH / result.height);
      const ox = (cssW - result.width * scale) / 2;
      const oy = (cssH - result.height * scale) / 2;
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
      ctx.clearRect(0, 0, result.width, result.height);
      if (ghost && workRef.current) {
        ctx.globalAlpha = 0.16;
        ctx.drawImage(workRef.current, 0, 0);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = fill;
      ctx.fill(new Path2D(result.d), "evenodd");
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(canvas);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [result, fill, ghost]);

  // ── Actions ──
  const autoThreshold = useCallback(() => {
    if (src) setOpt("threshold", otsuThreshold(src.lum));
  }, [src, setOpt]);

  const copySvg = useCallback(() => {
    if (!result) return;
    navigator.clipboard?.writeText(traceToSvg(result, fill)).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      },
      () => {},
    );
  }, [result, fill]);

  const download = useCallback((blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportSvg = useCallback(() => {
    if (!result || !result.d) return;
    const svg = traceToSvg(result, fill);
    download(new Blob([svg], { type: "image/svg+xml" }), `slbh-trace-${result.width}x${result.height}.svg`);
  }, [result, fill, download]);

  // Transparent-background PNG at an integer multiple of the working size.
  const exportPng = useCallback(
    (scale: number) => {
      if (!result || !result.d) return;
      const c = document.createElement("canvas");
      c.width = result.width * scale;
      c.height = result.height * scale;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.fillStyle = fill;
      ctx.fill(new Path2D(result.d), "evenodd");
      c.toBlob((blob) => {
        if (blob) download(blob, `slbh-trace-${c.width}x${c.height}.png`);
      }, "image/png");
    },
    [result, fill, download],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) loadBlob(file, file.name);
    },
    [loadBlob],
  );

  const canExport = !!result && result.d.length > 0;

  return (
    <section className="trc">
      <div className="container-page trc-head">
        <p className="t-mono trc-kicker">SHAPES / TRACE</p>
        <h1 className="t-h1 trc-title">Image trace instrument</h1>
        <p className="trc-deck">
          Illustrator&rsquo;s Image Trace, in the browser. Drop in a sketch or a
          scan, tune threshold, despeckle and smoothing, and the mark is refit as
          smooth vector curves — exported as an SVG or a transparent PNG.
          Everything runs on your machine; nothing is uploaded.
        </p>
      </div>

      <div className="container-page trc-grid">
        {/* ── Preview stage ── */}
        <div className="trc-stage">
          <div
            className={`trc-frame trc-bg-${ground}`}
            data-drag={dragging || undefined}
            style={{
              aspectRatio: src ? `${src.w} / ${src.h}` : "4 / 3",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <canvas ref={canvasRef} className="trc-canvas" aria-label="Traced vector preview" />
            <div className="trc-drop-hint" aria-hidden>
              <span className="t-mono">DROP IMAGE</span>
            </div>
          </div>
          <div className="trc-meta">
            <span className="t-mono trc-meta-text">
              {src ? `${src.label.toUpperCase()} · ${src.w}×${src.h}` : "LOADING"}
              {result ? ` · ${result.loops} PATHS · ${result.anchors} ANCHORS` : ""}
            </span>
            <button type="button" className="t-mono trc-mini" onClick={copySvg} disabled={!canExport}>
              {copied ? "Copied ✓" : "Copy SVG"}
            </button>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="trc-controls">
          {/* Source */}
          <fieldset className="trc-field">
            <legend className="t-label trc-legend">Source</legend>
            <div className="trc-source">
              <button type="button" className="trc-btn" onClick={() => fileRef.current?.click()}>
                Upload image
              </button>
              <button type="button" className="trc-btn" onClick={loadSample}>
                Load sample
              </button>
            </div>
            <p className="trc-hint">…or drop an image on the preview, or paste one anywhere.</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="trc-file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) loadBlob(file, file.name);
                e.target.value = "";
              }}
            />
          </fieldset>

          {/* Trace dials */}
          <fieldset className="trc-field">
            <div className="trc-legend-row">
              <legend className="t-label trc-legend">Trace</legend>
              <button type="button" className="t-mono trc-mini" onClick={autoThreshold}>
                Auto threshold
              </button>
            </div>
            <div className="trc-dials">
              {DIALS.map((spec) => (
                <label key={spec.id} className="trc-dial">
                  <span className="trc-dial-head">
                    <span className="trc-dial-label">{spec.label}</span>
                    <span className="t-mono trc-dial-val">
                      {formatDial(spec, opts[spec.id] as number)}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={spec.min}
                    max={spec.max}
                    step={spec.step}
                    value={opts[spec.id] as number}
                    onChange={(e) => setOpt(spec.id, parseFloat(e.target.value))}
                  />
                </label>
              ))}
            </div>
            <label className="trc-check">
              <input
                type="checkbox"
                checked={opts.invert}
                onChange={(e) => setOpt("invert", e.target.checked)}
              />
              <span>Invert — trace light marks on a dark ground</span>
            </label>
          </fieldset>

          {/* Ink */}
          <fieldset className="trc-field">
            <legend className="t-label trc-legend">Ink</legend>
            <div className="trc-ink">
              <label className="trc-swatch-well" style={{ background: fill }}>
                <input
                  type="color"
                  value={fill}
                  onChange={(e) => setFill(e.target.value)}
                  aria-label="Ink colour"
                />
              </label>
              <span className="t-mono trc-ink-hex">{fill.toUpperCase()}</span>
            </div>
          </fieldset>

          {/* Preview */}
          <fieldset className="trc-field">
            <legend className="t-label trc-legend">Preview</legend>
            <div className="trc-seg">
              {GROUNDS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className="trc-seg-btn"
                  data-active={g.id === ground}
                  aria-pressed={g.id === ground}
                  onClick={() => setGround(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <label className="trc-check">
              <input type="checkbox" checked={ghost} onChange={(e) => setGhost(e.target.checked)} />
              <span>Ghost the source under the trace</span>
            </label>
          </fieldset>

          {/* Export */}
          <fieldset className="trc-field">
            <legend className="t-label trc-legend">Export</legend>
            <div className="trc-export">
              <button type="button" className="trc-btn trc-btn-primary" onClick={exportSvg} disabled={!canExport}>
                SVG
              </button>
              <button type="button" className="trc-btn" onClick={() => exportPng(1)} disabled={!canExport}>
                PNG {src ? `${src.w} × ${src.h}` : "1×"}
              </button>
              <button type="button" className="trc-btn" onClick={() => exportPng(2)} disabled={!canExport}>
                PNG {src ? `${src.w * 2} × ${src.h * 2}` : "2×"}
              </button>
            </div>
            <p className="trc-hint">PNG exports keep a transparent background.</p>
          </fieldset>
        </div>
      </div>

      <style>{`
        .trc { padding-top: 40px; padding-bottom: 96px; }
        .trc-head { padding-top: 16px; padding-bottom: 40px; }
        .trc-kicker { opacity: 0.55; margin: 0 0 18px; letter-spacing: 0.18em; }
        .trc-title { margin: 0 0 18px; }
        .trc-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300; font-size: 16px; line-height: 1.55;
          max-width: 560px; opacity: 0.72; margin: 0;
        }

        .trc-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
        @media (min-width: 900px) {
          .trc-grid { grid-template-columns: minmax(0, 1fr) minmax(340px, 440px); gap: 64px; }
        }

        /* ── Preview ── */
        .trc-stage { position: sticky; top: 88px; display: flex; flex-direction: column; gap: 16px; }
        .trc-frame {
          position: relative; width: 100%; max-height: 74vh; margin-inline: auto;
          border: 0.5px solid var(--hairline-strong); overflow: hidden;
          transition: border-color var(--d-fast) var(--ease-out);
        }
        .trc-frame[data-drag] { border-color: var(--ground); box-shadow: inset 0 0 0 1px var(--ground); }
        .trc-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .trc-bg-white { background: #ffffff; }
        .trc-bg-black { background: #000000; }
        .trc-bg-transparent {
          background-color: #e7e7e7;
          background-image:
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%),
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%);
          background-size: 22px 22px;
          background-position: 0 0, 11px 11px;
        }
        .trc-drop-hint {
          position: absolute; inset: 0; display: none;
          align-items: center; justify-content: center;
          background: rgba(243, 242, 242, 0.82); pointer-events: none;
        }
        .trc-frame[data-drag] .trc-drop-hint { display: flex; }
        .trc-meta { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .trc-meta-text { opacity: 0.6; }

        /* ── Controls ── */
        .trc-controls { display: flex; flex-direction: column; gap: 30px; }
        .trc-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .trc-legend-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .trc-legend { padding: 0; opacity: 0.72; }
        .trc-field > .trc-legend { margin-bottom: 14px; }
        .trc-mini {
          background: none; border: none; cursor: pointer; color: var(--ground);
          opacity: 0.6; padding: 0; letter-spacing: 0.08em;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .trc-mini:hover { opacity: 1; }
        .trc-mini:disabled { opacity: 0.25; cursor: default; }

        .trc-source { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .trc-hint {
          margin: 12px 0 0; font-family: var(--font-inter), sans-serif;
          font-weight: 300; font-size: 12px; opacity: 0.5;
        }
        .trc-file { display: none; }

        /* Dials */
        .trc-dials { display: flex; flex-direction: column; gap: 16px; }
        .trc-dial { display: flex; flex-direction: column; gap: 7px; }
        .trc-dial-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .trc-dial-label { font-family: var(--font-inter), sans-serif; font-weight: 400; font-size: 13px; opacity: 0.85; }
        .trc-dial-val { opacity: 0.55; }
        .trc-dial input[type="range"] {
          -webkit-appearance: none; appearance: none; width: 100%; height: 2px;
          background: var(--hairline-strong); accent-color: var(--ground); cursor: pointer;
        }
        .trc-check {
          display: flex; align-items: center; gap: 10px; margin-top: 16px;
          font-family: var(--font-inter), sans-serif; font-size: 13px; opacity: 0.85; cursor: pointer;
        }
        .trc-check input { accent-color: var(--ground); width: 15px; height: 15px; cursor: pointer; flex-shrink: 0; }

        /* Ink */
        .trc-ink { display: flex; align-items: center; gap: 12px; }
        .trc-swatch-well {
          position: relative; width: 44px; height: 32px; flex-shrink: 0;
          border: 0.5px solid var(--hairline-strong); cursor: pointer; overflow: hidden;
        }
        .trc-swatch-well input[type="color"] {
          position: absolute; inset: -4px; width: calc(100% + 8px); height: calc(100% + 8px);
          padding: 0; border: none; background: none; cursor: pointer; opacity: 0;
        }
        .trc-ink-hex { opacity: 0.7; }

        /* Segmented */
        .trc-seg { display: grid; grid-template-columns: repeat(3, 1fr); border: 0.5px solid var(--hairline-strong); }
        .trc-seg-btn {
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 8px;
          background: transparent; color: var(--ground); border: none; border-right: 0.5px solid var(--hairline-strong);
          cursor: pointer; transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .trc-seg-btn:last-child { border-right: none; }
        .trc-seg-btn:hover { background: var(--hairline); }
        .trc-seg-btn[data-active="true"] { background: var(--ground); color: var(--signal); }

        /* Buttons */
        .trc-btn {
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase; padding: 14px 12px;
          border: 1px solid var(--ground); background: transparent; color: var(--ground); cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out), opacity var(--d-fast) var(--ease-out);
        }
        .trc-btn:hover { background: var(--ground); color: var(--signal); }
        .trc-btn:disabled { opacity: 0.35; cursor: default; }
        .trc-btn:disabled:hover { background: transparent; color: var(--ground); }
        .trc-btn-primary { background: var(--ground); color: var(--signal); }
        .trc-btn-primary:hover { opacity: 0.85; }
        .trc-export { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 480px) { .trc-export { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </section>
  );
}
