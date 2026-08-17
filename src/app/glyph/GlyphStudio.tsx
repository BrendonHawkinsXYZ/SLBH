"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SIZE,
  GRID_SIZES,
  type Background,
  type Glyph,
  type Ink,
  cellLine,
  centerGlyph,
  createGlyph,
  filledCount,
  flipGlyph,
  glyphCode,
  glyphSlug,
  glyphToSvg,
  invertGlyph,
  isEmpty,
  nudgeGlyph,
  renderGlyph,
  resizeGlyph,
  rotateGlyph,
  withCells,
} from "@/lib/glyphGrid";

const BACKGROUNDS: { id: Background; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "transparent", label: "None" },
];

const INKS: { id: Ink; label: string }[] = [
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
];

const TOOLS = [
  { id: "pen", label: "Pen" },
  { id: "eraser", label: "Eraser" },
] as const;
type Tool = (typeof TOOLS)[number]["id"];

const MIRRORS = [
  { id: "off", label: "Off" },
  { id: "h", label: "Left / right" },
  { id: "v", label: "Top / bottom" },
  { id: "both", label: "Quad" },
] as const;
type Mirror = (typeof MIRRORS)[number]["id"];

// The sizes a glyph is actually read at — the point of the whole exercise.
const ACTUAL_SIZES = [16, 24, 32];

const MAX_HISTORY = 60;
const MAX_SAVED = 12;

// One SVG cell = one grid pixel; this is only the document's width/height.
const EXPORT_UNIT = 32;

/** Every cell a single stroke touches once the mirror is applied. */
function mirroredCells(x: number, y: number, n: number, mirror: Mirror): [number, number][] {
  const pts: [number, number][] = [[x, y]];
  const mx = n - 1 - x;
  const my = n - 1 - y;
  if (mirror === "h" || mirror === "both") pts.push([mx, y]);
  if (mirror === "v" || mirror === "both") pts.push([x, my]);
  if (mirror === "both") pts.push([mx, my]);
  return pts;
}

function GlyphThumb({
  glyph,
  ink,
  background,
  onPick,
}: {
  glyph: Glyph;
  ink: Ink;
  background: Background;
  onPick: () => void;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(44 * dpr);
    canvas.height = Math.round(44 * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    renderGlyph(ctx, canvas.width, canvas.height, glyph, ink, background);
  }, [glyph, ink, background]);

  return (
    <button
      type="button"
      className="gly-saved-item"
      onClick={onPick}
      title={`Load this glyph — ${glyph.size} × ${glyph.size}`}
    >
      <canvas ref={ref} className="gly-saved-canvas" aria-hidden />
    </button>
  );
}

function ActualSize({
  glyph,
  ink,
  background,
  px,
}: {
  glyph: Glyph;
  ink: Ink;
  background: Background;
  px: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(px * dpr);
    canvas.height = Math.round(px * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    renderGlyph(ctx, canvas.width, canvas.height, glyph, ink, background);
  }, [glyph, ink, background, px]);

  return (
    <span className="gly-actual-item">
      <span className={`gly-actual-frame gly-bg-${background}`}>
        <canvas ref={ref} className="gly-actual-canvas" style={{ width: px, height: px }} aria-hidden />
      </span>
      <span className="t-mono gly-actual-label">{px}px</span>
    </span>
  );
}

