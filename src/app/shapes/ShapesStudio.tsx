"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SHAPE_CATALOG,
  makePalette,
  renderShapeField,
  type Background,
  type Palette,
  type ShapeDef,
} from "@/lib/shapeField";

const BACKGROUNDS: { id: Background; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "transparent", label: "Transparent" },
];

const EXPORT_SIZES = [500, 1000];

export function ShapesStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shapeId, setShapeId] = useState<string>(SHAPE_CATALOG[0].id);
  // Lazy init so the first paint already has a fresh colour (client-side random;
  // never rendered into the DOM, so no hydration mismatch).
  const [palette, setPalette] = useState<Palette>(() => makePalette());
  const [background, setBackground] = useState<Background>("white");

  const shape: ShapeDef = SHAPE_CATALOG.find((s) => s.id === shapeId) ?? SHAPE_CATALOG[0];

  // ── Live preview: redraw on any change, and on resize, at device resolution. ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const cssSize = canvas.clientWidth;
      if (cssSize <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssSize * dpr);
      canvas.height = Math.round(cssSize * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderShapeField(ctx, cssSize, palette, shape, background);
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [palette, shape, background]);

  const randomizeColors = useCallback(() => setPalette(makePalette()), []);

  const randomShape = useCallback(() => {
    setShapeId((current) => {
      let next = current;
      while (next === current && SHAPE_CATALOG.length > 1) {
        next = SHAPE_CATALOG[Math.floor(Math.random() * SHAPE_CATALOG.length)].id;
      }
      return next;
    });
  }, []);

  // ── Export: render fresh at exact pixel size, then download a PNG. Same
  //    palette + shape + ground as the preview, so what you see is what you get. ──
  const exportPng = useCallback(
    (px: number) => {
      const c = document.createElement("canvas");
      c.width = px;
      c.height = px;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      renderShapeField(ctx, px, palette, shape, background);
      c.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `slbh-field-${shape.id}-${background}-${px}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, "image/png");
    },
    [palette, shape, background],
  );

  return (
    <section className="shp">
      <div className="container-page shp-head">
        <p className="t-mono shp-kicker">SHAPES / GENERATOR</p>
        <h1 className="t-h1 shp-title">Field shape generator</h1>
        <p className="shp-deck">
          The same mosaic the home Field is built from, poured into any form.
          Pick a shape, reroll the colour, choose a ground, and export a clean
          PNG.
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
              {shape.label.toUpperCase()} · {background.toUpperCase()}
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
          <fieldset className="shp-field">
            <div className="shp-legend-row">
              <legend className="t-label shp-legend">Shape</legend>
              <button type="button" className="t-mono shp-mini" onClick={randomShape}>
                ↺ Random
              </button>
            </div>
            <div className="shp-shapes">
              {SHAPE_CATALOG.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="shp-chip"
                  data-active={s.id === shapeId}
                  aria-pressed={s.id === shapeId}
                  onClick={() => setShapeId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="shp-field">
            <legend className="t-label shp-legend">Colour</legend>
            <button type="button" className="shp-btn shp-btn-primary" onClick={randomizeColors}>
              Randomize colours
            </button>
          </fieldset>

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
        .shp-title {
          margin: 0 0 18px;
        }
        .shp-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.55;
          max-width: 520px;
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
            grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
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
          gap: 0;
          border: 0.5px solid var(--hairline-strong);
        }
        .shp-swatch {
          width: 18px;
          height: 14px;
          display: block;
        }

        /* ── Controls ── */
        .shp-controls {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .shp-field {
          border: none;
          padding: 0;
          margin: 0;
          min-width: 0;
        }
        .shp-legend-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .shp-legend {
          padding: 0;
          opacity: 0.72;
        }
        .shp-field > .shp-legend { margin-bottom: 14px; }
        .shp-mini {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ground);
          opacity: 0.55;
          padding: 0;
          letter-spacing: 0.08em;
          transition: opacity var(--d-fast) var(--ease-out);
        }
        .shp-mini:hover { opacity: 1; }

        .shp-shapes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
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
        .shp-seg-btn[data-active="true"] {
          background: var(--ground);
          color: var(--signal);
        }

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
        .shp-btn-primary {
          width: 100%;
          background: var(--ground);
          color: var(--signal);
        }
        .shp-btn-primary:hover { opacity: 0.85; }

        .shp-export {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
      `}</style>
    </section>
  );
}
