"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ACCESSORIES,
  BASE_LAYERS,
  BOTTOMS,
  DEFAULT_FIGURE,
  DIRECTIONS,
  HAIR_TYPES,
  OUTER_LAYERS,
  PALETTE,
  PIXEL_SPEC,
  SHOES,
  figureFromSettings,
  figureSettings,
  figureSlug,
  figureSummary,
  isDress,
  randomFigure,
  randomFigureColors,
  renderFigure,
  type Background,
  type FigureParams,
} from "@/lib/figureField";

const BACKGROUNDS: { id: Background; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "transparent", label: "Transparent" },
];

// 2:3 frame — the figure sits inside it with room to breathe, and the preview
// and the PNG are the same composition at different sizes.
const EXPORT_SIZES = [
  { w: 800, h: 1200 },
  { w: 1600, h: 2400 },
];

const MAX_LOOKS = 8;

function Dial({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="fig-dial">
      <span className="fig-dial-head">
        <span className="fig-dial-label">{label}</span>
        <span className="t-mono fig-dial-val">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

function Chips({
  options,
  value,
  onPick,
  disabled,
  label,
}: {
  options: string[];
  value: number;
  onPick: (i: number) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <div className="fig-chips" role="group" aria-label={label} data-disabled={!!disabled}>
      {options.map((name, i) => (
        <button
          key={name}
          type="button"
          className="fig-chip"
          data-active={i === value}
          aria-pressed={i === value}
          disabled={disabled}
          onClick={() => onPick(i)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

function Swatches({
  value,
  onPick,
  label,
}: {
  value: number;
  onPick: (i: number) => void;
  label: string;
}) {
  return (
    <div className="fig-swatches" role="group" aria-label={label}>
      {PALETTE.map((color, i) => (
        <button
          key={color}
          type="button"
          className="fig-sw"
          data-active={i === value}
          aria-pressed={i === value}
          aria-label={color}
          title={color}
          style={{ background: color }}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}

function LookThumb({ look, onPick }: { look: FigureParams; onPick: () => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(60 * dpr);
    canvas.height = Math.round(90 * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    renderFigure(ctx, canvas.width, canvas.height, look, "transparent");
  }, [look]);

  return (
    <button type="button" className="fig-look" onClick={onPick} title="Load this look">
      <canvas ref={ref} className="fig-look-canvas" aria-hidden />
    </button>
  );
}

export function FigureStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [params, setParams] = useState<FigureParams>(DEFAULT_FIGURE);
  const [background, setBackground] = useState<Background>("black");
  const [looks, setLooks] = useState<FigureParams[]>([]);
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const dress = isDress(params);
  const summary = useMemo(() => figureSummary(params), [params]);
  const settings = useMemo(() => figureSettings(params, background), [params, background]);
  const json = useMemo(() => JSON.stringify(settings, null, 2), [settings]);

  // ── Live preview: device-pixel canvas so the sprite blocks stay crisp;
  //    rAF-coalesced so dragging a dial never queues more than one frame. ──
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      renderFigure(ctx, canvas.width, canvas.height, params, background);
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
  }, [params, background]);

  const set = useCallback(<K extends keyof FigureParams>(key: K, value: FigureParams[K]) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveLook = useCallback(() => {
    setLooks((all) => [...all, params].slice(-MAX_LOOKS));
  }, [params]);

  // ── Export: render fresh at exact pixel size, then download a PNG. ──
  const exportPng = useCallback(
    (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      renderFigure(ctx, w, h, params, background);
      c.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `slbh-figure-${figureSlug(params)}-${background}-${w}x${h}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    },
    [params, background],
  );

  const copyJson = useCallback(() => {
    navigator.clipboard?.writeText(json).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      },
      () => {},
    );
  }, [json]);

  const downloadJson = useCallback(() => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `slbh-figure-${figureSlug(params)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [json, params]);

  // Settings round-trip: the exported JSON loads back as the same look.
  const loadJson = useCallback((file: File) => {
    file
      .text()
      .then((raw) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return;
        }
        const next = figureFromSettings(parsed);
        if (next) setParams(next);
        const bg = (parsed as { render?: { background?: string } })?.render?.background;
        if (bg === "white" || bg === "black" || bg === "transparent") setBackground(bg);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="fig">
      <div className="container-page fig-head">
        <p className="t-mono fig-kicker">FIGURE / GENERATOR</p>
        <h1 className="t-h1 fig-title">Character instrument</h1>
        <p className="fig-deck">
          A pixel figure, built from the lab&rsquo;s palette. Dress it — base
          layer, outer layer, bottom, shoes, one accessory — turn the grain and
          the direction, choose a ground, and export a clean PNG or the settings
          as JSON.
        </p>
      </div>

      <div className="container-page fig-grid">
        {/* ── Preview stage ── */}
        <div className="fig-stage">
          <div className={`fig-frame fig-bg-${background}`}>
            <canvas ref={canvasRef} className="fig-canvas" aria-label="Generated pixel figure preview" />
          </div>

          <div className="fig-meta">
            <span className="t-mono fig-meta-text">
              {summary.map((line) => (
                <span key={line} className="fig-meta-line">
                  {line}
                </span>
              ))}
            </span>
            <span className="fig-meta-swatches" aria-hidden>
              {[params.skin, params.hair, params.basec, params.outc, params.botc].map((i, k) => (
                <span key={k} className="fig-meta-sw" style={{ background: PALETTE[i] }} />
              ))}
            </span>
          </div>

          <div className="fig-looks-block">
            <div className="fig-legend-row">
              <span className="t-label fig-legend">Saved looks</span>
              <button type="button" className="t-mono fig-mini" onClick={saveLook}>
                Save look
              </button>
            </div>
            {looks.length > 0 ? (
              <div className="fig-looks">
                {looks.map((look, i) => (
                  <LookThumb key={i} look={look} onPick={() => setParams(look)} />
                ))}
              </div>
            ) : (
              <p className="fig-empty">Nothing saved yet — the last {MAX_LOOKS} looks land here.</p>
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="fig-controls">
          {/* Roll */}
          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Roll a look</legend>
            <div className="fig-row-2">
              <button
                type="button"
                className="fig-btn fig-btn-primary"
                onClick={() => setParams((p) => randomFigure(p))}
              >
                Randomize
              </button>
              <button type="button" className="fig-btn" onClick={() => setParams((p) => randomFigureColors(p))}>
                Colours only
              </button>
            </div>
          </fieldset>

          {/* Render */}
          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Render</legend>
            <Dial
              label="Pixels"
              value={params.px}
              min={PIXEL_SPEC.min}
              max={PIXEL_SPEC.max}
              step={PIXEL_SPEC.step}
              format={(v) => v.toFixed(1)}
              onChange={(v) => set("px", v)}
            />
            <span className="t-mono fig-sub">Direction</span>
            <Chips label="Direction" options={DIRECTIONS} value={params.dir} onPick={(i) => set("dir", i)} />
          </fieldset>

          {/* Demographics */}
          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Skin &amp; hair</legend>
            <span className="t-mono fig-sub">Skin</span>
            <Swatches label="Skin colour" value={params.skin} onPick={(i) => set("skin", i)} />
            <span className="t-mono fig-sub">Hair colour</span>
            <Swatches label="Hair colour" value={params.hair} onPick={(i) => set("hair", i)} />
            <span className="t-mono fig-sub">Hair type</span>
            <Chips label="Hair type" options={HAIR_TYPES} value={params.hairT} onPick={(i) => set("hairT", i)} />
          </fieldset>

          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Body</legend>
            <div className="fig-dials">
              <Dial
                label="Weight"
                value={params.weight}
                min={0}
                max={1}
                step={0.02}
                format={(v) => v.toFixed(2)}
                onChange={(v) => set("weight", v)}
              />
              <Dial
                label="Height"
                value={params.height}
                min={0}
                max={1}
                step={0.02}
                format={(v) => v.toFixed(2)}
                onChange={(v) => set("height", v)}
              />
            </div>
          </fieldset>

          {/* Clothing */}
          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Base layer</legend>
            <Chips label="Base layer" options={BASE_LAYERS} value={params.base} onPick={(i) => set("base", i)} />
            <Swatches label="Base layer colour" value={params.basec} onPick={(i) => set("basec", i)} />
          </fieldset>

          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Outer layer</legend>
            <Chips label="Outer layer" options={OUTER_LAYERS} value={params.out} onPick={(i) => set("out", i)} />
            <Swatches label="Outer layer colour" value={params.outc} onPick={(i) => set("outc", i)} />
          </fieldset>

          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Bottom</legend>
            <Chips
              label="Bottom"
              options={BOTTOMS}
              value={params.bot}
              onPick={(i) => set("bot", i)}
              disabled={dress}
            />
            {dress ? <p className="fig-note">The dress takes the bottom slot — garment choice is inactive.</p> : null}
            <span className="t-mono fig-sub">Bottom &amp; shoe colour</span>
            <Swatches label="Bottom colour" value={params.botc} onPick={(i) => set("botc", i)} />
          </fieldset>

          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Shoes</legend>
            <Chips label="Shoes" options={SHOES} value={params.sho} onPick={(i) => set("sho", i)} />
          </fieldset>

          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Accessory</legend>
            <Chips label="Accessory" options={ACCESSORIES} value={params.acc} onPick={(i) => set("acc", i)} />
          </fieldset>

          {/* Background */}
          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Background</legend>
            <div className="fig-seg">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className="fig-seg-btn"
                  data-active={bg.id === background}
                  aria-pressed={bg.id === background}
                  onClick={() => setBackground(bg.id)}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Export */}
          <fieldset className="fig-field">
            <legend className="t-label fig-legend">Export PNG</legend>
            <div className="fig-row-2">
              {EXPORT_SIZES.map((s) => (
                <button key={s.w} type="button" className="fig-btn" onClick={() => exportPng(s.w, s.h)}>
                  {s.w} × {s.h}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="fig-field">
            <div className="fig-legend-row">
              <legend className="t-label fig-legend">Export settings</legend>
              <button type="button" className="t-mono fig-mini" onClick={() => setShowJson((v) => !v)}>
                {showJson ? "Hide JSON" : "Show JSON"}
              </button>
            </div>
            <div className="fig-row-3">
              <button type="button" className="fig-btn" onClick={copyJson}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <button type="button" className="fig-btn" onClick={downloadJson}>
                .json
              </button>
              <button type="button" className="fig-btn" onClick={() => fileRef.current?.click()}>
                Load
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="fig-file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) loadJson(file);
                  e.target.value = "";
                }}
              />
            </div>
            {showJson ? <pre className="t-mono fig-json">{json}</pre> : null}
          </fieldset>
        </div>
      </div>

      <style>{`
        .fig {
          padding-top: 40px;
          padding-bottom: 96px;
        }
        .fig-head {
          padding-top: 16px;
          padding-bottom: 40px;
        }
        .fig-kicker {
          opacity: 0.55;
          margin: 0 0 18px;
          letter-spacing: 0.18em;
        }
        .fig-title { margin: 0 0 18px; }
        .fig-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.55;
          max-width: 540px;
          opacity: 0.72;
          margin: 0;
        }

        .fig-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .fig-grid {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
            gap: 64px;
          }
        }

        /* ── Preview ── */
        .fig-stage {
          position: sticky;
          top: 88px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .fig-frame {
          position: relative;
          width: 100%;
          max-width: 380px;
          aspect-ratio: 2 / 3;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .fig-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .fig-bg-white { background: #ffffff; }
        .fig-bg-black { background: #000000; }
        .fig-bg-transparent {
          background-color: #e7e7e7;
          background-image:
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%),
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%);
          background-size: 22px 22px;
          background-position: 0 0, 11px 11px;
        }
        .fig-meta {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          max-width: 380px;
        }
        .fig-meta-text { opacity: 0.6; }
        .fig-meta-line { display: block; line-height: 1.7; }
        .fig-meta-swatches {
          display: inline-flex;
          border: 0.5px solid var(--hairline-strong);
          flex-shrink: 0;
        }
        .fig-meta-sw { width: 18px; height: 14px; display: block; }

        .fig-looks-block { max-width: 380px; }
        .fig-looks {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .fig-look {
          border: 0.5px solid var(--hairline-strong);
          background:
            linear-gradient(45deg, var(--hairline) 25%, transparent 25%, transparent 75%, var(--hairline) 75%),
            linear-gradient(45deg, var(--hairline) 25%, transparent 25%, transparent 75%, var(--hairline) 75%);
          background-size: 12px 12px;
          background-position: 0 0, 6px 6px;
          padding: 4px;
          cursor: pointer;
          line-height: 0;
          transition: border-color var(--d-fast) var(--ease-out);
        }
        .fig-look:hover { border-color: var(--ground); }
        .fig-look-canvas { width: 60px; height: 90px; display: block; }

        /* ── Controls ── */
        .fig-controls {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .fig-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .fig-legend-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .fig-legend { padding: 0; opacity: 0.72; }
        .fig-field > .fig-legend { margin-bottom: 14px; }
        .fig-sub {
          display: block;
          opacity: 0.4;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin: 18px 0 9px;
        }
        .fig-mini {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ground);
          opacity: 0.6;
          padding: 0;
          letter-spacing: 0.08em;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .fig-mini:hover { opacity: 1; }

        /* ── Chips ── */
        .fig-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .fig-chips[data-disabled="true"] { opacity: 0.35; }
        .fig-chip {
          font-family: var(--font-plex-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          padding: 8px 12px;
          border: 0.5px solid var(--hairline-strong);
          background: transparent;
          color: var(--ground);
          cursor: pointer;
          transition: background var(--d-fast) var(--ease-out),
            border-color var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .fig-chip:hover { border-color: var(--ground); }
        .fig-chip[data-active="true"] {
          background: var(--ground);
          border-color: var(--ground);
          color: var(--signal);
        }
        .fig-chip:disabled { cursor: default; }
        .fig-chip:disabled:hover { border-color: var(--hairline-strong); }

        /* ── Swatch grid ── */
        .fig-swatches {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          max-height: 140px;
          overflow-y: auto;
          padding: 4px;
          border: 0.5px solid var(--hairline);
        }
        .fig-sw {
          width: 16px;
          height: 16px;
          flex: none;
          border: none;
          padding: 0;
          cursor: pointer;
          box-shadow: inset 0 0 0 2px transparent;
        }
        .fig-sw[data-active="true"] {
          box-shadow: inset 0 0 0 2px var(--signal), 0 0 0 1.5px var(--ground);
        }

        /* ── Dials ── */
        .fig-dials { display: flex; flex-direction: column; gap: 16px; }
        .fig-dial { display: flex; flex-direction: column; gap: 7px; }
        .fig-dial-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }
        .fig-dial-label {
          font-family: var(--font-inter), sans-serif;
          font-weight: 400;
          font-size: 13px;
          opacity: 0.85;
        }
        .fig-dial-val { opacity: 0.55; }
        .fig-dial input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 2px;
          background: var(--hairline-strong);
          accent-color: var(--ground);
          cursor: pointer;
        }

        .fig-empty, .fig-note {
          margin: 10px 0 0;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          font-weight: 300;
          opacity: 0.5;
        }

        /* ── Segmented + buttons ── */
        .fig-seg {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 0.5px solid var(--hairline-strong);
        }
        .fig-seg-btn {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 8px;
          background: transparent;
          color: var(--ground);
          border: none;
          border-right: 0.5px solid var(--hairline-strong);
          cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .fig-seg-btn:last-child { border-right: none; }
        .fig-seg-btn:hover { background: var(--hairline); }
        .fig-seg-btn[data-active="true"] { background: var(--ground); color: var(--signal); }

        .fig-btn {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px 18px;
          border: 1px solid var(--ground);
          background: transparent;
          color: var(--ground);
          cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .fig-btn:hover { background: var(--ground); color: var(--signal); }
        .fig-btn-primary { background: var(--ground); color: var(--signal); }
        .fig-btn-primary:hover { opacity: 0.85; }

        .fig-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .fig-row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .fig-file { display: none; }

        .fig-json {
          margin: 14px 0 0;
          padding: 14px;
          border: 0.5px solid var(--hairline-strong);
          font-size: 10px;
          line-height: 1.6;
          max-height: 280px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
          opacity: 0.75;
        }
      `}</style>
    </section>
  );
}
