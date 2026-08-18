"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HEX,
  SIZES,
  cloneGrid,
  countInk,
  gridSlug,
  gridToSvg,
  invertGrid,
  makeGrid,
  resizeGrid,
  type Grid,
  type Ground,
  type Ink,
} from "./glyphGrid";

const GROUNDS: { id: Ground; label: string }[] = [
  { id: "white", label: "White" },
  { id: "black", label: "Black" },
  { id: "transparent", label: "None" },
];

const INKS: { id: Ink; label: string }[] = [
  { id: "black", label: "Black" },
  { id: "white", label: "White" },
];

const HISTORY = 60;
const MAX_SAVED = 8;
const EXPORT_PX = 512;

// ── Shared cell painter — the preview and the thumbnails draw the same way ──
function paintGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  grid: Grid,
  ink: Ink,
  ground: Ground,
) {
  const { size, cells } = grid;
  ctx.clearRect(0, 0, w, w);
  if (ground !== "transparent") {
    ctx.fillStyle = HEX[ground === "white" ? "white" : "black"];
    ctx.fillRect(0, 0, w, w);
  }
  ctx.fillStyle = HEX[ink];
  const edge = (n: number) => Math.round((n * w) / size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!cells[y * size + x]) continue;
      const x0 = edge(x);
      const y0 = edge(y);
      ctx.fillRect(x0, y0, edge(x + 1) - x0, edge(y + 1) - y0);
    }
  }
}

function GlyphThumb({
  grid,
  ink,
  ground,
  onPick,
}: {
  grid: Grid;
  ink: Ink;
  ground: Ground;
  onPick: () => void;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = 60;
    c.width = w * dpr;
    c.height = w * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintGrid(ctx, w, grid, ink, ground);
  }, [grid, ink, ground]);

  return (
    <button type="button" className="gly-saved" onClick={onPick} title={`Load this ${grid.size}×${grid.size} glyph`}>
      <canvas ref={ref} className="gly-saved-canvas" aria-hidden />
    </button>
  );
}

