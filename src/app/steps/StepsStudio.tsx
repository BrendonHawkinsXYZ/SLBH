"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AFFECT_PALETTE } from "@/lib/affectPalette";
import {
  buildRamp,
  normalizeHex,
  renderRamp,
  swatchCount,
  type Mode,
  type Orientation,
  type Space,
} from "@/lib/colorSteps";

const SPACES: { id: Space; label: string; note: string }[] = [
  { id: "rgb", label: "RGB", note: "Illustrator" },
  { id: "lab", label: "LAB", note: "Perceptual" },
  { id: "hsl", label: "HSL", note: "Vivid" },
];

const MODES: { id: Mode; label: string }[] = [
  { id: "stepped", label: "Stepped" },
  { id: "smooth", label: "Smooth" },
];

const ORIENTATIONS: { id: Orientation; label: string }[] = [
  { id: "horizontal", label: "Horizontal" },
  { id: "vertical", label: "Vertical" },
];

const MIN_STOPS = 2;
const MAX_STOPS = 6;

// Quick-start ramps — a couple of endpoints (or a chain) to begin from. The
// first echoes the Illustrator reference; the rest lean on the affect palette.
const PRESETS: { id: string; label: string; stops: string[]; space?: Space }[] = [
  { id: "red-white", label: "Red → White", stops: ["#FF2E2E", "#FFFFFF"], space: "rgb" },
  { id: "ember", label: "Ember", stops: ["#FF5A1F", "#5B2A86"], space: "lab" },
  { id: "signal", label: "Signal", stops: ["#FF3B30", "#FFD000"], space: "lab" },
  { id: "field", label: "Field", stops: ["#A8C5FF", "#2146C7"], space: "lab" },
  { id: "spectrum", label: "Spectrum", stops: ["#FF5A1F", "#FFD000", "#00A676", "#2146C7"], space: "lab" },
  { id: "mono", label: "Mono", stops: ["#0A0A0A", "#F3F2F2"], space: "lab" },
];

