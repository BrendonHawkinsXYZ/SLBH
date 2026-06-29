"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SHAPE_FAMILIES,
  PRESETS,
  MODIFIER_SPECS,
  DEFAULT_MODIFIERS,
  defaultValues,
  familyById,
  resolveShape,
  makePalette,
  renderShapeField,
  type Background,
  type Modifiers,
  type Palette,
  type ParamSpec,
  type ParamValues,
  type Preset,
} from "@/lib/shapeField";

const BACKGROUNDS: { id: Background; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "transparent", label: "Transparent" },
];

const EXPORT_SIZES = [500, 1000];

// Preset quick-starts, grouped for the chip row.
const PRESET_GROUPS = ["Basic", "Polygon", "Rounded", "Organic", "Star"].map((group) => ({
  group,
  presets: PRESETS.filter((preset) => preset.group === group),
}));

function formatValue(spec: ParamSpec, v: number): string {
  if (spec.id === "rotation") return `${Math.round(v)}°`;
  if (spec.integer) return String(Math.round(v));
  return v.toFixed(2);
}

function Dial({
  spec,
  value,
  onChange,
}: {
  spec: ParamSpec;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="shp-dial">
      <span className="shp-dial-head">
        <span className="shp-dial-label">{spec.label}</span>
        <span className="t-mono shp-dial-val">{formatValue(spec, value)}</span>
      </span>
      <input
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

export function ShapesStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [familyId, setFamilyId] = useState<string>("round");
  const [values, setValues] = useState<ParamValues>(() => defaultValues("round"));
  const [modifiers, setModifiers] = useState<Modifiers>(DEFAULT_MODIFIERS);
  // Lazy init so the first paint already has a fresh colour (client-side random;
  // never rendered into the DOM, so no hydration mismatch).
  const [palette, setPalette] = useState<Palette>(() => makePalette());
  const [background, setBackground] = useState<Background>("white");

  const family = familyById(familyId);
  const shape = useMemo(
    () => resolveShape(familyId, values, modifiers),
    [familyId, values, modifiers],
  );

  // ── Live preview: redraw on any change, and on resize, at device resolution.
  //    rAF-coalesced so dragging a slider never queues more than one frame. ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const render = () => {
      raf = 0;
      const cssSize = canvas.clientWidth;
      if (cssSize <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssSize * dpr);
      canvas.height = Math.round(cssSize * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderShapeField(ctx, cssSize, palette, shape, background, modifiers.pixelScale);
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
  }, [shape, palette, background, modifiers.pixelScale]);

  const setParam = useCallback((id: string, v: number) => {
    setValues((prev) => ({ ...prev, [id]: v }));
  }, []);

  const setModifier = useCallback((id: string, v: number) => {
    setModifiers((prev) => ({ ...prev, [id]: v }));
  }, []);

  const selectFamily = useCallback((id: string) => {
    setFamilyId(id);
    setValues(defaultValues(id)); // keep modifiers so a hollow/stretch carries over
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setFamilyId(preset.familyId);
    setValues({ ...defaultValues(preset.familyId), ...(preset.values ?? {}) });
    setModifiers({ ...DEFAULT_MODIFIERS, ...(preset.modifiers ?? {}) });
  }, []);

  const randomizeColors = useCallback(() => setPalette(makePalette()), []);

  // Roll a whole new shape: random family, random dials, mild random modifiers —
  // the discovery button for novel, often non-geometric, forms.
  const randomizeShape = useCallback(() => {
    const fam = SHAPE_FAMILIES[Math.floor(Math.random() * SHAPE_FAMILIES.length)];
    const vals: ParamValues = {};
    for (const spec of fam.params) {
      const steps = Math.round((spec.max - spec.min) / spec.step);
      vals[spec.id] = +(spec.min + Math.round(Math.random() * steps) * spec.step).toFixed(4);
    }
    setFamilyId(fam.id);
    setValues(vals);
    setModifiers((prev) => ({
      ...DEFAULT_MODIFIERS,
      rotation: Math.floor(Math.random() * 360),
      stretchX: +(0.6 + Math.random() * 0.4).toFixed(2),
      stretchY: +(0.6 + Math.random() * 0.4).toFixed(2),
      hole: Math.random() < 0.3 ? +(Math.random() * 0.6).toFixed(2) : 0,
      wobble: Math.random() < 0.5 ? +(Math.random() * 0.32).toFixed(2) : 0,
      wobbleFreq: 3 + Math.floor(Math.random() * 10),
      pixelScale: prev.pixelScale, // leave the grain where the user set it
    }));
  }, []);

  // ── Export: render fresh at exact pixel size, then download a PNG. ──
  const exportPng = useCallback(
    (px: number) => {
      const c = document.createElement("canvas");
      c.width = px;
      c.height = px;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      renderShapeField(ctx, px, palette, shape, background, modifiers.pixelScale);
      c.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `slbh-field-${familyId}-${background}-${px}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    },
    [palette, shape, background, modifiers.pixelScale, familyId],
  );

  return (
    <section className="shp">
      <div className="container-page shp-head">
        <p className="t-mono shp-kicker">SHAPES / GENERATOR</p>
        <h1 className="t-h1 shp-title">Field shape instrument</h1>
        <p className="shp-deck">
          The same mosaic the home Field is built from, as an instrument. Pick a
          base family, turn the dials, warp it with wobble, choose a ground, and
          export a clean PNG.
        </p>
      </div>

      <div className="container-page shp-grid">
        {/* ── Preview stage ── */}
        <div className="shp-stage">
          <div className={`shp-frame shp-bg-${background}`}>
            <canvas ref={canvasRef} className="shp-canvas" aria-label="Generated field shape preview" />
          </div>
          <div className="shp-meta">
            <span className="t-mono shp-meta-text">
              {family.label.toUpperCase()}
              {modifiers.hole > 0 ? " · HOLLOW" : ""}
              {modifiers.wobble > 0 ? " · WOBBLE" : ""} · {background.toUpperCase()}
            </span>
            <span className="shp-meta-swatches" aria-hidden>
              {palette.stops.map((stop, i) => (
                <span key={i} className="shp-swatch" style={{ background: stop.color }} />
              ))}
            </span>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="shp-controls">
          {/* Quick-start presets */}
          <fieldset className="shp-field">
            <div className="shp-legend-row">
              <legend className="t-label shp-legend">Quick start</legend>
              <button type="button" className="t-mono shp-mini" onClick={randomizeShape}>
                Randomize
              </button>
            </div>
            <div className="shp-groups">
              {PRESET_GROUPS.map(({ group, presets }) => (
                <div key={group} className="shp-group">
                  <span className="t-mono shp-group-label">{group}</span>
                  <div className="shp-shapes">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className="shp-chip"
                        onClick={() => applyPreset(preset)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Family */}
          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Family</legend>
            <div className="shp-shapes">
              {SHAPE_FAMILIES.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  className="shp-chip"
                  data-active={fam.id === familyId}
                  aria-pressed={fam.id === familyId}
                  onClick={() => selectFamily(fam.id)}
                >
                  {fam.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Shape dials (per family) */}
          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Shape</legend>
            {family.params.length > 0 ? (
              <div className="shp-dials">
                {family.params.map((spec) => (
                  <Dial key={spec.id} spec={spec} value={values[spec.id]} onChange={(v) => setParam(spec.id, v)} />
                ))}
              </div>
            ) : (
              <p className="shp-empty">No shape dials — bend it with Transform &amp; Effects below.</p>
            )}
          </fieldset>

          {/* Transform */}
          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Transform</legend>
            <div className="shp-dials">
              {MODIFIER_SPECS.transform.map((spec) => (
                <Dial
                  key={spec.id}
                  spec={spec}
                  value={modifiers[spec.id as keyof Modifiers]}
                  onChange={(v) => setModifier(spec.id, v)}
                />
              ))}
            </div>
          </fieldset>

          {/* Effects */}
          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Effects</legend>
            <div className="shp-dials">
              {MODIFIER_SPECS.effects.map((spec) => (
                <Dial
                  key={spec.id}
                  spec={spec}
                  value={modifiers[spec.id as keyof Modifiers]}
                  onChange={(v) => setModifier(spec.id, v)}
                />
              ))}
            </div>
          </fieldset>

          {/* Colour */}
          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Colour</legend>
            <button type="button" className="shp-btn shp-btn-primary" onClick={randomizeColors}>
              Randomize colours
            </button>
          </fieldset>

          {/* Background */}
          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Background</legend>
            <div className="shp-seg">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className="shp-seg-btn"
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
          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Export PNG</legend>
            <div className="shp-export">
              {EXPORT_SIZES.map((px) => (
                <button key={px} type="button" className="shp-btn" onClick={() => exportPng(px)}>
                  {px} × {px}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <style>{`
        .shp {
          padding-top: 40px;
          padding-bottom: 96px;
        }
        .shp-head {
          padding-top: 16px;
          padding-bottom: 40px;
        }
        .shp-kicker {
          opacity: 0.55;
          margin: 0 0 18px;
          letter-spacing: 0.18em;
        }
        .shp-title { margin: 0 0 18px; }
        .shp-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.55;
          max-width: 540px;
          opacity: 0.72;
          margin: 0;
        }

        .shp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .shp-grid {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
            gap: 64px;
          }
        }

        /* ── Preview ── */
        .shp-stage {
          position: sticky;
          top: 88px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .shp-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .shp-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .shp-bg-white { background: #ffffff; }
        .shp-bg-black { background: #000000; }
        .shp-bg-transparent {
          background-color: #e7e7e7;
          background-image:
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%),
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%);
          background-size: 22px 22px;
          background-position: 0 0, 11px 11px;
        }
        .shp-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .shp-meta-text { opacity: 0.6; }
        .shp-meta-swatches {
          display: inline-flex;
          border: 0.5px solid var(--hairline-strong);
          flex-shrink: 0;
        }
        .shp-swatch { width: 18px; height: 14px; display: block; }

        /* ── Controls ── */
        .shp-controls {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .shp-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .shp-legend-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .shp-legend { padding: 0; opacity: 0.72; }
        .shp-field > .shp-legend { margin-bottom: 14px; }
        .shp-mini {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ground);
          opacity: 0.6;
          padding: 0;
          letter-spacing: 0.08em;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .shp-mini:hover { opacity: 1; }

        .shp-groups { display: flex; flex-direction: column; gap: 16px; }
        .shp-group-label {
          display: block;
          opacity: 0.4;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 9px;
        }
        .shp-shapes { display: flex; flex-wrap: wrap; gap: 8px; }
        .shp-chip {
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
        .shp-chip:hover { border-color: var(--ground); }
        .shp-chip[data-active="true"] {
          background: var(--ground);
          border-color: var(--ground);
          color: var(--signal);
        }

        /* ── Dials ── */
        .shp-dials { display: flex; flex-direction: column; gap: 16px; }
        .shp-dial { display: flex; flex-direction: column; gap: 7px; }
        .shp-dial-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
        }
        .shp-dial-label {
          font-family: var(--font-inter), sans-serif;
          font-weight: 400;
          font-size: 13px;
          opacity: 0.85;
        }
        .shp-dial-val { opacity: 0.55; }
        .shp-dial input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 2px;
          background: var(--hairline-strong);
          accent-color: var(--ground);
          cursor: pointer;
        }
        .shp-empty {
          margin: 0;
          font-size: 13px;
          font-weight: 300;
          opacity: 0.5;
        }

        /* ── Segmented + buttons ── */
        .shp-seg {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 0.5px solid var(--hairline-strong);
        }
        .shp-seg-btn {
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
        .shp-seg-btn:last-child { border-right: none; }
        .shp-seg-btn:hover { background: var(--hairline); }
        .shp-seg-btn[data-active="true"] { background: var(--ground); color: var(--signal); }

        .shp-btn {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px 24px;
          border: 1px solid var(--ground);
          background: transparent;
          color: var(--ground);
          cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .shp-btn:hover { background: var(--ground); color: var(--signal); }
        .shp-btn-primary { width: 100%; background: var(--ground); color: var(--signal); }
        .shp-btn-primary:hover { opacity: 0.85; }

        .shp-export { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      `}</style>
    </section>
  );
}
