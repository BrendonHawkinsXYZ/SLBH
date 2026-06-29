"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SHAPE_FAMILIES,
  PRESETS,
  MODIFIER_SPECS,
  DEFAULT_MODIFIERS,
  defaultValues,
  familyById,
  resolveShape,
  makePalette,
  type Modifiers,
  type Palette,
  type ParamSpec,
  type ParamValues,
} from "@/lib/shapeField";
import { SequenceField, type Slot as FieldSlot } from "@/lib/sequenceField";

// ── Poster template (4:5) ──
const TPL = {
  W: 2000,
  H: 2500,
  cx: 1000,
  cy: 1185,
  shapeSize: 1300,
  topY: 300,
  topFont: 60,
  wordY: 2360,
  wordFont: 54,
};
const DURATION_MS = 15000;
const MIN_SLOTS = 2;
const MAX_SLOTS = 5;

const TRANSFORM_SPECS = MODIFIER_SPECS.transform;
const EFFECT_SPECS = MODIFIER_SPECS.effects.filter((s) => s.id !== "pixelScale");
const PIXEL_SPEC = MODIFIER_SPECS.effects.find((s) => s.id === "pixelScale") as ParamSpec;

type SlotState = {
  id: number;
  familyId: string;
  values: ParamValues;
  modifiers: Modifiers;
  palette: Palette;
};

let slotSeq = 0;
function slotFromPreset(presetId: string): SlotState {
  const preset = PRESETS.find((p) => p.id === presetId);
  const familyId = preset?.familyId ?? "round";
  return {
    id: slotSeq++,
    familyId,
    values: { ...defaultValues(familyId), ...(preset?.values ?? {}) },
    modifiers: { ...DEFAULT_MODIFIERS, ...(preset?.modifiers ?? {}) },
    palette: makePalette(),
  };
}

function toFieldSlot(s: SlotState): FieldSlot {
  return { shape: resolveShape(s.familyId, s.values, s.modifiers), palette: s.palette };
}

function formatValue(spec: ParamSpec, v: number): string {
  if (spec.id === "rotation") return `${Math.round(v)}°`;
  if (spec.integer) return String(Math.round(v));
  return v.toFixed(2);
}