export function GlyphStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [glyph, setGlyph] = useState<Glyph>(() => createGlyph(DEFAULT_SIZE));
  const [past, setPast] = useState<Glyph[]>([]);
  const [future, setFuture] = useState<Glyph[]>([]);
  const [tool, setTool] = useState<Tool>("pen");
  const [mirror, setMirror] = useState<Mirror>("off");
  const [guides, setGuides] = useState(true);
  const [ink, setInk] = useState<Ink>("black");
  const [background, setBackground] = useState<Background>("white");
  const [saved, setSaved] = useState<Glyph[]>([]);
  const [cursor, setCursor] = useState<[number, number]>([0, 0]);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [keyed, setKeyed] = useState(false);
  const [copied, setCopied] = useState(false);

  // The stroke path writes through this ref so a fast drag never reads stale
  // state between two pointer events in the same frame. Every edit sets it
  // alongside the state; the effect below is only the safety sync.
  const glyphRef = useRef(glyph);
  useEffect(() => {
    glyphRef.current = glyph;
  }, [glyph]);

  const strokeRef = useRef<{
    erase: boolean;
    last: [number, number];
    before: Glyph;
    pushed: boolean;
  } | null>(null);

  const count = filledCount(glyph);
  const code = useMemo(() => glyphCode(glyph), [glyph]);
  const empty = count === 0;

  /** Single source of truth for an edit: records history, moves the glyph. */
  const commit = useCallback((next: Glyph) => {
    const current = glyphRef.current;
    if (next === current) return;
    setPast((p) => [...p, current].slice(-MAX_HISTORY));
    setFuture([]);
    glyphRef.current = next;
    setGlyph(next);
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setFuture([glyphRef.current, ...future].slice(0, MAX_HISTORY));
    setPast(past.slice(0, -1));
    glyphRef.current = previous;
    setGlyph(previous);
  }, [past, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setPast([...past, glyphRef.current].slice(-MAX_HISTORY));
    setFuture(future.slice(1));
    glyphRef.current = next;
    setGlyph(next);
  }, [past, future]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // ── The grid: glyph, lattice, guides, and the cell under the pointer. ──
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

      const w = canvas.width;
      const h = canvas.height;
      const n = glyph.size;
      renderGlyph(ctx, w, h, glyph, ink, background);

      const cell = Math.min(w, h) / n;
      const at = (i: number) => Math.round(i * cell) + 0.5;
      const dark = background === "black" || (background === "transparent" && ink === "white");
      const line = dark ? "rgba(245, 245, 243, 0.15)" : "rgba(10, 10, 10, 0.11)";
      const guide = dark ? "rgba(245, 245, 243, 0.42)" : "rgba(10, 10, 10, 0.40)";

      ctx.lineWidth = 1;
      for (let i = 0; i <= n; i++) {
        const strong = guides && (i % 4 === 0 || i === n / 2);
        ctx.strokeStyle = strong ? guide : line;
        ctx.beginPath();
        ctx.moveTo(at(i), 0);
        ctx.lineTo(at(i), Math.round(n * cell));
        ctx.moveTo(0, at(i));
        ctx.lineTo(Math.round(n * cell), at(i));
        ctx.stroke();
      }

      const mark = keyed ? cursor : hover;
      if (mark) {
        const [cx, cy] = mark;
        ctx.strokeStyle = dark ? "#F5F5F3" : "#0A0A0A";
        ctx.lineWidth = keyed ? 3 : 2;
        ctx.strokeRect(at(cx), at(cy), Math.round(cell), Math.round(cell));
      }
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
  }, [glyph, ink, background, guides, hover, cursor, keyed]);

  const cellFromEvent = useCallback(
    (e: { clientX: number; clientY: number }): [number, number] | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const n = glyphRef.current.size;
      const size = Math.min(rect.width, rect.height);
      const x = Math.floor(((e.clientX - rect.left) / size) * n);
      const y = Math.floor(((e.clientY - rect.top) / size) * n);
      if (x < 0 || y < 0 || x >= n || y >= n) return null;
      return [x, y];
    },
    []
  );

  /** Paint the cells a stroke segment covers, history pushed once per stroke. */
  const paint = useCallback((pts: [number, number][], erase: boolean) => {
    const current = glyphRef.current;
    const n = current.size;
    const cells: [number, number][] = [];
    for (const [x, y] of pts) cells.push(...mirroredCells(x, y, n, mirror));
    const next = withCells(current, cells, erase ? 0 : 1);
    if (next === current) return;
    const stroke = strokeRef.current;
    if (stroke && !stroke.pushed) {
      setPast((p) => [...p, stroke.before].slice(-MAX_HISTORY));
      setFuture([]);
      stroke.pushed = true;
    }
    glyphRef.current = next;
    setGlyph(next);
  }, [mirror]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const cell = cellFromEvent(e);
      if (!cell) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      // Alt or the right button runs the other tool without leaving this one.
      const flipped = e.altKey || e.button === 2;
      const erase = flipped ? tool === "pen" : tool === "eraser";
      strokeRef.current = { erase, last: cell, before: glyphRef.current, pushed: false };
      setKeyed(false);
      setCursor(cell);
      paint([cell], erase);
    },
    [cellFromEvent, paint, tool]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const cell = cellFromEvent(e);
      setHover(cell);
      const stroke = strokeRef.current;
      if (!stroke || !cell) return;
      const [lx, ly] = stroke.last;
      if (lx === cell[0] && ly === cell[1]) return;
      paint(cellLine(lx, ly, cell[0], cell[1]), stroke.erase);
      stroke.last = cell;
    },
    [cellFromEvent, paint]
  );

  const endStroke = useCallback(() => {
    strokeRef.current = null;
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      const n = glyphRef.current.size;
      const [cx, cy] = cursor;
      const step = (dx: number, dy: number) => {
        e.preventDefault();
        setKeyed(true);
        setCursor([Math.min(n - 1, Math.max(0, cx + dx)), Math.min(n - 1, Math.max(0, cy + dy))]);
      };
      if (e.key === "ArrowLeft") return step(-1, 0);
      if (e.key === "ArrowRight") return step(1, 0);
      if (e.key === "ArrowUp") return step(0, -1);
      if (e.key === "ArrowDown") return step(0, 1);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setKeyed(true);
        const current = glyphRef.current;
        const on = current.cells[cy * n + cx] === 1;
        commit(withCells(current, mirroredCells(cx, cy, n, mirror), on ? 0 : 1));
      }
    },
    [cursor, commit, mirror]
  );

  const pickSize = useCallback(
    (size: number) => {
      if (size === glyphRef.current.size) return;
      commit(resizeGlyph(glyphRef.current, size));
      setCursor(([x, y]) => [Math.min(size - 1, x), Math.min(size - 1, y)]);
    },
    [commit]
  );

  const saveGlyph = useCallback(() => {
    if (isEmpty(glyph)) return;
    setSaved((all) => [...all, glyph].slice(-MAX_SAVED));
  }, [glyph]);

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
    const svg = glyphToSvg(glyph, ink, background, EXPORT_UNIT);
    download(new Blob([svg], { type: "image/svg+xml" }), `slbh-glyph-${glyphSlug(glyph)}.svg`);
  }, [glyph, ink, background, download]);

  const copySvg = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(glyphToSvg(glyph, ink, background, EXPORT_UNIT));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [glyph, ink, background]);

  return (
    <section className="gly">
      <div className="container-page gly-head">
        <p className="t-mono gly-kicker">GLYPH / EDITOR</p>
        <h1 className="t-h1 gly-title">Pixel emoji instrument</h1>
        <p className="gly-deck">
          Shigetaka Kurita drew the first emoji set on a 12 × 12 monochrome grid
          — a hundred and forty-four squares to carry weather, feeling, and
          intent at the size of a thumbnail. Same constraint here: choose the
          pixel count, fill the cells by hand, and let the shape do the work.
          The export traces the boundary between ink and ground into one clean
          vector path, so the glyph scales without a seam.
        </p>
      </div>

      <div className="container-page gly-grid">
        {/* ── The grid ── */}
        <div className="gly-stage">
          <div className={`gly-frame gly-bg-${background}`}>
            <canvas
              ref={canvasRef}
              className="gly-canvas"
              role="application"
              tabIndex={0}
              aria-label={`Glyph grid, ${glyph.size} by ${glyph.size} cells. Click or drag to draw. Arrow keys move the cursor, space fills.`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onPointerLeave={() => setHover(null)}
              onKeyDown={onKeyDown}
              onBlur={() => setKeyed(false)}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          <div className="gly-meta">
            <span className="t-mono gly-meta-text">
              <span className="gly-meta-line">
                {glyph.size} × {glyph.size} · {glyph.size * glyph.size} CELLS
              </span>
              <span className="gly-meta-line">
                {count} FILLED · {((count / (glyph.size * glyph.size)) * 100).toFixed(0)}% INKED
              </span>
              <span className="gly-meta-line">
                {tool.toUpperCase()} · MIRROR {mirror.toUpperCase()}
              </span>
            </span>
            <span className="gly-actual">
              {ACTUAL_SIZES.map((px) => (
                <ActualSize key={px} glyph={glyph} ink={ink} background={background} px={px} />
              ))}
            </span>
          </div>

          <span className="t-mono gly-code" title="Glyph code — grid size, then the bitmap as hex">
            {code}
          </span>

          <div className="gly-saved-block">
            <span className="t-label gly-legend gly-saved-legend">Saved glyphs</span>
            {saved.length > 0 ? (
              <div className="gly-saved">
                {saved.map((g, i) => (
                  <GlyphThumb
                    key={i}
                    glyph={g}
                    ink={ink}
                    background={background === "transparent" ? "transparent" : background}
                    onPick={() => commit(g)}
                  />
                ))}
              </div>
            ) : (
              <p className="gly-empty">Nothing saved yet — the last {MAX_SAVED} glyphs land here, ready to reload.</p>
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="gly-controls">
          <fieldset className="gly-field">
            <legend className="t-label gly-legend">Grid</legend>
            <div className="gly-seg gly-seg-4">
              {GRID_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className="gly-seg-btn"
                  data-active={size === glyph.size}
                  aria-pressed={size === glyph.size}
                  onClick={() => pickSize(size)}
                >
                  {size}²
                </button>
              ))}
            </div>
            <p className="gly-note">
              Changing the grid re-samples what is already drawn, so the shape survives the move — coarser or
              finer, never blank.
            </p>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">Tool</legend>
            <div className="gly-chips" role="group" aria-label="Tool">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="gly-chip"
                  data-active={t.id === tool}
                  aria-pressed={t.id === tool}
                  onClick={() => setTool(t.id)}
                >
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                className="gly-chip"
                data-active={guides}
                aria-pressed={guides}
                onClick={() => setGuides((g) => !g)}
              >
                Guides
              </button>
            </div>
            <p className="gly-note">
              Click or drag to draw. Hold Alt — or use the right button — to run the other tool without
              switching. Arrow keys walk the cursor, space fills.
            </p>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">Mirror</legend>
            <div className="gly-chips" role="group" aria-label="Mirror">
              {MIRRORS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="gly-chip"
                  data-active={m.id === mirror}
                  aria-pressed={m.id === mirror}
                  onClick={() => setMirror(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="gly-note">Every stroke echoes across the axis — faces, flowers, and arrows stay true.</p>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">Ink</legend>
            <div className="gly-seg gly-seg-2">
              {INKS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  className="gly-seg-btn"
                  data-active={i.id === ink}
                  aria-pressed={i.id === ink}
                  onClick={() => setInk(i.id)}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">Ground</legend>
            <div className="gly-seg gly-seg-3">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  className="gly-seg-btn"
                  data-active={bg.id === background}
                  aria-pressed={bg.id === background}
                  onClick={() => setBackground(bg.id)}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">Transform</legend>
            <div className="gly-chips" role="group" aria-label="Transform">
              <button type="button" className="gly-chip" onClick={() => commit(flipGlyph(glyph, "h"))}>
                Flip H
              </button>
              <button type="button" className="gly-chip" onClick={() => commit(flipGlyph(glyph, "v"))}>
                Flip V
              </button>
              <button type="button" className="gly-chip" onClick={() => commit(rotateGlyph(glyph))}>
                Rotate
              </button>
              <button type="button" className="gly-chip" onClick={() => commit(invertGlyph(glyph))}>
                Invert
              </button>
              <button type="button" className="gly-chip" onClick={() => commit(centerGlyph(glyph))}>
                Centre
              </button>
            </div>
            <span className="t-mono gly-sub">Nudge</span>
            <div className="gly-nudge" role="group" aria-label="Nudge">
              <button type="button" className="gly-chip" aria-label="Nudge up" onClick={() => commit(nudgeGlyph(glyph, 0, -1))}>
                ↑
              </button>
              <button type="button" className="gly-chip" aria-label="Nudge left" onClick={() => commit(nudgeGlyph(glyph, -1, 0))}>
                ←
              </button>
              <button type="button" className="gly-chip" aria-label="Nudge down" onClick={() => commit(nudgeGlyph(glyph, 0, 1))}>
                ↓
              </button>
              <button type="button" className="gly-chip" aria-label="Nudge right" onClick={() => commit(nudgeGlyph(glyph, 1, 0))}>
                →
              </button>
            </div>
          </fieldset>

          <div className="gly-actions">
            <button type="button" className="gly-btn" onClick={undo} disabled={past.length === 0}>
              Undo
            </button>
            <button type="button" className="gly-btn" onClick={redo} disabled={future.length === 0}>
              Redo
            </button>
            <button type="button" className="gly-btn" onClick={() => commit(createGlyph(glyph.size))} disabled={empty}>
              Clear
            </button>
          </div>

          <button type="button" className="gly-btn gly-btn-primary" onClick={saveGlyph} disabled={empty}>
            Save glyph
          </button>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">Export</legend>
            <div className="gly-export">
              <button type="button" className="gly-btn" onClick={exportSvg} disabled={empty}>
                SVG
              </button>
              <button type="button" className="gly-btn" onClick={copySvg} disabled={empty}>
                {copied ? "Copied ✓" : "Copy SVG"}
              </button>
            </div>
            <p className="t-mono gly-export-note">
              {glyph.size * EXPORT_UNIT} × {glyph.size * EXPORT_UNIT} · ONE PATH · {ink.toUpperCase()} INK ·{" "}
              {background === "transparent" ? "NO GROUND" : `${background.toUpperCase()} GROUND`}
            </p>
          </fieldset>
        </div>
      </div>

      <style>{`
        .gly {
          padding-top: 40px;
          padding-bottom: 96px;
        }
        .gly-head {
          padding-top: 16px;
          padding-bottom: 40px;
        }
        .gly-kicker {
          opacity: 0.55;
          margin: 0 0 18px;
          letter-spacing: 0.18em;
        }
        .gly-title { margin: 0 0 18px; }
        .gly-deck {
          font-family: var(--font-inter), sans-serif;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.55;
          max-width: 540px;
          opacity: 0.72;
          margin: 0;
        }

        .gly-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .gly-grid {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
            gap: 64px;
          }
        }

        /* ── Stage ── */
        .gly-stage {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 900px) {
          .gly-stage { position: sticky; top: 88px; }
        }
        .gly-frame {
          position: relative;
          width: 100%;
          max-width: 480px;
          aspect-ratio: 1 / 1;
          border: 0.5px solid var(--hairline-strong);
          overflow: hidden;
        }
        .gly-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          cursor: crosshair;
          touch-action: none;
        }
        .gly-canvas:focus-visible { outline: 2px solid var(--ground); outline-offset: 2px; }
        .gly-bg-white { background: #ffffff; }
        .gly-bg-black { background: #000000; }
        .gly-bg-transparent {
          background-color: #e7e7e7;
          background-image:
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%),
            linear-gradient(45deg, #c9c9c9 25%, transparent 25%, transparent 75%, #c9c9c9 75%);
          background-size: 22px 22px;
          background-position: 0 0, 11px 11px;
        }

        .gly-meta {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          max-width: 480px;
        }
        .gly-meta-text { opacity: 0.6; }
        .gly-meta-line { display: block; line-height: 1.7; }

        /* Actual-size proofs — the sizes a glyph is really read at. */
        .gly-actual {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          flex-shrink: 0;
        }
        .gly-actual-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .gly-actual-frame {
          display: block;
          border: 0.5px solid var(--hairline-strong);
          line-height: 0;
          padding: 3px;
        }
        .gly-actual-frame.gly-bg-transparent { background-size: 8px 8px; background-position: 0 0, 4px 4px; }
        .gly-actual-canvas { display: block; image-rendering: pixelated; }
        .gly-actual-label { opacity: 0.4; font-size: 9.5px; letter-spacing: 0.1em; }

        .gly-code {
          display: block;
          max-width: 480px;
          opacity: 0.35;
          letter-spacing: 0.06em;
          word-break: break-all;
          line-height: 1.6;
        }

        .gly-saved-block { max-width: 480px; }
        .gly-saved-legend { display: block; margin-bottom: 12px; }
        .gly-saved { display: flex; flex-wrap: wrap; gap: 6px; }
        .gly-saved-item {
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
        .gly-saved-item:hover { border-color: var(--ground); }
        .gly-saved-canvas { width: 44px; height: 44px; display: block; image-rendering: pixelated; }

        /* ── Controls ── */
        .gly-controls {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }
        .gly-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .gly-legend { padding: 0; opacity: 0.72; }
        .gly-field > .gly-legend { margin-bottom: 14px; }
        .gly-sub {
          display: block;
          opacity: 0.4;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin: 18px 0 9px;
        }

        .gly-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .gly-chip {
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
        .gly-chip:hover { border-color: var(--ground); }
        .gly-chip[data-active="true"] {
          background: var(--ground);
          border-color: var(--ground);
          color: var(--signal);
        }
        .gly-nudge { display: flex; gap: 8px; }
        .gly-nudge .gly-chip { width: 40px; text-align: center; }

        .gly-seg {
          display: grid;
          border: 0.5px solid var(--hairline-strong);
        }
        .gly-seg-2 { grid-template-columns: repeat(2, 1fr); }
        .gly-seg-3 { grid-template-columns: repeat(3, 1fr); }
        .gly-seg-4 { grid-template-columns: repeat(4, 1fr); }
        .gly-seg-btn {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 14px 8px;
          background: transparent;
          color: var(--ground);
          border: none;
          border-right: 0.5px solid var(--hairline-strong);
          cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .gly-seg-btn:last-child { border-right: none; }
        .gly-seg-btn:hover { background: var(--hairline); }
        .gly-seg-btn[data-active="true"] { background: var(--ground); color: var(--signal); }

        .gly-btn {
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 14px 12px;
          border: 1px solid var(--ground);
          background: transparent;
          color: var(--ground);
          cursor: pointer;
          transition: background var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
        }
        .gly-btn:hover:not(:disabled) { background: var(--ground); color: var(--signal); }
        .gly-btn:disabled { opacity: 0.3; cursor: default; }
        .gly-btn-primary { background: var(--ground); color: var(--signal); }
        .gly-btn-primary:hover:not(:disabled) { opacity: 0.85; }
        .gly-btn-primary:disabled { opacity: 0.3; }

        .gly-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .gly-export { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .gly-export-note {
          margin: 12px 0 0;
          opacity: 0.45;
          letter-spacing: 0.14em;
          line-height: 1.6;
        }

        .gly-empty, .gly-note {
          margin: 10px 0 0;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          font-weight: 300;
          opacity: 0.5;
        }

        @media (max-width: 480px) {
          .gly-meta { flex-direction: column; }
        }
      `}</style>
    </section>
  );
}
