"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DocumentationImage } from "./DocumentationImage";
import type { DocumentImage } from "./ProjectFile.types";
import styles from "./ProjectFile.module.css";

export function DocumentationCarousel({ images }: { images: DocumentImage[] }) {
  const track = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [position, setPosition] = useState({ index: 0, lastIndex: 0, atStart: true, atEnd: images.length <= 1 });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => {
      const slides = Array.from(element.children) as HTMLElement[];
      let index = 0;
      let lastIndex = 0;
      for (let i = 0; i < slides.length; i++) {
        if (slides[i].offsetLeft <= element.scrollLeft + 8) index = i;
        if (slides[i].offsetLeft < element.scrollLeft + element.clientWidth - 2) lastIndex = i;
      }
      const next = { index, lastIndex, atStart: element.scrollLeft < 2, atEnd: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 };
      setPosition((previous) => previous.index === next.index && previous.lastIndex === next.lastIndex && previous.atStart === next.atStart && previous.atEnd === next.atEnd ? previous : next);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.addEventListener("scroll", measure, { passive: true });
    return () => { observer.disconnect(); element.removeEventListener("scroll", measure); };
  }, [images.length]);

  function move(direction: number | "start" | "end") {
    const element = track.current;
    if (!element) return;
    const slides = Array.from(element.children) as HTMLElement[];
    const nextIndex = Math.max(0, Math.min(slides.length - 1, position.index + (typeof direction === "number" ? direction : 0)));
    const left = direction === "start" ? 0 : direction === "end" ? element.scrollWidth : slides[nextIndex].offsetLeft;
    element.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  if (!images.length) return null;

  return <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Project documentation">
    {images.length > 1 && <div className={styles.carouselControls}>
      <span aria-live="polite" aria-atomic="true" aria-label={`Documentation ${position.index + 1} to ${position.lastIndex + 1} of ${images.length}`}>{String(position.index + 1).padStart(2, "0")}{position.lastIndex > position.index && `–${String(position.lastIndex + 1).padStart(2, "0")}`} / {String(images.length).padStart(2, "0")}</span>
      <div><button type="button" onClick={() => move(-1)} disabled={position.atStart} aria-label="Previous documentation" aria-controls={trackId}>←</button><button type="button" onClick={() => move(1)} disabled={position.atEnd} aria-label="Next documentation" aria-controls={trackId}>→</button></div>
    </div>}
    <div ref={track} id={trackId} className={styles.carouselTrack} data-single={images.length === 1 || undefined} tabIndex={images.length > 1 ? 0 : undefined} aria-label={images.length > 1 ? "Scroll documentation with arrow keys" : undefined} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") {
        event.preventDefault();
        move(event.key === "Home" ? "start" : event.key === "End" ? "end" : event.key === "ArrowRight" ? 1 : -1);
      }
    }}>
      {images.map((image, index) => <div key={image.src} className={styles.slide} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${images.length}: ${image.title}`}><DocumentationImage image={image} /></div>)}
    </div>
  </div>;
}
