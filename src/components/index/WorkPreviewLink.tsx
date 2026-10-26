"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Work } from "@/lib/works";
import styles from "./WorkPreviewLink.module.css";

type PreviewWork = Pick<Work, "href" | "image">;
type PreviewTarget = { work: PreviewWork; link: HTMLAnchorElement };
type PreviewControls = {
  show: (work: PreviewWork, link: HTMLAnchorElement, x: number, y: number) => void;
  move: (link: HTMLAnchorElement, x: number, y: number) => void;
  hide: (link: HTMLAnchorElement) => void;
};
const PreviewContext = createContext<PreviewControls | null>(null);

export function WorkPreviewProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<PreviewTarget | null>(null);
  const previewRef = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const position = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const { width, height } = preview.getBoundingClientRect();
    const { x, y } = pointer.current;
    const left = x + width + 24 <= window.innerWidth - 24 ? x + 24 : x - width - 24;
    preview.style.left = `${Math.max(24, Math.min(left, window.innerWidth - width - 24))}px`;
    preview.style.top = `${Math.max(24, Math.min(y - height / 2, window.innerHeight - height - 24))}px`;
  }, []);

  useLayoutEffect(() => {
    if (active) position();
  }, [active, position]);

  useEffect(() => {
    if (!active) return;
    const hide = () => setActive(null);
    const scroll = () => {
      if (!active.link.matches(":focus-visible")) { hide(); return; }
      const rect = active.link.getBoundingClientRect();
      pointer.current = { x: rect.right, y: rect.top + rect.height / 2 };
      position();
    };
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", hide);
      window.removeEventListener("blur", hide);
    };
  }, [active, position]);

  const controls: PreviewControls = {
    show(work, link, x, y) {
      if (!work.image || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        setActive(null);
        return;
      }
      pointer.current = { x, y };
      setActive({ work, link });
    },
    move(link, x, y) {
      if (active?.link !== link) return;
      pointer.current = { x, y };
      position();
    },
    hide(link) {
      setActive(current => current?.link === link ? null : current);
    },
  };

  return <PreviewContext.Provider value={controls}>
    {children}
    {active?.work.image && <aside ref={previewRef} className={styles.preview} aria-hidden="true">
      <Image key={active.work.image} src={active.work.image} alt="" width={640} height={640} sizes="320px" draggable={false} onLoad={position} />
    </aside>}
  </PreviewContext.Provider>;
}

export function WorkPreviewLink({ work, className, children }: {
  work: PreviewWork;
  className?: string;
  children: ReactNode;
}) {
  const preview = useContext(PreviewContext);
  if (!preview) throw new Error("WorkPreviewLink requires WorkPreviewProvider");

  return <Link href={work.href} className={className}
    onPointerEnter={event => {
      if (event.pointerType === "mouse") preview.show(work, event.currentTarget, event.clientX, event.clientY);
    }}
    onPointerMove={event => preview.move(event.currentTarget, event.clientX, event.clientY)}
    onPointerLeave={event => preview.hide(event.currentTarget)}
    onFocus={event => {
      if (!event.currentTarget.matches(":focus-visible")) return;
      const rect = event.currentTarget.getBoundingClientRect();
      preview.show(work, event.currentTarget, rect.right, rect.top + rect.height / 2);
    }}
    onBlur={event => preview.hide(event.currentTarget)} onClick={event => preview.hide(event.currentTarget)}
    onKeyDown={event => { if (event.key === "Escape") preview.hide(event.currentTarget); }}>
    {children}
  </Link>;
}
