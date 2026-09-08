"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FocusEvent, type MouseEvent } from "react";
import type { Work, WorkFormat } from "@/lib/works";
import styles from "./WorkIndex.module.css";

export function WorkIndex({ works, filters = false }: { works: Work[]; filters?: boolean }) {
  const [active, setActive] = useState<Work | null>(null);
  const [filter, setFilter] = useState<WorkFormat | "All">("All");
  const previewRef = useRef<HTMLElement>(null);
  const formats: WorkFormat[] = ["Product", "Research", "Study", "Instrument", "Installation", "Graphical"];
  const visible = works.filter(work => filter === "All" || work.formats.includes(filter));
  function position(x: number, y: number) {
    const preview = previewRef.current;
    if (!preview) return;
    const width = Math.min(320, window.innerWidth - 44);
    const height = Math.min(width * 1.25 + 55, window.innerHeight - 44);
    const left = x + width + 28 < window.innerWidth ? x + 28 : x - width - 28;
    preview.style.left = `${Math.max(22, Math.min(left, window.innerWidth - width - 22))}px`;
    preview.style.top = `${Math.max(22, Math.min(y - height / 2, window.innerHeight - height - 22))}px`;
  }
  function enter(work: Work, event: MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia("(hover: hover)").matches) return;
    position(event.clientX, event.clientY);
    setActive(work);
  }
  function focus(work: Work, event: FocusEvent<HTMLAnchorElement>) {
    if (!event.currentTarget.matches(":focus-visible")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    position(Math.min(rect.right - 20, window.innerWidth - 340), rect.top);
    setActive(work);
  }
  return <div className={styles.index}>
    {filters && <div className={styles.filters} aria-label="Filter work by format">
      {(["All", ...formats] as const).map(value => <button key={value} type="button" aria-pressed={value === filter}
        onClick={() => { setFilter(value); setActive(null); }}>{value}</button>)}
    </div>}
    <ul className={styles.list}>{visible.map(work => (
      <li key={work.id} id={work.id}>
        <Link href={work.href} className={styles.row}
          onMouseEnter={event => enter(work, event)} onMouseMove={event => position(event.clientX, event.clientY)} onMouseLeave={() => setActive(null)}
          onFocus={event => focus(work, event)} onBlur={() => setActive(null)} onClick={() => setActive(null)}>
          <span className={styles.title}>{work.title}</span>
          <span className={styles.format}>{work.formats[0]}</span>
        </Link>
      </li>
    ))}</ul>
    <aside ref={previewRef} className={`${styles.preview} ${active ? styles.visible : ""}`} aria-hidden="true">
      {active && <>
        {active.image ? <div className={styles.image}>
          <Image src={active.image} alt="" width={640} height={640} sizes="320px" />
        </div> : <div className={styles.paper}>
          <span>Brendon Hawkins</span>
          <p>{active.title}</p>
          <span>{active.id === "emotion-as-system" ? "A Foundational Architecture for Affect, Meaning, Perception, and Action" : active.formats[0]}</span>
        </div>}
        <p className={styles.caption}>{active.title}<span>{active.year}</span></p>
      </>}
    </aside>
  </div>;
}
