"use client";

import { useEffect, useRef } from "react";

export function CircleCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let x = -100, y = -100;
    const selectable = "a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary, label[for], [role='button'], [contenteditable='true']";
    const updateTarget = (target: EventTarget | null) => {
      const element = target instanceof Element ? target.closest(selectable) : null;
      cursor.dataset.selectable = String(!!element && element.getAttribute("aria-disabled") !== "true");
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") { hide(); return; }
      x = event.clientX; y = event.clientY;
      cursor.style.transform = `translate3d(${x - 11}px, ${y - 11}px, 0)`;
      cursor.hidden = false;
      document.documentElement.dataset.circleCursor = "true";
      updateTarget(event.target);
    };
    const hide = () => { cursor.hidden = true; delete document.documentElement.dataset.circleCursor; };
    const scroll = () => updateTarget(document.elementFromPoint(x, y));
    const over = (event: PointerEvent) => updateTarget(event.target);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    finePointer.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      finePointer.removeEventListener("change", hide);
    };
  }, []);
  return <div ref={ref} className="circle-cursor" hidden aria-hidden="true" />;
}
