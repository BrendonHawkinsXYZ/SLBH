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
  defaultPalette,
  type Background,
  type Modifiers,
  type Palette,
  type ParamSpec,
  type ParamValues,
} from "@/lib/shapeField";
import {
  BloomField,
  DEFAULT_GROWTH,
  GROWTH_SPECS,
  type BloomKeyframe,
  type GrowthOptions,
} from "@/lib/bloomField";

const RENDER_SIZE = 1000; // logical box the field is built in; preview scales to fit

const BACKGROUNDS: { id: Background; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "transparent", label: "Transparent" },
];

// pixelScale is global here (both keyframes share one mosaic lattice), so it is
// pulled out of the per-keyframe effects and driven as an output-wide dial.
const EFFECT_SPECS = MODIFIER_SPECS.effects.filter((s) => s.id !== "pixelScale");
const PIXEL_SPEC = MODIFIER_SPECS.effects.find((s) => s.id === "pixelScale") as ParamSpec;

type Keyframe = {
  familyId: string;
  values: ParamValues;
  modifiers: Modifiers;
  palette: Palette;
};

type Which = "seed" | "bloom";

function kfFromPreset(presetId: string): Keyframe {
  const preset = PRESETS.find((p) => p.id === presetId);
  const familyId = preset?.familyId ?? "round";
  return {
    familyId,
    values: { ...defaultValues(familyId), ...(preset?.values ?? {}) },
    modifiers: { ...DEFAULT_MODIFIERS, ...(preset?.modifiers ?? {}) },
    palette: defaultPalette(),
  };
}

function toBloomKeyframe(kf: Keyframe): BloomKeyframe {
  return { shape: resolveShape(kf.familyId, kf.values, kf.modifiers), palette: kf.palette };
}

function formatValue(spec: { id: string; integer?: boolean }, v: number): string {
  if (spec.id === "rotation" || spec.id === "spin") return `${Math.round(v)}°`;
  if (spec.id === "duration") return `${v.toFixed(1)}s`;
  if (spec.integer) return String(Math.round(v));
  return v.toFixed(2);
}

