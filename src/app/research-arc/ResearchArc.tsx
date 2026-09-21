"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import type { Work } from "@/lib/works";
import { ARC_HEIGHT, ARC_WIDTH, arcEdges, arcEntries, arcTimeline, type ArcEntry } from "./arc-map";
import styles from "./research-arc.module.css";

type Camera = { x: number; y: number; scale: number };
type Point = { x: number; y: number };
const MIN_SCALE = 0.25, MAX_SCALE = 2;
const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const midpoint = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function GenerativeCycle() {
  return <svg className={styles.cycleDrawing} viewBox="0 0 800 1000" role="img" aria-labelledby="cycle-title cycle-description">
    <title id="cycle-title">SLBH Generative Cycle</title>
    <desc id="cycle-description">Theory and philosophy, application, and research surround a triangle. Each pair is connected in both directions.</desc>
    <defs><marker id="cycle-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" /></marker></defs>
    <g fill="currentColor" textAnchor="middle" fontSize="20">
      <text x="400" y="82" fontSize="24" fontWeight="600">SLBH GENERATIVE CYCLE</text>
      <text x="400" y="197">THEORY</text><text x="400" y="221">PHILOSOPHY</text>
      <text x="161" y="658">APPLICATION</text><text x="628" y="658">RESEARCH</text>
      <text x="27" y="965" textAnchor="start">AFFECTIVE COMPUTATIONAL GEOMETRY</text>
      <text x="774" y="965" textAnchor="end">STUDIO LAB BH</text>
    </g>
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M 400 301 L 572 599 L 228 599 Z" />
      <path d="M 137 538 C 119 417 188 309 307 253" markerStart="url(#cycle-arrow)" markerEnd="url(#cycle-arrow)" />
      <path d="M 492 253 C 611 309 680 417 662 538" markerStart="url(#cycle-arrow)" markerEnd="url(#cycle-arrow)" />
      <path d="M 235 705 Q 400 822 567 705" markerStart="url(#cycle-arrow)" markerEnd="url(#cycle-arrow)" />
    </g>
  </svg>;
}