// A gradient of hard stops that reads as the stepped strip, for the meta bar.
function bandBar(colors: string[]): string {
  if (colors.length === 0) return "transparent";
  if (colors.length === 1) return colors[0];
  const m = colors.length;
  const parts = colors.map(
    (c, i) => `${c} ${((i / m) * 100).toFixed(3)}% ${(((i + 1) / m) * 100).toFixed(3)}%`,
  );
  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

function randomColor(): string {
  return AFFECT_PALETTE[Math.floor(Math.random() * AFFECT_PALETTE.length)];
}

export function StepsStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Default = the Illustrator reference: a red→white blend, 5 specified steps.
  const [stops, setStops] = useState<string[]>(["#FF2E2E", "#FFFFFF"]);
  const [steps, setSteps] = useState(5);
  const [space, setSpace] = useState<Space>("rgb");
  const [mode, setMode] = useState<Mode>("stepped");
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [labels, setLabels] = useState(false);
  const [copied, setCopied] = useState(false);

  const colors = useMemo(() => buildRamp(stops, steps, space), [stops, steps, space]);
  const total = swatchCount(stops.length, steps);

  // ── Live preview: DPR-crisp, rAF-coalesced, redraws on any change / resize. ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderRamp(ctx, cssW, cssH, { stops, steps, space, mode, orientation, labels });
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
  }, [stops, steps, space, mode, orientation, labels]);

  // ── Stop edits ──
  const setStop = useCallback((i: number, value: string) => {
    setStops((prev) => prev.map((s, k) => (k === i ? value : s)));
  }, []);

  const addStop = useCallback(() => {
    setStops((prev) => {
      if (prev.length >= MAX_STOPS) return prev;
      return [...prev, randomColor()];
    });
  }, []);

  const removeStop = useCallback((i: number) => {
    setStops((prev) => (prev.length <= MIN_STOPS ? prev : prev.filter((_, k) => k !== i)));
  }, []);

  const applyPreset = useCallback((preset: (typeof PRESETS)[number]) => {
    setStops(preset.stops);
    if (preset.space) setSpace(preset.space);
  }, []);

  // Roll a fresh ramp: 2–4 random affect colours.
  const randomize = useCallback(() => {
    const n = 2 + Math.floor(Math.random() * 3);
    const picks: string[] = [];
    while (picks.length < n) {
      const c = randomColor();
      if (!picks.includes(c)) picks.push(c);
    }
    setStops(picks);
  }, []);

  const reverse = useCallback(() => setStops((prev) => [...prev].reverse()), []);

  const copyHex = useCallback(() => {
    navigator.clipboard?.writeText(colors.join(", ")).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      },
      () => {},
    );
  }, [colors]);

  // ── Export: render fresh at exact pixel size, then download a PNG. ──
  const exportPng = useCallback(
    (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      renderRamp(ctx, w, h, { stops, steps, space, mode, orientation, labels });
      c.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `slbh-steps-${space}-${mode}-${total}sw-${w}x${h}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    },
    [stops, steps, space, mode, orientation, labels, total],
  );

  const exportSizes =
    orientation === "horizontal"
      ? [
          { w: 2000, h: 500 },
          { w: 1600, h: 1000 },
        ]
      : [
          { w: 500, h: 2000 },
          { w: 1000, h: 1600 },
        ];

  return (
    <section className="stp">
      <div className="container-page stp-head">
        <p className="t-mono stp-kicker">SHAPES / STEPS</p>
        <h1 className="t-h1 stp-title">Colour step instrument</h1>
        <p className="stp-deck">
          The Illustrator blend, in the browser. Set two or more colour stops,
          choose how many steps sit between them, pick an interpolation space —
          RGB like Illustrator, or LAB for perceptually even steps — and export a
          clean PNG.
        </p>
      </div>

      <div className="container-page stp-grid">
        {/* ── Preview stage ── */}
        <div className="stp-stage">
          <div className="stp-frame" data-orient={orientation === "vertical" ? "v" : "h"}>
            <canvas ref={canvasRef} className="stp-canvas" aria-label="Colour step ramp preview" />
          </div>
          <div className="stp-meta">
            <span className="stp-meta-bar" style={{ background: bandBar(colors) }} aria-hidden />
            <div className="stp-meta-row">
              <span className="t-mono stp-meta-text">
                {steps} STEP{steps === 1 ? "" : "S"} · {total} SWATCHES · {space.toUpperCase()}
              </span>
              <button type="button" className="t-mono stp-mini" onClick={copyHex}>
                {copied ? "Copied ✓" : "Copy hex"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="stp-controls">
          {/* Quick-start presets */}
          <fieldset className="stp-field">
            <div className="stp-legend-row">
              <legend className="t-label stp-legend">Quick start</legend>
              <span className="stp-mini-group">
                <button type="button" className="t-mono stp-mini" onClick={reverse}>
                  Reverse
                </button>
                <button type="button" className="t-mono stp-mini" onClick={randomize}>
                  Randomize
                </button>
              </span>
            </div>
            <div className="stp-shapes">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="stp-chip"
                  onClick={() => applyPreset(preset)}
                >
                  <span
                    className="stp-chip-swatch"
                    style={{ background: bandBar(preset.stops) }}
                    aria-hidden
                  />
                  {preset.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Colour stops */}
          <fieldset className="stp-field">
            <div className="stp-legend-row">
              <legend className="t-label stp-legend">Colour stops</legend>
              <span className="t-mono stp-sub">
                {stops.length}/{MAX_STOPS}
              </span>
            </div>
            <div className="stp-stops">
              {stops.map((stop, i) => {
                const valid = normalizeHex(stop);
                return (
                  <div key={i} className="stp-stop">
                    <span className="t-mono stp-stop-num">{String(i + 1).padStart(2, "0")}</span>
                    <label className="stp-swatch-well" style={{ background: valid ?? "transparent" }}>
                      <input
                        type="color"
                        value={valid ?? "#000000"}
                        onChange={(e) => setStop(i, e.target.value)}
                        aria-label={`Stop ${i + 1} colour`}
                      />
                    </label>
                    <input
                      type="text"
                      className="stp-hex"
                      data-invalid={valid ? undefined : true}
                      value={stop}
                      spellCheck={false}
                      maxLength={7}
                      onChange={(e) => setStop(i, e.target.value)}
                      aria-label={`Stop ${i + 1} hex`}
                    />
                    {stops.length > MIN_STOPS && (
                      <button
                        type="button"
                        className="stp-stop-x"
                        aria-label={`Remove stop ${i + 1}`}
                        onClick={() => removeStop(i)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {stops.length < MAX_STOPS && (
              <button type="button" className="stp-add" onClick={addStop}>
                + Add stop
              </button>
            )}
          </fieldset>

          {/* Steps */}
          <fieldset className="stp-field">
            <label className="stp-dial">
              <span className="stp-dial-head">
                <span className="stp-dial-label">Steps between stops</span>
                <span className="t-mono stp-dial-val">{steps}</span>
              </span>
              <input
                type="range"
                min={1}
                max={24}
                step={1}
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              />
            </label>
          </fieldset>

          {/* Interpolation space */}
          <fieldset className="stp-field">
            <legend className="t-label stp-legend">Interpolation</legend>
            <div className="stp-seg stp-seg-3">
              {SPACES.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  className="stp-seg-btn stp-seg-btn-stack"
                  data-active={sp.id === space}
                  aria-pressed={sp.id === space}
                  onClick={() => setSpace(sp.id)}
                >
                  <span>{sp.label}</span>
                  <span className="stp-seg-note">{sp.note}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Mode + orientation */}
          <fieldset className="stp-field">
            <legend className="t-label stp-legend">Output</legend>
            <span className="stp-dial-label stp-out-label">Fill</span>
            <div className="stp-seg stp-seg-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="stp-seg-btn"
                  data-active={m.id === mode}
                  aria-pressed={m.id === mode}
                  onClick={() => setMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <span className="stp-dial-label stp-out-label stp-out-gap">Orientation</span>
            <div className="stp-seg stp-seg-2">
              {ORIENTATIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="stp-seg-btn"
                  data-active={o.id === orientation}
                  aria-pressed={o.id === orientation}
                  onClick={() => setOrientation(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <label className="stp-check">
              <input type="checkbox" checked={labels} onChange={(e) => setLabels(e.target.checked)} />
              <span>Bake hex labels into export</span>
            </label>
          </fieldset>

          {/* Export */}
          <fieldset className="stp-field">
            <legend className="t-label stp-legend">Export PNG</legend>
            <div className="stp-export">
              {exportSizes.map((s) => (
                <button
                  key={`${s.w}x${s.h}`}
                  type="button"
                  className="stp-btn"
                  onClick={() => exportPng(s.w, s.h)}
                >
                  {s.w} × {s.h}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <style>{`
        .stp { padding-top: 40px; padding-bottom: 96px; }
        .stp-head { padding-top: 16px; padding-bottom: 40px; }
        .stp-kicker { opacity: 0.55; margin: 0 0 18px; letter-spacing: 0.18em; }
        .stp-title { margin: 0 0 18px; }
        .stp-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300; font-size: 16px; line-height: 1.55;
          max-width: 560px; opacity: 0.72; margin: 0;
        }

        .stp-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
        @media (min-width: 900px) {
          .stp-grid { grid-template-columns: minmax(0, 1fr) minmax(340px, 440px); gap: 64px; }
        }

        /* ── Preview ── */
        .stp-stage { position: sticky; top: 88px; display: flex; flex-direction: column; gap: 16px; }
        .stp-frame {
          position: relative; width: 100%;
          border: 0.5px solid var(--hairline-strong); overflow: hidden;
          background:
            linear-gradient(45deg, #e7e7e7 25%, transparent 25%, transparent 75%, #e7e7e7 75%),
            linear-gradient(45deg, #e7e7e7 25%, transparent 25%, transparent 75%, #e7e7e7 75%),
            #f3f2f2;
          background-size: 22px 22px; background-position: 0 0, 11px 11px;
        }
        .stp-frame[data-orient="h"] { aspect-ratio: 16 / 6; }
        .stp-frame[data-orient="v"] {
          height: min(66vh, 150vw); width: auto; max-width: 100%;
          aspect-ratio: 6 / 16; margin-inline: auto;
        }
        .stp-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

        .stp-meta { display: flex; flex-direction: column; gap: 10px; }
        .stp-meta-bar {
          height: 14px; width: 100%;
          border: 0.5px solid var(--hairline-strong);
        }
        .stp-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .stp-meta-text { opacity: 0.6; }

        /* ── Controls ── */
        .stp-controls { display: flex; flex-direction: column; gap: 30px; }
        .stp-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .stp-legend-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .stp-legend { padding: 0; opacity: 0.72; }
        .stp-field > .stp-legend { margin-bottom: 14px; }
        .stp-sub { opacity: 0.45; }
        .stp-mini-group { display: inline-flex; gap: 16px; }
        .stp-mini {
          background: none; border: none; cursor: pointer; color: var(--ground);
          opacity: 0.6; padding: 0; letter-spacing: 0.08em;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .stp-mini:hover { opacity: 1; }

        /* Presets */
        .stp-shapes { display: flex; flex-wrap: wrap; gap: 8px; }
        .stp-chip {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-plex-mono), ui-monospace, monospace; font-size: 11px; letter-spacing: 0.04em;
          padding: 7px 12px 7px 8px; border: 0.5px solid var(--hairline-strong);
          background: transparent; color: var(--ground); cursor: pointer;
          transition: border-color var(--d-fast) var(--ease-out);
        }
        .stp-chip:hover { border-color: var(--ground); }
        .stp-chip-swatch { width: 20px; height: 14px; display: block; border: 0.5px solid var(--hairline-strong); }

        /* Stops */
        .stp-stops { display: flex; flex-direction: column; gap: 10px; }
        .stp-stop { display: flex; align-items: center; gap: 10px; }
        .stp-stop-num { opacity: 0.4; width: 18px; flex-shrink: 0; }
        .stp-swatch-well {
          position: relative; width: 34px; height: 30px; flex-shrink: 0;
          border: 0.5px solid var(--hairline-strong); cursor: pointer; overflow: hidden;
        }
        .stp-swatch-well input[type="color"] {
          position: absolute; inset: -4px; width: calc(100% + 8px); height: calc(100% + 8px);
          padding: 0; border: none; background: none; cursor: pointer; opacity: 0;
        }
        .stp-hex {
          flex: 1; min-width: 0;
          font-family: var(--font-plex-mono), ui-monospace, monospace; font-size: 12px; letter-spacing: 0.04em;
          text-transform: uppercase; padding: 8px 10px;
          border: 0.5px solid var(--hairline-strong); background: transparent; color: var(--ground);
        }
        .stp-hex[data-invalid="true"] { border-color: var(--signal-red); color: var(--signal-red); }
        .stp-stop-x {
          width: 24px; height: 24px; flex-shrink: 0; border-radius: 50%;
          border: 0.5px solid var(--hairline-strong); background: transparent; color: var(--ground);
          cursor: pointer; font-size: 14px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          transition: border-color var(--d-fast) var(--ease-out);
        }
        .stp-stop-x:hover { border-color: var(--ground); }
        .stp-add {
          margin-top: 12px;
          font-family: var(--font-plex-mono), ui-monospace, monospace; font-size: 11px; letter-spacing: 0.04em;
          padding: 9px 12px; width: 100%;
          border: 0.5px dashed var(--hairline-strong); background: transparent; color: var(--ground); cursor: pointer;
          transition: border-color var(--d-fast) var(--ease-out);
        }
        .stp-add:hover { border-color: var(--ground); }

        /* Dial */
        .stp-dial { display: flex; flex-direction: column; gap: 7px; }
        .stp-dial-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .stp-dial-label { font-family: var(--font-inter), sans-serif; font-weight: 400; font-size: 13px; opacity: 0.85; }
        .stp-dial-val { opacity: 0.55; }
        .stp-dial input[type="range"] {
          -webkit-appearance: none; appearance: none; width: 100%; height: 2px;
          background: var(--hairline-strong); accent-color: var(--ground); cursor: pointer;
        }

        /* Segmented */
        .stp-out-label { display: block; margin-bottom: 8px; }
        .stp-out-gap { margin-top: 18px; }
        .stp-seg { display: grid; border: 0.5px solid var(--hairline-strong); }
        .stp-seg-2 { grid-template-columns: 1fr 1fr; }
        .stp-seg-3 { grid-template-columns: repeat(3, 1fr); }
        .stp-seg-btn {
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 8px;
          background: transparent; color: var(--ground); border: none; border-right: 0.5px solid var(--hairline-strong);
          cursor: pointer; transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .stp-seg-btn:last-child { border-right: none; }
        .stp-seg-btn:hover { background: var(--hairline); }
        .stp-seg-btn[data-active="true"] { background: var(--ground); color: var(--signal); }
        .stp-seg-btn-stack { display: flex; flex-direction: column; gap: 3px; align-items: center; }
        .stp-seg-note { font-size: 8.5px; letter-spacing: 0.08em; opacity: 0.5; }
        .stp-seg-btn[data-active="true"] .stp-seg-note { opacity: 0.7; }

        .stp-check {
          display: flex; align-items: center; gap: 10px; margin-top: 18px;
          font-family: var(--font-inter), sans-serif; font-size: 13px; opacity: 0.85; cursor: pointer;
        }
        .stp-check input { accent-color: var(--ground); width: 15px; height: 15px; cursor: pointer; }

        /* Buttons */
        .stp-btn {
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase; padding: 14px 24px;
          border: 1px solid var(--ground); background: transparent; color: var(--ground); cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .stp-btn:hover { background: var(--ground); color: var(--signal); }
        .stp-export { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      `}</style>
    </section>
  );
}
