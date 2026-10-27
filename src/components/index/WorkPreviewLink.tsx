"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Work } from "@/lib/works";
import styles from "./WorkPreviewLink.module.css";

type PreviewWork = Pick<Work, "href" | "image">;
type PreviewTarget = { work: PreviewWork; container: HTMLLIElement };
type PreviewControls = {
  show: (work: PreviewWork, container: HTMLLIElement, x: number, y: number) => void;
  move: (container: HTMLLIElement, x: number, y: number) => void;
  hide: (container: HTMLLIElement) => void;
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
      const focused = active.container.querySelector(":focus-visible");
      if (!focused) { hide(); return; }
      const rect = focused.getBoundingClientRect();
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
    show(work, container, x, y) {
      if (!work.image || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        setActive(null);
        return;
      }
      pointer.current = { x, y };
      setActive({ work, container });
    },
    move(container, x, y) {
      if (active?.container !== container) return;
      pointer.current = { x, y };
      position();
    },
    hide(container) {
      setActive(current => current?.container === container ? null : current);
    },
  };

  return <PreviewContext.Provider value={controls}>
    {children}
    {active?.work.image && <aside ref={previewRef} className={styles.preview} aria-hidden="true">
      <Image key={active.work.image} src={active.work.image} alt="" width={640} height={640} sizes="320px" draggable={false} onLoad={position} />
    </aside>}
  </PreviewContext.Provider>;
}

export function WorkPreviewItem({ work, children }: {
  work: PreviewWork;
  children: ReactNode;
}) {
  const preview = useContext(PreviewContext);
  if (!preview) throw new Error("WorkPreviewItem requires WorkPreviewProvider");

  return <li
    onPointerEnter={event => {
      if (event.pointerType === "mouse") preview.show(work, event.currentTarget, event.clientX, event.clientY);
    }}
    onPointerMove={event => preview.move(event.currentTarget, event.clientX, event.clientY)}
    onPointerLeave={event => preview.hide(event.currentTarget)}
    onFocus={event => {
      if (!event.target.matches(":focus-visible")) return;
      const rect = event.target.getBoundingClientRect();
      preview.show(work, event.currentTarget, rect.right, rect.top + rect.height / 2);
    }}
    onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) preview.hide(event.currentTarget);
    }}
    onClick={event => {
      if (event.target instanceof Element && event.target.closest("a")) preview.hide(event.currentTarget);
    }}
    onKeyDown={event => { if (event.key === "Escape") preview.hide(event.currentTarget); }}>
    {children}
  </li>;
}