export function GlyphStudio() {
  const [grid, setGrid] = useState<Grid>(() => makeGrid(16));
  const [ink, setInk] = useState<Ink>("black");
  const [ground, setGround] = useState<Ground>("white");
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [mirror, setMirror] = useState(false);
  const [guides, setGuides] = useState(true);
  const [past, setPast] = useState<Grid[]>([]);
  const [future, setFuture] = useState<Grid[]>([]);
  const [saved, setSaved] = useState<Grid[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeRef = useRef<{ value: number; last: { x: number; y: number } } | null>(null);

  // The grid and both history stacks live in refs and are mirrored into state
  // for rendering. A stroke mutates them many times per frame, and each step
  // has to read what the one before it wrote — a queued setState updater would
  // run after the ref had already moved on and capture the wrong snapshot.
  const gridRef = useRef(grid);
  const pastRef = useRef<Grid[]>([]);
  const futureRef = useRef<Grid[]>([]);

  const commit = useCallback((next: Grid) => {
    gridRef.current = next;
    setGrid(next);
  }, []);

  const setPastStack = useCallback((next: Grid[]) => {
    pastRef.current = next;
    setPast(next);
  }, []);

  const setFutureStack = useCallback((next: Grid[]) => {
    futureRef.current = next;
    setFuture(next);
  }, []);

  const pushHistory = useCallback(() => {
    setPastStack([...pastRef.current, cloneGrid(gridRef.current)].slice(-HISTORY));
    setFutureStack([]);
  }, [setPastStack, setFutureStack]);

  // ── History ──
  const undo = useCallback(() => {
    const p = pastRef.current;
    if (!p.length) return;
    const leaving = cloneGrid(gridRef.current);
    setPastStack(p.slice(0, -1));
    setFutureStack([leaving, ...futureRef.current].slice(0, HISTORY));
    commit(p[p.length - 1]);
  }, [commit, setPastStack, setFutureStack]);

  const redo = useCallback(() => {
    const f = futureRef.current;
    if (!f.length) return;
    const leaving = cloneGrid(gridRef.current);
    setFutureStack(f.slice(1));
    setPastStack([...pastRef.current, leaving].slice(-HISTORY));
    commit(f[0]);
  }, [commit, setPastStack, setFutureStack]);

  // ── Edits ──
  const applyCell = useCallback(
    (x: number, y: number, value: number) => {
      const g = gridRef.current;
      const { size } = g;
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      const mx = size - 1 - x;
      const i = y * size + x;
      const j = y * size + mx;
      if (g.cells[i] === value && (!mirror || g.cells[j] === value)) return;
      const cells = Uint8Array.from(g.cells);
      cells[i] = value;
      if (mirror) cells[j] = value;
      commit({ size, cells });
    },
    [mirror, commit],
  );

  // Fast drags skip cells between samples — walk the span so the line holds.
  const applyLine = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }, value: number) => {
      const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y));
      if (steps === 0) {
        applyCell(to.x, to.y, value);
        return;
      }
      for (let s = 1; s <= steps; s++) {
        applyCell(
          Math.round(from.x + ((to.x - from.x) * s) / steps),
          Math.round(from.y + ((to.y - from.y) * s) / steps),
          value,
        );
      }
    },
    [applyCell],
  );

  const cellFrom = useCallback((clientX: number, clientY: number) => {
    const c = canvasRef.current;
    if (!c) return null;
    const r = c.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const { size } = gridRef.current;
    const x = Math.floor(((clientX - r.left) / r.width) * size);
    const y = Math.floor(((clientY - r.top) / r.height) * size);
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    return { x, y };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const p = cellFrom(e.clientX, e.clientY);
      if (!p) return;
      e.preventDefault();
      canvasRef.current?.setPointerCapture(e.pointerId);
      // Alt or the right button erases without leaving the draw tool.
      const value = tool === "erase" || e.altKey || e.button === 2 ? 0 : 1;
      pushHistory();
      strokeRef.current = { value, last: p };
      setCursor(p);
      applyCell(p.x, p.y, value);
    },
    [cellFrom, tool, pushHistory, applyCell],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const p = cellFrom(e.clientX, e.clientY);
      const stroke = strokeRef.current;
      if (!stroke) {
        setCursor(p);
        return;
      }
      if (!p) return;
      applyLine(stroke.last, p, stroke.value);
      stroke.last = p;
      setCursor(p);
    },
    [cellFrom, applyLine],
  );

  const endStroke = useCallback(() => {
    strokeRef.current = null;
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      const { size } = gridRef.current;
      const c = cursor ?? { x: 0, y: 0 };
      const step = (dx: number, dy: number) => {
        e.preventDefault();
        setCursor({
          x: Math.min(size - 1, Math.max(0, c.x + dx)),
          y: Math.min(size - 1, Math.max(0, c.y + dy)),
        });
      };
      if (e.key === "ArrowLeft") step(-1, 0);
      else if (e.key === "ArrowRight") step(1, 0);
      else if (e.key === "ArrowUp") step(0, -1);
      else if (e.key === "ArrowDown") step(0, 1);
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        pushHistory();
        applyCell(c.x, c.y, gridRef.current.cells[c.y * size + c.x] ? 0 : 1);
        setCursor(c);
      }
    },
    [cursor, pushHistory, applyCell],
  );

  const changeSize = useCallback(
    (next: number) => {
      if (next === gridRef.current.size) return;
      pushHistory();
      commit(resizeGrid(gridRef.current, next));
      setCursor(null);
    },
    [pushHistory, commit],
  );

  const clear = useCallback(() => {
    pushHistory();
    commit(makeGrid(gridRef.current.size));
  }, [pushHistory, commit]);

  const invert = useCallback(() => {
    pushHistory();
    commit(invertGrid(gridRef.current));
  }, [pushHistory, commit]);

  // ── Preview render ──
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const render = () => {
      const r = c.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const dpr = window.devicePixelRatio || 1;
      c.width = w * dpr;
      c.height = w * dpr;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintGrid(ctx, w, grid, ink, ground);

      const edge = (n: number) => Math.round((n * w) / grid.size);

      if (guides) {
        ctx.lineWidth = 1;
        for (let n = 1; n < grid.size; n++) {
          // The centre line reads a touch stronger — it is the mirror axis.
          const axis = mirror && n === grid.size / 2;
          ctx.strokeStyle = axis ? "rgba(255,59,48,0.45)" : "rgba(128,128,128,0.28)";
          const p = edge(n) + 0.5;
          ctx.beginPath();
          ctx.moveTo(p, 0);
          ctx.lineTo(p, w);
          ctx.moveTo(0, p);
          ctx.lineTo(w, p);
          ctx.stroke();
        }
      }

      if (cursor) {
        const x0 = edge(cursor.x);
        const y0 = edge(cursor.y);
        ctx.strokeStyle = "rgba(255,59,48,0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x0 + 1, y0 + 1, edge(cursor.x + 1) - x0 - 2, edge(cursor.y + 1) - y0 - 2);
      }
    };

    render();
    const ro = new ResizeObserver(render);
    ro.observe(c);
    return () => ro.disconnect();
  }, [grid, ink, ground, guides, mirror, cursor]);

  // ⌘Z / ⌘⇧Z anywhere in the tool, as long as focus is not in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // ── Export ──
  const svg = useMemo(() => gridToSvg(grid, ink, ground, EXPORT_PX), [grid, ink, ground]);
  const filled = useMemo(() => countInk(grid), [grid]);

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
    download(
      new Blob([svg], { type: "image/svg+xml" }),
      `slbh-glyph-${grid.size}x${grid.size}-${gridSlug(grid)}.svg`,
    );
  }, [svg, grid, download]);

  const copySvg = useCallback(() => {
    navigator.clipboard?.writeText(svg).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => setCopied(false),
    );
  }, [svg]);

  const canExport = filled > 0;

  return (
    <section className="gly">
      <div className="container-page gly-head">
        <p className="t-mono gly-kicker">GLYPH / EDITOR</p>
        <h1 className="t-h1 gly-title">Pixel emoji instrument</h1>
        <p className="gly-deck">
          Kurita drew the first emoji on a 12-square grid, one cell at a time,
          black on white. This is that constraint as a tool — choose the count,
          fill the squares by clicking or dragging, mirror the halves while you
          work, and export a clean SVG whose path is merged down to the fewest
          rectangles the shape allows.
        </p>
      </div>

      <div className="container-page gly-grid">
        {/* ── Drawing stage ── */}
        <div className="gly-stage">
          <div className={`gly-frame gly-bg-${ground}`}>
            <canvas
              ref={canvasRef}
              className="gly-canvas"
              tabIndex={0}
              role="application"
              aria-label={`${grid.size} by ${grid.size} glyph grid — arrow keys move the cursor, space fills`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onPointerLeave={() => !strokeRef.current && setCursor(null)}
              onContextMenu={(e) => e.preventDefault()}
              onBlur={() => setCursor(null)}
              onKeyDown={onKeyDown}
            />
          </div>

          <div className="gly-meta t-mono">
            <span>
              {grid.size} × {grid.size} · {filled} CELL{filled === 1 ? "" : "S"} ·{" "}
              {Math.round((filled / (grid.size * grid.size)) * 100)}% INK
            </span>
            <span className="gly-hint">DRAG TO PAINT · ALT-DRAG ERASES</span>
          </div>

          <div className="gly-saved-block">
            <span className="t-label gly-saved-legend" style={{ opacity: 0.4 }}>
              SAVED GLYPHS
            </span>
            {saved.length ? (
              <div className="gly-saved-row">
                {saved.map((g, i) => (
                  <GlyphThumb
                    key={i}
                    grid={g}
                    ink={ink}
                    ground={ground}
                    onPick={() => {
                      pushHistory();
                      commit(cloneGrid(g));
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="gly-note">Nothing saved yet — the last {MAX_SAVED} glyphs land here.</p>
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="gly-controls">
          <fieldset className="gly-field">
            <legend className="t-label gly-legend">GRID</legend>
            <div className="gly-seg gly-seg-4">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="gly-seg-btn"
                  data-active={grid.size === s}
                  onClick={() => changeSize(s)}
                >
                  {s}×{s}
                </button>
              ))}
            </div>
            <p className="gly-note">Changing the count re-centres what is already drawn.</p>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">TOOL</legend>
            <div className="gly-seg gly-seg-2">
              {(["draw", "erase"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className="gly-seg-btn"
                  data-active={tool === t}
                  onClick={() => setTool(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">INK</legend>
            <div className="gly-seg gly-seg-2">
              {INKS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="gly-seg-btn"
                  data-active={ink === o.id}
                  onClick={() => setInk(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">GROUND</legend>
            <div className="gly-seg gly-seg-3">
              {GROUNDS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="gly-seg-btn"
                  data-active={ground === o.id}
                  onClick={() => setGround(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">GUIDES</legend>
            <div className="gly-seg gly-seg-2">
              <button
                type="button"
                className="gly-seg-btn"
                data-active={mirror}
                onClick={() => setMirror((m) => !m)}
              >
                Mirror
              </button>
              <button
                type="button"
                className="gly-seg-btn"
                data-active={guides}
                onClick={() => setGuides((g) => !g)}
              >
                Grid lines
              </button>
            </div>
          </fieldset>

          <div className="gly-actions">
            <button type="button" className="gly-btn" onClick={undo} disabled={!past.length}>
              Undo
            </button>
            <button type="button" className="gly-btn" onClick={redo} disabled={!future.length}>
              Redo
            </button>
            <button type="button" className="gly-btn" onClick={invert}>
              Invert
            </button>
            <button type="button" className="gly-btn" onClick={clear} disabled={!canExport}>
              Clear
            </button>
          </div>

          <button
            type="button"
            className="gly-btn gly-btn-primary"
            onClick={() => setSaved((all) => [...all, cloneGrid(grid)].slice(-MAX_SAVED))}
            disabled={!canExport}
          >
            Save glyph
          </button>

          <fieldset className="gly-field">
            <legend className="t-label gly-legend">EXPORT</legend>
            <div className="gly-export">
              <button type="button" className="gly-btn" onClick={exportSvg} disabled={!canExport}>
                SVG
              </button>
              <button type="button" className="gly-btn" onClick={copySvg} disabled={!canExport}>
                {copied ? "Copied ✓" : "Copy SVG"}
              </button>
            </div>
            <p className="t-mono gly-export-note">
              {EXPORT_PX}×{EXPORT_PX} · VIEWBOX 0 0 {grid.size} {grid.size} · SCALES CLEAN
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
            grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
            gap: 64px;
          }
        }

        /* ── Stage ── */
        .gly-stage {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .gly-frame {
          position: relative;
          width: 100%;
          max-width: 520px;
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
        .gly-canvas:focus-visible { outline: 2px solid var(--signal-red); outline-offset: 2px; }
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
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          max-width: 520px;
          opacity: 0.55;
        }
        .gly-hint { opacity: 0.7; letter-spacing: 0.1em; }

        .gly-saved-block { max-width: 520px; }
        .gly-saved-legend { display: block; margin-bottom: 12px; }
        .gly-saved-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .gly-saved {
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
        .gly-saved:hover { border-color: var(--ground); }
        .gly-saved-canvas { width: 60px; height: 60px; display: block; }

        /* ── Controls ── */
        .gly-controls {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }
        .gly-field { border: none; padding: 0; margin: 0; min-width: 0; }
        .gly-legend { padding: 0; opacity: 0.72; }
        .gly-field > .gly-legend { margin-bottom: 14px; }

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
          padding: 12px 8px;
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

        .gly-note {
          margin: 10px 0 0;
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          font-weight: 300;
          opacity: 0.5;
        }

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

        .gly-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .gly-export { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .gly-export-note {
          margin: 12px 0 0;
          opacity: 0.45;
          letter-spacing: 0.14em;
        }
      `}</style>
    </section>
  );
}