function Dial({
  spec,
  value,
  onChange,
}: {
  spec: { id: string; label: string; min: number; max: number; step: number; integer?: boolean };
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="bl-dial">
      <span className="bl-dial-head">
        <span className="bl-dial-label">{spec.label}</span>
        <span className="t-mono bl-dial-val">{formatValue(spec, value)}</span>
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

function swatchGradient(palette: Palette): string {
  return `linear-gradient(90deg, ${palette.stops.map((s) => s.color).join(", ")})`;
}

// Global timeline dials (the loop, not the form).
const HOLD_SPEC = { id: "hold", label: "Bloom hold", min: 0, max: 0.8, step: 0.02, integer: false };
const DURATION_SPEC = { id: "duration", label: "Duration", min: 2, max: 12, step: 0.5, integer: false };

export function BloomStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<BloomField | null>(null);

  const [seed, setSeed] = useState<Keyframe>(() => kfFromPreset("flower"));
  const [bloom, setBloom] = useState<Keyframe>(() => kfFromPreset("gear"));
  const [active, setActive] = useState<Which>("seed");

  const [growth, setGrowth] = useState<GrowthOptions>(DEFAULT_GROWTH);
  const [hold, setHold] = useState(0.15);
  const [duration, setDuration] = useState(6);
  const [pixelScale, setPixelScale] = useState(1);
  const [background, setBackground] = useState<Background>("white");

  const [playing, setPlaying] = useState(false);
  const [bloomAmt, setBloomAmt] = useState(1); // scrub position, 0 = seed, 1 = bloom

  // Fresh palettes per visit — after mount, so SSR and hydration agree.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeed((s) => ({ ...s, palette: makePalette() }));
    setBloom((s) => ({ ...s, palette: makePalette() }));
  }, []);

  const activeKf = active === "seed" ? seed : bloom;
  const setActiveKf = active === "seed" ? setSeed : setBloom;
  const family = familyById(activeKf.familyId);

  const seedFrame = useMemo(() => toBloomKeyframe(seed), [seed]);
  const bloomFrame = useMemo(() => toBloomKeyframe(bloom), [bloom]);

  // Build the field whenever a form, palette, or the grain changes.
  useEffect(() => {
    fieldRef.current = new BloomField(RENDER_SIZE, seedFrame, bloomFrame, pixelScale);
  }, [seedFrame, bloomFrame, pixelScale]);

  // Paint one frame (bg + field) into a context already scaled to the canvas.
  const paint = useCallback(
    (ctx: CanvasRenderingContext2D, b: number) => {
      ctx.clearRect(0, 0, RENDER_SIZE, RENDER_SIZE);
      if (background === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, RENDER_SIZE, RENDER_SIZE);
      } else if (background === "black") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, RENDER_SIZE, RENDER_SIZE);
      }
      fieldRef.current?.render(ctx, RENDER_SIZE / 2, RENDER_SIZE / 2, b, growth);
    },
    [background, growth],
  );

  const drawPreview = useCallback(
    (b: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cssSize = canvas.clientWidth;
      if (cssSize <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const px = Math.round(cssSize * dpr);
      if (canvas.width !== px || canvas.height !== px) {
        canvas.width = px;
        canvas.height = px;
      }
      const scale = px / RENDER_SIZE;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      paint(ctx, b);
    },
    [paint],
  );

  // Still redraw (paused) on any form/scrub/output change, and on resize.
  useEffect(() => {
    if (playing) return;
    drawPreview(bloomAmt);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => drawPreview(bloomAmt));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [playing, bloomAmt, drawPreview, seedFrame, bloomFrame, pixelScale]);

  // Playback: a linear seed→bloom→hold→seed triangle loop; render eases it.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const period = duration * 1000;
    const grow = (1 - hold) / 2;
    const loop = (now: number) => {
      const phase = ((now - start) % period) / period;
      let b: number;
      if (phase < grow) b = phase / grow;
      else if (phase < grow + hold) b = 1;
      else b = 1 - (phase - grow - hold) / grow;
      drawPreview(b);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, hold, drawPreview]);

  // ── Edits on the active keyframe ──
  const setParam = useCallback(
    (id: string, v: number) => setActiveKf((prev) => ({ ...prev, values: { ...prev.values, [id]: v } })),
    [setActiveKf],
  );
  const setModifier = useCallback(
    (id: string, v: number) => setActiveKf((prev) => ({ ...prev, modifiers: { ...prev.modifiers, [id]: v } })),
    [setActiveKf],
  );
  const selectFamily = useCallback(
    (id: string) => setActiveKf((prev) => ({ ...prev, familyId: id, values: defaultValues(id) })),
    [setActiveKf],
  );
  const randomizeColors = useCallback(
    () => setActiveKf((prev) => ({ ...prev, palette: makePalette() })),
    [setActiveKf],
  );

  const randomizeShape = useCallback(() => {
    const fam = SHAPE_FAMILIES[Math.floor(Math.random() * SHAPE_FAMILIES.length)];
    const vals: ParamValues = {};
    for (const spec of fam.params) {
      const steps = Math.round((spec.max - spec.min) / spec.step);
      vals[spec.id] = +(spec.min + Math.round(Math.random() * steps) * spec.step).toFixed(4);
    }
    setActiveKf((prev) => ({
      ...prev,
      familyId: fam.id,
      values: vals,
      modifiers: {
        ...DEFAULT_MODIFIERS,
        rotation: Math.floor(Math.random() * 360),
        stretchX: +(0.6 + Math.random() * 0.4).toFixed(2),
        stretchY: +(0.6 + Math.random() * 0.4).toFixed(2),
        hole: Math.random() < 0.3 ? +(Math.random() * 0.6).toFixed(2) : 0,
        wobble: Math.random() < 0.5 ? +(Math.random() * 0.32).toFixed(2) : 0,
        wobbleFreq: 3 + Math.floor(Math.random() * 10),
        pixelScale: 1,
      },
      palette: makePalette(),
    }));
  }, [setActiveKf]);

  const setGrowthParam = useCallback((id: string, v: number) => {
    setGrowth((prev) => ({ ...prev, [id]: v }));
  }, []);

  return (
    <section className="bl">
      <div className="container-page bl-head">
        <p className="t-mono bl-kicker">SHAPES / BLOOM</p>
        <h1 className="t-h1 bl-title">Bloom</h1>
        <p className="bl-deck">
          A field shape that grows. Set a <strong>seed</strong> and a{" "}
          <strong>bloom</strong> — each a full shape with its own dials and colour
          — and the seed sprouts from a point, unfurls, and morphs into the bloom.
          Video export lands next; for now, play and scrub the growth.
        </p>
      </div>

      <div className="container-page bl-grid">
        {/* ── Preview stage ── */}
        <div className="bl-stage">
          <div className={`bl-frame bl-bg-${background}`}>
            <canvas ref={canvasRef} className="bl-canvas" aria-label="Bloom animation preview" />
          </div>

          <div className="bl-transport">
            <button type="button" className="bl-btn" onClick={() => setPlaying((p) => !p)}>
              {playing ? "❚❚ Pause" : "▶ Play"}
            </button>
          </div>

          <label className="bl-scrub">
            <span className="bl-scrub-head">
              <span className="bl-dial-label">Bloom</span>
              <span className="t-mono bl-dial-val">{Math.round(bloomAmt * 100)}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={bloomAmt}
              disabled={playing}
              onChange={(e) => setBloomAmt(parseFloat(e.target.value))}
            />
          </label>

          <div className="bl-meta">
            <span className="t-mono bl-meta-text">
              {familyById(seed.familyId).label.toUpperCase()} → {familyById(bloom.familyId).label.toUpperCase()} ·{" "}
              {background.toUpperCase()}
            </span>
            <span className="bl-meta-swatches" aria-hidden>
              <span className="bl-swatch" style={{ background: swatchGradient(seed.palette) }} />
              <span className="bl-swatch" style={{ background: swatchGradient(bloom.palette) }} />
            </span>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="bl-controls">
          {/* Keyframe picker */}
          <fieldset className="bl-field">
            <legend className="t-label bl-legend">Keyframe</legend>
            <div className="bl-seg">
              {(["seed", "bloom"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  className="bl-seg-btn"
                  data-active={w === active}
                  aria-pressed={w === active}
                  onClick={() => setActive(w)}
                >
                  <span
                    className="bl-seg-swatch"
                    style={{ background: swatchGradient(w === "seed" ? seed.palette : bloom.palette) }}
                  />
                  {w}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Family */}
          <fieldset className="bl-field">
            <div className="bl-legend-row">
              <legend className="t-label bl-legend">{active} · Family</legend>
              <button type="button" className="t-mono bl-mini" onClick={randomizeShape}>
                Randomize
              </button>
            </div>
            <div className="bl-chips">
              {SHAPE_FAMILIES.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  className="bl-chip"
                  data-active={fam.id === activeKf.familyId}
                  aria-pressed={fam.id === activeKf.familyId}
                  onClick={() => selectFamily(fam.id)}
                >
                  {fam.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Shape dials */}
          <fieldset className="bl-field">
            <legend className="t-label bl-legend">Shape</legend>
            {family.params.length > 0 ? (
              <div className="bl-dials">
                {family.params.map((spec) => (
                  <Dial key={spec.id} spec={spec} value={activeKf.values[spec.id]} onChange={(v) => setParam(spec.id, v)} />
                ))}
              </div>
            ) : (
              <p className="bl-empty">No shape dials — bend it with Transform &amp; Effects below.</p>
            )}
          </fieldset>

          {/* Transform */}
          <fieldset className="bl-field">
            <legend className="t-label bl-legend">Transform</legend>
            <div className="bl-dials">
              {MODIFIER_SPECS.transform.map((spec) => (
                <Dial
                  key={spec.id}
                  spec={spec}
                  value={activeKf.modifiers[spec.id as keyof Modifiers]}
                  onChange={(v) => setModifier(spec.id, v)}
                />
              ))}
            </div>
          </fieldset>

          {/* Effects */}
          <fieldset className="bl-field">
            <legend className="t-label bl-legend">Effects</legend>
            <div className="bl-dials">
              {EFFECT_SPECS.map((spec) => (
                <Dial
                  key={spec.id}
                  spec={spec}
                  value={activeKf.modifiers[spec.id as keyof Modifiers]}
                  onChange={(v) => setModifier(spec.id, v)}
                />
              ))}
            </div>
          </fieldset>

          {/* Colour */}
          <fieldset className="bl-field">
            <legend className="t-label bl-legend">{active} colour</legend>
            <button type="button" className="bl-btn bl-btn-primary" onClick={randomizeColors}>
              Randomize colours
            </button>
          </fieldset>

          {/* Growth — the rules that turn the seed into the plant */}
          <fieldset className="bl-field">
            <legend className="t-label bl-legend">Growth</legend>
            <div className="bl-dials">
              {GROWTH_SPECS.map((spec) => (
                <Dial
                  key={spec.id}
                  spec={spec}
                  value={growth[spec.id as keyof GrowthOptions]}
                  onChange={(v) => setGrowthParam(spec.id, v)}
                />
              ))}
              <Dial spec={HOLD_SPEC} value={hold} onChange={setHold} />
              <Dial spec={DURATION_SPEC} value={duration} onChange={setDuration} />
            </div>
          </fieldset>

          {/* Output */}
          <fieldset className="bl-field">
            <legend className="t-label bl-legend">Output</legend>
            <div className="bl-dials" style={{ marginBottom: 18 }}>
              <Dial spec={PIXEL_SPEC} value={pixelScale} onChange={setPixelScale} />
            </div>
            <span className="bl-dial-label bl-out-label">Background</span>
            <div className="bl-seg bl-seg-3">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className="bl-seg-btn"
                  data-active={bg.id === background}
                  aria-pressed={bg.id === background}
                  onClick={() => setBackground(bg.id)}
                >
                  {bg.label}
                </button>
              ))}
            </div>
            <p className="bl-note t-mono">VIDEO EXPORT · NEXT PASS</p>
          </fieldset>
        </div>
      </div>

      <style>{`
        .bl { padding-top: 40px; padding-bottom: 96px; }
        .bl-head { padding-top: 16px; padding-bottom: 40px; }
        .bl-kicker { opacity: 0.55; margin: 0 0 18px; letter-spacing: 0.18em; }
        .bl-title { margin: 0 0 18px; }
        .bl-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300; font-size: 16px; line-height: 1.55;
          max-width: 560px; opacity: 0.72; margin: 0;
        }
        .bl-deck strong { font-weight: 500; opacity: 1; }

        .bl-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
        @media (min-width: 900px) {
          .bl-grid { grid-template-columns: minmax(0, 1fr) minmax(340px, 440px); gap: 64px; }
        }

        /* ── Preview ── */
        .bl-stage { position: sticky; top: 88px; display: flex; flex-direction: column; gap: 16px; }
        .bl-frame {
          position: relative; width: 100%; aspect-ratio: 1 / 1;
          border: 0.5px solid var(--hairline-strong); overflow: hidden;
        }
        .bl-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .bl-bg-white { background: #ffffff; }
        .bl-bg-black { background: #000000; }
        .bl-bg-transparent {
          background-color: #e7e7e7;
          background-image:
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%),
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%);
          background-size: 22px 22px;
          background-position: 0 0, 11px 11px;
        }
        .bl-transport { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .bl-scrub { display: flex; flex-direction: column; gap: 7px; }
        .bl-scrub-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .bl-scrub input[type="range"] {
          -webkit-appearance: none; appearance: none; width: 100%; height: 2px;
          background: var(--hairline-strong); accent-color: var(--ground); cursor: pointer;
        }
        .bl-scrub input[type="range"]:disabled { opacity: 0.4; cursor: default; }
        .bl-meta { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .bl-meta-text { opacity: 0.6; }
        .bl-meta-swatches { display: inline-flex; gap: 4px; flex-shrink: 0; }
        .bl-swatch { width: 26px; height: 14px; display: block; border: 0.5px solid var(--hairline-strong); }

        /* ── Controls ── */
        .bl-controls { display: flex; flex-direction: column; gap: 30px; }
        .bl-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .bl-legend-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .bl-legend { padding: 0; opacity: 0.72; text-transform: capitalize; }
        .bl-field > .bl-legend { margin-bottom: 14px; }
        .bl-mini {
          background: none; border: none; cursor: pointer; color: var(--ground);
          opacity: 0.6; padding: 0; letter-spacing: 0.08em;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .bl-mini:hover { opacity: 1; }

        .bl-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .bl-chip {
          font-family: var(--font-plex-mono), ui-monospace, monospace; font-size: 11px; letter-spacing: 0.04em;
          padding: 8px 12px; border: 0.5px solid var(--hairline-strong); background: transparent;
          color: var(--ground); cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .bl-chip:hover { border-color: var(--ground); }
        .bl-chip[data-active="true"] { background: var(--ground); border-color: var(--ground); color: var(--signal); }

        /* ── Dials ── */
        .bl-dials { display: flex; flex-direction: column; gap: 16px; }
        .bl-dial { display: flex; flex-direction: column; gap: 7px; }
        .bl-dial-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .bl-dial-label { font-family: var(--font-inter), sans-serif; font-weight: 400; font-size: 13px; opacity: 0.85; }
        .bl-dial-val { opacity: 0.55; }
        .bl-dial input[type="range"] {
          -webkit-appearance: none; appearance: none; width: 100%; height: 2px;
          background: var(--hairline-strong); accent-color: var(--ground); cursor: pointer;
        }
        .bl-empty { margin: 0; font-size: 13px; font-weight: 300; opacity: 0.5; }

        /* ── Segmented + buttons ── */
        .bl-out-label { display: block; margin-bottom: 8px; }
        .bl-seg { display: grid; grid-template-columns: 1fr 1fr; border: 0.5px solid var(--hairline-strong); }
        .bl-seg-3 { grid-template-columns: repeat(3, 1fr); }
        .bl-seg-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 8px;
          background: transparent; color: var(--ground); border: none;
          border-right: 0.5px solid var(--hairline-strong); cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .bl-seg-btn:last-child { border-right: none; }
        .bl-seg-btn:hover { background: var(--hairline); }
        .bl-seg-btn[data-active="true"] { background: var(--ground); color: var(--signal); }
        .bl-seg-swatch { width: 18px; height: 12px; display: block; border: 0.5px solid rgba(127,127,127,0.4); }

        .bl-btn {
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase; padding: 14px 24px;
          border: 1px solid var(--ground); background: transparent; color: var(--ground); cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .bl-btn:hover { background: var(--ground); color: var(--signal); }
        .bl-btn-primary { width: 100%; background: var(--ground); color: var(--signal); }
        .bl-btn-primary:hover { opacity: 0.85; }

        .bl-note { opacity: 0.4; letter-spacing: 0.18em; margin: 18px 0 0; }
      `}</style>
    </section>
  );
}