export function ResearchArc({ works }: { works: Work[] }) {
  const [mode, setMode] = useState<"map" | "index">("map");
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 0.7 });
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<ArcEntry | null>(null);
  const [cycleOpen, setCycleOpen] = useState(false);
  const [timeline, setTimeline] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const cameraRef = useRef(camera);
  const dialog = useRef<HTMLDialogElement>(null);
  const dialogBody = useRef<HTMLDivElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{ start: Point; moved: boolean } | null>(null);
  const size = useRef({ width: 1400, height: 1000 });
  const initialized = useRef(false);
  const restoreFocus = useRef<HTMLElement | SVGElement | null>(null);
  const pendingFocus = useRef<string | null>(null);

  const updateCamera = useCallback((next: Camera | ((current: Camera) => Camera)) => {
    const value = typeof next === "function" ? next(cameraRef.current) : next;
    cameraRef.current = value;
    setCamera(value);
  }, []);
  const fitMap = useCallback((readable = false) => {
    const { width, height } = size.current;
    const fit = Math.min((width - 44) / ARC_WIDTH, (height - 112) / ARC_HEIGHT, 1);
    const scale = readable ? Math.max(0.7, fit) : Math.max(MIN_SCALE, fit);
    updateCamera({ x: (width - ARC_WIDTH * scale) / 2, y: 54 + (height - 112 - ARC_HEIGHT * scale) / 2, scale });
    setHighlighted(null);
  }, [updateCamera]);
  const focusEntry = useCallback((id: string) => {
    const entry = arcEntries.find(item => item.id === id);
    if (!entry) return;
    const scale = size.current.width < 768 ? 0.85 : 1;
    updateCamera({ x: size.current.width / 2 - entry.center.x * scale, y: size.current.height / 2 - entry.center.y * scale, scale });
    setHighlighted(id);
  }, [updateCamera]);
  const zoom = useCallback((factor: number, anchor?: Point) => {
    const at = anchor || { x: size.current.width / 2, y: size.current.height / 2 };
    updateCamera(current => {
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * factor));
      const ratio = scale / current.scale;
      return { x: at.x - (at.x - current.x) * ratio, y: at.y - (at.y - current.y) * ratio, scale };
    });
  }, [updateCamera]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || mode !== "map") return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const previousSize = size.current;
      size.current = { width: rect.width, height: rect.height };
      if (!initialized.current) { fitMap(true); initialized.current = true; }
      else if (pendingFocus.current) { focusEntry(pendingFocus.current); pendingFocus.current = null; }
      else if (previousSize.width !== rect.width || previousSize.height !== rect.height) {
        updateCamera(current => ({ ...current, x: current.x + (rect.width - previousSize.width) / 2, y: current.y + (rect.height - previousSize.height) / 2 }));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        const rect = element.getBoundingClientRect();
        zoom(Math.exp(-event.deltaY * 0.008), { x: event.clientX - rect.left, y: event.clientY - rect.top });
      } else {
        const unit = event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? size.current.height : 1;
        updateCamera(current => ({ ...current, x: current.x - (event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX) * unit, y: current.y - (event.shiftKey && !event.deltaX ? 0 : event.deltaY) * unit }));
      }
    };
    element.addEventListener("wheel", wheel, { passive: false });
    const activePointers = pointers.current;
    return () => { observer.disconnect(); element.removeEventListener("wheel", wheel); activePointers.clear(); gesture.current = null; };
  }, [mode, fitMap, focusEntry, updateCamera, zoom]);

  useEffect(() => {
    if ((selected || cycleOpen) && dialog.current && !dialog.current.open) dialog.current.showModal();
    else if (selected) detailHeading.current?.focus({ preventScroll: true });
    if (selected || cycleOpen) dialogBody.current?.scrollTo({ top: 0 });
  }, [selected, cycleOpen]);

  function pointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);
    if (pointers.current.size === 1) gesture.current = { start: point, moved: false };
    if (pointers.current.size > 1 && gesture.current) gesture.current.moved = true;
  }
  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous || !gesture.current) return;
    const next = { x: event.clientX, y: event.clientY };
    const before = [...pointers.current.values()];
    if (!gesture.current.moved && distance(gesture.current.start, next) < 6) return;
    gesture.current.moved = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, next);
    if (pointers.current.size === 2) {
      const after = [...pointers.current.values()];
      const oldMid = midpoint(before[0], before[1]), newMid = midpoint(after[0], after[1]);
      const rect = event.currentTarget.getBoundingClientRect();
      zoom(distance(after[0], after[1]) / Math.max(1, distance(before[0], before[1])), { x: oldMid.x - rect.left, y: oldMid.y - rect.top });
      updateCamera(current => ({ ...current, x: current.x + newMid.x - oldMid.x, y: current.y + newMid.y - oldMid.y }));
    } else {
      updateCamera(current => ({ ...current, x: current.x + next.x - previous.x, y: current.y + next.y - previous.y }));
    }
  }
  function stopPointer(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!pointers.current.size) setDragging(false);
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 300 : 100;
    const movements: Record<string, Point> = { ArrowLeft: { x: step, y: 0 }, ArrowRight: { x: -step, y: 0 }, ArrowUp: { x: 0, y: step }, ArrowDown: { x: 0, y: -step } };
    if (movements[event.key]) { event.preventDefault(); const move = movements[event.key]; updateCamera(current => ({ ...current, x: current.x + move.x, y: current.y + move.y })); }
    else if (["+", "=", "-", "Home"].includes(event.key)) { event.preventDefault(); if (event.key === "Home") fitMap(); else zoom(event.key === "-" ? 0.8 : 1.25); }
  }
  function rememberFocus() {
    restoreFocus.current = document.activeElement instanceof HTMLElement || document.activeElement instanceof SVGElement ? document.activeElement : null;
  }
  function openEntry(entry: ArcEntry) { rememberFocus(); setSelected(entry); setHighlighted(entry.id); }
  function closePanel() { dialog.current?.close(); }
  function showOnMap(id: string) {
    closePanel();
    setTimeline(null);
    if (mode === "index") { pendingFocus.current = id; setMode("map"); }
    else focusEntry(id);
    requestAnimationFrame(() => viewport.current?.focus({ preventScroll: true }));
  }
  function stepTimeline(index: number) {
    setTimeline(index);
    if (mode === "index") { pendingFocus.current = arcTimeline[index].id; setMode("map"); }
    else focusEntry(arcTimeline[index].id);
  }
  const work = selected?.workId ? works.find(item => item.id === selected.workId) : undefined;
  const incoming = selected ? arcEdges.filter(edge => edge.to === selected.id).map(edge => arcEntries.find(entry => entry.id === edge.from)!) : [];
  const outgoing = selected ? arcEdges.filter(edge => edge.from === selected.id).map(edge => arcEntries.find(entry => entry.id === edge.to)!) : [];

  return <section className={styles.arc} aria-labelledby="arc-title">
    <header className={styles.heading}>
      <h1 id="arc-title">Research Arc</h1>
      <nav aria-label="Explore the research arc">
        <button type="button" onClick={() => { rememberFocus(); setCycleOpen(true); }}>Generative cycle</button>
        <button type="button" aria-pressed={timeline !== null} onClick={() => timeline === null ? stepTimeline(0) : setTimeline(null)}>{timeline === null ? "Timeline →" : "Leave timeline ×"}</button>
      </nav>
    </header>
    {mode === "map" ? <div ref={viewport} className={`${styles.viewport} ${dragging ? styles.dragging : ""}`}
      tabIndex={0} role="region" aria-label="Research map. Drag or use arrow keys to move; plus and minus to zoom; Home to fit the map."
      onKeyDown={keyboard} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={stopPointer} onPointerCancel={stopPointer}
      onPointerLeave={event => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) stopPointer(event); }}
      onClickCapture={event => { if (gesture.current?.moved) { event.preventDefault(); event.stopPropagation(); gesture.current = null; } }}>
      <svg className={styles.world} width={ARC_WIDTH} height={ARC_HEIGHT} viewBox={`0 0 ${ARC_WIDTH} ${ARC_HEIGHT}`} data-arc-world
        style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})` }} aria-label="Research Arc by Brendon Hawkins, 2026">
        <defs><marker id="arc-arrow" markerWidth="15" markerHeight="15" refX="12" refY="7.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 1 L 14 7.5 L 0 14 Z" fill="currentColor" /></marker></defs>
        <g className={styles.connections} aria-hidden="true">{arcEdges.map(edge => <path key={`${edge.from}-${edge.to}`} data-from={edge.from} data-to={edge.to} d={edge.path} markerEnd="url(#arc-arrow)"
          className={highlighted === edge.from || highlighted === edge.to ? styles.activeConnection : undefined} />)}</g>
        {arcEntries.map(entry => <g key={entry.id} className={`${styles.node} ${highlighted === entry.id ? styles.activeNode : ""}`} data-arc-entry={entry.id}
          role="button" tabIndex={0} aria-label={`${entry.title}, ${entry.category.toLowerCase()}${entry.date ? `, ${entry.date}` : ""}`}
          onClick={() => openEntry(entry)} onMouseEnter={() => setHighlighted(entry.id)} onMouseLeave={() => setHighlighted(null)}
          onFocus={event => { if (event.currentTarget.matches(":focus-visible")) focusEntry(entry.id); }}
          onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openEntry(entry); } }}>
          {entry.lines.map(line => <text key={line.y} x={line.x} y={line.y} className={styles.nodeTitle}>{line.text}</text>)}
          {entry.date && entry.dateAt && <text x={entry.dateAt.x} y={entry.dateAt.y} className={styles.nodeDate}>{entry.date}</text>}
          <text x={entry.categoryAt.x} y={entry.categoryAt.y} className={styles.nodeCategory}>{entry.category}</text>
        </g>)}
        <g className={styles.mapCredit}><text x="77" y="1233" fontWeight="600">RESEARCH ARC</text><text x="77" y="1276">BRENDON HAWKINS | STUDIO LAB BH</text><text x="77" y="1321">2026</text></g>
      </svg>
    </div> : <div className={styles.index} aria-label="Research arc index">
      {arcTimeline.map(entry => <div key={entry.id} className={styles.indexRow}>
        <span className={styles.indexDate}>{entry.date || "—"}</span>
        <button type="button" className={styles.indexTitle} onClick={() => openEntry(entry)}>{entry.title}</button>
        <span className={styles.indexCategory}>{entry.category.toLowerCase()}</span>
        <span className={styles.indexStatus}>{entry.workId ? "" : entry.category === "THEORY" || entry.category === "THESIS" ? "Listed" : "Page to add"}</span>
        <button type="button" className={styles.mapLink} onClick={() => showOnMap(entry.id)} aria-label={`Show ${entry.title} on map`}>Map →</button>
      </div>)}
    </div>}
    <div className={styles.controls}>
      <button type="button" aria-label={`Switch to ${mode === "map" ? "index" : "map"} view`} onClick={() => { setMode(mode === "map" ? "index" : "map"); setDragging(false); }}>{mode === "map" ? "Index" : "Map"}<span aria-hidden="true">{mode === "map" ? "≡" : "↗"}</span></button>
      {mode === "map" && <button type="button" onClick={() => { fitMap(); setTimeline(null); }}>Fit map</button>}
    </div>
    {mode === "map" && <div className={styles.zoomControls} aria-label="Map zoom">
      <button type="button" aria-label="Zoom out" disabled={camera.scale <= MIN_SCALE} onClick={() => zoom(0.8)}>−</button>
      <button type="button" className={styles.zoomValue} aria-label="Reset zoom to 100 percent" onClick={() => zoom(1 / camera.scale)}>{Math.round(camera.scale * 100)}%</button>
      <button type="button" aria-label="Zoom in" disabled={camera.scale >= MAX_SCALE} onClick={() => zoom(1.25)}>+</button>
    </div>}
    {timeline !== null && mode === "map" && <nav className={styles.timeline} aria-label="Timeline walkthrough">
      <button type="button" aria-label="Previous entry" disabled={timeline === 0} onClick={() => stepTimeline(timeline - 1)}>←</button>
      <span aria-live="polite">{arcTimeline[timeline].date || "Undated"}<span className={styles.timelineCount}>{timeline + 1} / {arcTimeline.length}</span></span>
      <button type="button" aria-label="Next entry" disabled={timeline === arcTimeline.length - 1} onClick={() => stepTimeline(timeline + 1)}>→</button>
    </nav>}
    <dialog ref={dialog} className={`${styles.detail} ${cycleOpen ? styles.cyclePanel : ""}`} aria-labelledby={cycleOpen ? "cycle-title" : "arc-detail-title"}
      onClose={() => { setSelected(null); setCycleOpen(false); restoreFocus.current?.focus({ preventScroll: true }); }}>
      <div className={styles.detailBody} ref={dialogBody}>
        <div className={styles.detailToolbar}>
          {selected ? <button type="button" onClick={() => showOnMap(selected.id)}>Show on map →</button> : <span />}
          <button type="button" onClick={closePanel} autoFocus>Close ×</button>
        </div>
        {cycleOpen ? <GenerativeCycle /> : selected && <>
          <h2 id="arc-detail-title" ref={detailHeading} tabIndex={-1}>{selected.title}</h2>
          <p className={styles.meta}>{selected.date}<span>{selected.category.toLowerCase()}</span></p>
          {work ? <>
            {work.image && <Image className={styles.detailImage} src={work.image} alt={work.title} width={1000} height={700} sizes="(max-width: 767px) 90vw, 520px" />}
            <p className={styles.detailCopy}>{work.summary}</p>
            <Link href={work.href} className={styles.fullProject}>Open full {selected.category === "RESEARCH" ? "paper" : "project"} ↗</Link>
          </> : selected.category !== "THEORY" && selected.category !== "THESIS" && <p className={styles.detailCopy}>This project is part of the research arc. Its page has yet to be added.</p>}
          {[{ title: "Incoming", entries: incoming }, { title: "Outgoing", entries: outgoing }].map(group => group.entries.length > 0 && <div className={styles.related} key={group.title}>
            <h3>{group.title}</h3>{group.entries.map(entry => <button type="button" key={entry.id} onClick={() => { setSelected(entry); setHighlighted(entry.id); }}>{entry.title}<span aria-hidden="true">→</span></button>)}
          </div>)}
        </>}
      </div>
    </dialog>
  </section>;
}