function Dial({ spec, value, onChange }: { spec: ParamSpec; value: number; onChange: (v: number) => void }) {
  return (
    <label className="cm-dial">
      <span className="cm-dial-head">
        <span className="cm-dial-label">{spec.label}</span>
        <span className="t-mono cm-dial-val">{formatValue(spec, value)}</span>
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

export function ChromaStudio() {
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<SequenceField | null>(null);

  const [slots, setSlots] = useState<SlotState[]>(() => [
    slotFromPreset("flower"),
    slotFromPreset("ellipse"),
    slotFromPreset("blob"),
  ]);
  const [active, setActive] = useState(0);
  const [pixelScale, setPixelScale] = useState(1);
  const [background, setBackground] = useState<"white" | "black">("white");
  const [topText, setTopText] = useState("What does emotion look like?");
  const [playing, setPlaying] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportPct, setExportPct] = useState(0);
  const [fonts, setFonts] = useState({ inter: "Inter, sans-serif", orbitron: "Orbitron, sans-serif" });

  const activeSlot = slots[Math.min(active, slots.length - 1)];

  // Resolve canvas font family names from the next/font CSS variables, once loaded.
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const inter = root.getPropertyValue("--font-inter").trim() || "Inter, sans-serif";
    const orbitron = root.getPropertyValue("--font-orbitron").trim() || "Orbitron, sans-serif";
    let cancelled = false;
    const apply = () => !cancelled && setFonts({ inter, orbitron });
    if (document.fonts) {
      Promise.all([
        document.fonts.load(`500 ${TPL.topFont}px ${inter}`),
        document.fonts.load(`700 ${TPL.wordFont}px ${orbitron}`),
      ])
        .then(apply)
        .catch(apply);
    } else {
      apply();
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Paint one poster frame into a context already placed in template coordinates.
  const paint = useCallback(
    (ctx: CanvasRenderingContext2D, field: SequenceField | null, progress: number) => {
      ctx.clearRect(0, 0, TPL.W, TPL.H);
      ctx.fillStyle = background === "white" ? "#ffffff" : "#0A0A0A";
      ctx.fillRect(0, 0, TPL.W, TPL.H);

      const ink = background === "white" ? "#0A0A0A" : "#F5F5F3";
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (topText.trim()) {
        ctx.font = `500 ${TPL.topFont}px ${fonts.inter}`;
        if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
        ctx.fillText(topText, TPL.W / 2, TPL.topY);
      }

      field?.render(ctx, TPL.cx, TPL.cy, progress);

      ctx.fillStyle = ink;
      ctx.font = `700 ${TPL.wordFont}px ${fonts.orbitron}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "12px";
      ctx.fillText("CHROMA", TPL.W / 2 + 6, TPL.wordY);
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
    },
    [background, topText, fonts],
  );

  // Draw the preview canvas (template scaled to fit), at a given progress.
  const drawPreview = useCallback(
    (progress: number) => {
      const canvas = previewRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (cssW <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const scale = w / TPL.W;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      paint(ctx, fieldRef.current, progress);
    },
    [paint],
  );

  // Build the field: just the active slot while paused (snappy editing), the full
  // sequence while playing.
  useEffect(() => {
    const built = playing ? slots.map(toFieldSlot) : [toFieldSlot(activeSlot)];
    fieldRef.current = new SequenceField(TPL.shapeSize, built, pixelScale);
    if (!playing) drawPreview(0);
  }, [playing, slots, activeSlot, pixelScale, drawPreview]);

  // Playback loop.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      drawPreview(((now - start) % DURATION_MS) / DURATION_MS);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, drawPreview]);

  // Redraw the still preview on resize while paused.
  useEffect(() => {
    if (playing) return;
    const canvas = previewRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => drawPreview(0));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [playing, drawPreview]);

  // ── Slot edits ──
  const patchActive = useCallback(
    (patch: Partial<SlotState>) => {
      setSlots((prev) => prev.map((s, i) => (i === active ? { ...s, ...patch } : s)));
    },
    [active],
  );

  const setParam = useCallback(
    (id: string, v: number) => patchActive({ values: { ...activeSlot.values, [id]: v } }),
    [patchActive, activeSlot],
  );
  const setModifier = useCallback(
    (id: string, v: number) => patchActive({ modifiers: { ...activeSlot.modifiers, [id]: v } }),
    [patchActive, activeSlot],
  );
  const selectFamily = useCallback(
    (id: string) => patchActive({ familyId: id, values: defaultValues(id) }),
    [patchActive],
  );
  const randomizeColors = useCallback(() => patchActive({ palette: makePalette() }), [patchActive]);

  const randomizeShape = useCallback(() => {
    const fam = SHAPE_FAMILIES[Math.floor(Math.random() * SHAPE_FAMILIES.length)];
    const vals: ParamValues = {};
    for (const spec of fam.params) {
      const steps = Math.round((spec.max - spec.min) / spec.step);
      vals[spec.id] = +(spec.min + Math.round(Math.random() * steps) * spec.step).toFixed(4);
    }
    patchActive({
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
    });
  }, [patchActive]);

  const addSlot = useCallback(() => {
    setSlots((prev) => {
      if (prev.length >= MAX_SLOTS) return prev;
      const next = [...prev, { ...prev[prev.length - 1], id: slotSeq++, palette: makePalette() }];
      setActive(next.length - 1);
      return next;
    });
  }, []);

  const removeSlot = useCallback(
    (index: number) => {
      setSlots((prev) => {
        if (prev.length <= MIN_SLOTS) return prev;
        const next = prev.filter((_, i) => i !== index);
        setActive((a) => Math.min(a, next.length - 1));
        return next;
      });
    },
    [],
  );

  // ── Video export (MediaRecorder → mp4 if supported, else webm) ──
  const exportVideo = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    setExportPct(0);
    setPlaying(false);
    try {
      if (document.fonts) await document.fonts.ready;
      const field = new SequenceField(TPL.shapeSize, slots.map(toFieldSlot), pixelScale);
      const cvs = document.createElement("canvas");
      cvs.width = TPL.W;
      cvs.height = TPL.H;
      const ctx = cvs.getContext("2d");
      if (!ctx) throw new Error("no 2d context");

      const candidates = [
        "video/mp4;codecs=avc1.42E01E",
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      const mime = candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
      const ext = mime.includes("mp4") ? "mp4" : "webm";

      const stream = cvs.captureStream(30);
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 16_000_000 } : undefined);
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const stopped = new Promise<void>((res) => (rec.onstop = () => res()));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      paint(ctx, field, 0);
      rec.start();

      const start = performance.now();
      await new Promise<void>((resolve) => {
        const loop = (now: number) => {
          const el = now - start;
          const pr = Math.min(el / DURATION_MS, 0.999999);
          paint(ctx, field, pr);
          setExportPct(Math.min(1, el / DURATION_MS));
          if (el < DURATION_MS) requestAnimationFrame(loop);
          else resolve();
        };
        requestAnimationFrame(loop);
      });

      rec.stop();
      await stopped;
      const blob = new Blob(chunks, { type: mime || "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chroma-${slots.length}shapes-15s.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
      setExportPct(0);
      drawPreview(0);
    }
  }, [exporting, slots, pixelScale, paint, drawPreview]);

  const family = familyById(activeSlot.familyId);
  const secondsEach = (15 / slots.length).toFixed(1);

  return (
    <section className="cm">
      <div className="container-page cm-head">
        <p className="t-mono cm-kicker">SHAPES / CHROMA</p>
        <h1 className="t-h1 cm-title">Chroma sequencer</h1>
        <p className="cm-deck">
          Sequence {MIN_SLOTS}–{MAX_SLOTS} field shapes morphing into one another
          across a 15-second loop, on the CHROMA poster template, and export it as
          a video — all in the browser.
        </p>
      </div>

      <div className="container-page cm-grid">
        {/* ── Preview ── */}
        <div className="cm-stage">
          <div className={`cm-frame cm-bg-${background}`}>
            <canvas ref={previewRef} className="cm-canvas" aria-label="CHROMA poster preview" />
          </div>
          <div className="cm-transport">
            <button type="button" className="cm-btn" onClick={() => setPlaying((p) => !p)} disabled={exporting}>
              {playing ? "❚❚ Pause" : "▶ Play 15s"}
            </button>
            <button type="button" className="cm-btn cm-btn-primary" onClick={exportVideo} disabled={exporting}>
              {exporting ? `Recording ${Math.round(exportPct * 100)}%` : "Export video"}
            </button>
          </div>
          <p className="t-mono cm-note">
            {slots.length} SHAPES · {secondsEach}s EACH · 2000×2500 · MP4/WEBM
          </p>
        </div>

        {/* ── Controls ── */}
        <div className="cm-controls">
          {/* Slot tabs */}
          <fieldset className="cm-field">
            <div className="cm-legend-row">
              <legend className="t-label cm-legend">Sequence</legend>
              <span className="t-mono cm-sub">15s loop</span>
            </div>
            <div className="cm-slots">
              {slots.map((s, i) => (
                <div key={s.id} className={`cm-slot${i === active ? " cm-slot-active" : ""}`}>
                  <button type="button" className="cm-slot-btn" onClick={() => setActive(i)}>
                    <span className="cm-slot-swatch" style={{ background: swatchGradient(s.palette) }} />
                    <span className="t-mono cm-slot-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cm-slot-name">{familyById(s.familyId).label}</span>
                  </button>
                  {slots.length > MIN_SLOTS && (
                    <button
                      type="button"
                      className="cm-slot-x"
                      aria-label={`Remove shape ${i + 1}`}
                      onClick={() => removeSlot(i)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {slots.length < MAX_SLOTS && (
                <button type="button" className="cm-slot-add" onClick={addSlot} aria-label="Add shape">
                  +
                </button>
              )}
            </div>
          </fieldset>

          {/* Active slot editor */}
          <fieldset className="cm-field">
            <div className="cm-legend-row">
              <legend className="t-label cm-legend">Shape {active + 1} · Family</legend>
              <button type="button" className="t-mono cm-mini" onClick={randomizeShape}>
                🎲 Random
              </button>
            </div>
            <div className="cm-chips">
              {SHAPE_FAMILIES.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  className="cm-chip"
                  data-active={fam.id === activeSlot.familyId}
                  onClick={() => selectFamily(fam.id)}
                >
                  {fam.label}
                </button>
              ))}
            </div>
          </fieldset>

          {family.params.length > 0 && (
            <fieldset className="cm-field">
              <legend className="t-label cm-legend">Dials</legend>
              <div className="cm-dials">
                {family.params.map((spec) => (
                  <Dial key={spec.id} spec={spec} value={activeSlot.values[spec.id]} onChange={(v) => setParam(spec.id, v)} />
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="cm-field">
            <legend className="t-label cm-legend">Transform &amp; effects</legend>
            <div className="cm-dials">
              {[...TRANSFORM_SPECS, ...EFFECT_SPECS].map((spec) => (
                <Dial
                  key={spec.id}
                  spec={spec}
                  value={activeSlot.modifiers[spec.id as keyof Modifiers]}
                  onChange={(v) => setModifier(spec.id, v)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="cm-field">
            <legend className="t-label cm-legend">Shape {active + 1} colour</legend>
            <button type="button" className="cm-btn cm-btn-primary cm-btn-block" onClick={randomizeColors}>
              Randomize colours
            </button>
          </fieldset>

          {/* Global */}
          <fieldset className="cm-field">
            <legend className="t-label cm-legend">Output</legend>
            <div className="cm-dials">
              <Dial spec={PIXEL_SPEC} value={pixelScale} onChange={setPixelScale} />
            </div>
            <div className="cm-seg cm-seg-2">
              {(["white", "black"] as const).map((bg) => (
                <button
                  key={bg}
                  type="button"
                  className="cm-seg-btn"
                  data-active={bg === background}
                  onClick={() => setBackground(bg)}
                >
                  {bg}
                </button>
              ))}
            </div>
            <label className="cm-textfield">
              <span className="cm-dial-label">Top line</span>
              <input type="text" value={topText} maxLength={60} onChange={(e) => setTopText(e.target.value)} />
            </label>
          </fieldset>
        </div>
      </div>

      <style>{`
        .cm { padding-top: 40px; padding-bottom: 96px; }
        .cm-head { padding-top: 16px; padding-bottom: 40px; }
        .cm-kicker { opacity: 0.55; margin: 0 0 18px; letter-spacing: 0.18em; }
        .cm-title { margin: 0 0 18px; }
        .cm-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300; font-size: 16px; line-height: 1.55;
          max-width: 540px; opacity: 0.72; margin: 0;
        }
        .cm-grid { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: start; }
        @media (min-width: 900px) {
          .cm-grid { grid-template-columns: minmax(0, 1fr) minmax(360px, 460px); gap: 64px; }
        }

        .cm-stage { position: sticky; top: 88px; display: flex; flex-direction: column; gap: 16px; }
        .cm-frame {
          position: relative; width: 100%; aspect-ratio: 4 / 5;
          border: 0.5px solid var(--hairline-strong); overflow: hidden;
        }
        .cm-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .cm-bg-white { background: #ffffff; }
        .cm-bg-black { background: #000000; }
        .cm-transport { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .cm-note { opacity: 0.5; text-align: center; margin: 0; }

        .cm-controls { display: flex; flex-direction: column; gap: 28px; }
        .cm-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .cm-legend-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .cm-legend { padding: 0; opacity: 0.72; }
        .cm-field > .cm-legend { margin-bottom: 14px; }
        .cm-sub { opacity: 0.45; }
        .cm-mini { background: none; border: none; cursor: pointer; color: var(--ground); opacity: 0.6; padding: 0; letter-spacing: 0.08em; transition: opacity var(--d-fast) var(--ease-out); }
        .cm-mini:hover { opacity: 1; }

        /* Slots */
        .cm-slots { display: flex; flex-wrap: wrap; gap: 8px; align-items: stretch; }
        .cm-slot { position: relative; display: flex; }
        .cm-slot-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px 8px 8px; border: 0.5px solid var(--hairline-strong);
          background: transparent; color: var(--ground); cursor: pointer;
          transition: border-color var(--d-fast) var(--ease-out);
        }
        .cm-slot-btn:hover { border-color: var(--ground); }
        .cm-slot-active .cm-slot-btn { border-color: var(--ground); box-shadow: inset 0 0 0 1px var(--ground); }
        .cm-slot-swatch { width: 22px; height: 16px; display: block; border: 0.5px solid var(--hairline-strong); }
        .cm-slot-num { opacity: 0.5; }
        .cm-slot-name { font-family: var(--font-plex-mono), ui-monospace, monospace; font-size: 11px; }
        .cm-slot-x {
          position: absolute; top: -7px; right: -7px; width: 18px; height: 18px;
          border-radius: 50%; border: 0.5px solid var(--hairline-strong);
          background: var(--paper); color: var(--ground); cursor: pointer;
          font-size: 12px; line-height: 1; display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity var(--d-fast) var(--ease-out);
        }
        .cm-slot:hover .cm-slot-x { opacity: 1; }
        .cm-slot-add {
          width: 40px; border: 0.5px dashed var(--hairline-strong); background: transparent;
          color: var(--ground); cursor: pointer; font-size: 18px;
        }
        .cm-slot-add:hover { border-color: var(--ground); }

        .cm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .cm-chip {
          font-family: var(--font-plex-mono), ui-monospace, monospace; font-size: 11px; letter-spacing: 0.04em;
          padding: 8px 12px; border: 0.5px solid var(--hairline-strong); background: transparent;
          color: var(--ground); cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .cm-chip:hover { border-color: var(--ground); }
        .cm-chip[data-active="true"] { background: var(--ground); border-color: var(--ground); color: var(--signal); }

        .cm-dials { display: flex; flex-direction: column; gap: 15px; }
        .cm-dial { display: flex; flex-direction: column; gap: 7px; }
        .cm-dial-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
        .cm-dial-label { font-family: var(--font-inter), sans-serif; font-weight: 400; font-size: 13px; opacity: 0.85; }
        .cm-dial-val { opacity: 0.55; }
        .cm-dial input[type="range"] {
          -webkit-appearance: none; appearance: none; width: 100%; height: 2px;
          background: var(--hairline-strong); accent-color: var(--ground); cursor: pointer;
        }
        .cm-textfield { display: flex; flex-direction: column; gap: 7px; margin-top: 14px; }
        .cm-textfield input {
          font-family: var(--font-inter), sans-serif; font-size: 13px; padding: 9px 11px;
          border: 0.5px solid var(--hairline-strong); background: transparent; color: var(--ground);
        }

        .cm-seg { display: grid; border: 0.5px solid var(--hairline-strong); margin-top: 16px; }
        .cm-seg-2 { grid-template-columns: 1fr 1fr; }
        .cm-seg-btn {
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 8px;
          background: transparent; color: var(--ground); border: none; border-right: 0.5px solid var(--hairline-strong);
          cursor: pointer; transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .cm-seg-btn:last-child { border-right: none; }
        .cm-seg-btn:hover { background: var(--hairline); }
        .cm-seg-btn[data-active="true"] { background: var(--ground); color: var(--signal); }

        .cm-btn {
          font-family: var(--font-inter), sans-serif; font-weight: 500; font-size: 11px;
          letter-spacing: 0.16em; text-transform: uppercase; padding: 14px 18px;
          border: 1px solid var(--ground); background: transparent; color: var(--ground); cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out), opacity var(--d-fast) var(--ease-out);
        }
        .cm-btn:hover { background: var(--ground); color: var(--signal); }
        .cm-btn:disabled { opacity: 0.4; cursor: default; }
        .cm-btn-primary { background: var(--ground); color: var(--signal); }
        .cm-btn-primary:hover { opacity: 0.85; background: var(--ground); color: var(--signal); }
        .cm-btn-block { width: 100%; }
      `}</style>
    </section>
  );
}
