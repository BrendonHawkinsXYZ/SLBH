"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Artwork } from "@/lib/artwork";
import styles from "./HeroGallery.module.css";

export function ArtworkTiles({ artwork, index, reducedMotion, onSelect, onHover }: {
  artwork: Artwork[];
  index: number;
  reducedMotion: boolean;
  onSelect: (index: number, direction: number) => void;
  onHover: (hovered: boolean) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const initialized = useRef(false);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const count = artwork.length;

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !count) return;
    const candidates = [index, count + index, count * 2 + index]
      .map(position => tileRefs.current[position])
      .filter((tile): tile is HTMLButtonElement => Boolean(tile));
    const center = strip.scrollLeft + strip.clientWidth / 2;
    const target = initialized.current
      ? candidates.reduce((nearest, tile) =>
          Math.abs(tile.offsetLeft + tile.clientWidth / 2 - center) < Math.abs(nearest.offsetLeft + nearest.clientWidth / 2 - center) ? tile : nearest)
      : tileRefs.current[count + index];
    if (!target) return;
    strip.scrollTo({
      left: target.offsetLeft - strip.clientWidth / 2 + target.clientWidth / 2,
      behavior: !initialized.current || reducedMotion ? "instant" : "smooth",
    });
    initialized.current = true;
  }, [index, count, reducedMotion]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !count) return;
    let settledTimer = 0;

    // All three copies have identical geometry. Rebase by one whole sequence
    // after scrolling settles, preserving every visible tile's screen position.
    const rebase = () => {
      const first = tileRefs.current[0];
      const middle = tileRefs.current[count];
      if (!first || !middle) return;
      const span = middle.offsetLeft - first.offsetLeft;
      if (span <= strip.clientWidth) return;
      const copy = Math.floor((strip.scrollLeft + strip.clientWidth / 2 - first.offsetLeft) / span);
      if (copy !== 1) strip.scrollBy({ left: (1 - copy) * span, behavior: "instant" });
    };
    const onScroll = () => {
      window.clearTimeout(settledTimer);
      // Recenter before a fast gesture can reach either physical end.
      if (strip.scrollLeft < 48 || strip.scrollLeft > strip.scrollWidth - strip.clientWidth - 48) rebase();
      settledTimer = window.setTimeout(rebase, 150);
    };
    const observer = new ResizeObserver(() => {
      const selected = strip.querySelector<HTMLButtonElement>('button[tabindex="0"]');
      if (selected) strip.scrollTo({ left: selected.offsetLeft - strip.clientWidth / 2 + selected.clientWidth / 2, behavior: "instant" });
    });
    observer.observe(strip);
    strip.addEventListener("scroll", onScroll, { passive: true });
    strip.addEventListener("scrollend", rebase);
    return () => {
      window.clearTimeout(settledTimer);
      observer.disconnect();
      strip.removeEventListener("scroll", onScroll);
      strip.removeEventListener("scrollend", rebase);
    };
  }, [count]);

  return (
    <div ref={stripRef} className={styles.colorIndex} role="group" aria-label="Choose an artwork"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => { setHoveredTile(null); onHover(false); }}>
      {[0, 1, 2].flatMap(copy => artwork.map((piece, tileIndex) => {
        const position = copy * count + tileIndex;
        const difference = hoveredTile === null ? 0 : Math.abs(tileIndex - hoveredTile);
        const distance = hoveredTile === null ? Infinity : Math.min(difference, count - difference);
        const scale = distance === 0 ? 1.9 : distance === 1 ? 1.5 : distance === 2 ? 1.2 : 1;
        return <button
          key={`${copy}-${piece.src}`}
          ref={element => { tileRefs.current[position] = element; }}
          type="button"
          tabIndex={copy === 1 && index === tileIndex ? 0 : -1}
          className={styles.tile}
          style={{ "--tile-color": piece.color, "--tile-scale": scale } as CSSProperties}
          aria-hidden={copy !== 1}
          aria-label={`View ${piece.project}: ${piece.title}`}
          aria-pressed={index === tileIndex}
          onMouseEnter={() => setHoveredTile(tileIndex)}
          onFocus={() => setHoveredTile(tileIndex)}
          onBlur={() => setHoveredTile(null)}
          onClick={() => {
            const strip = stripRef.current;
            const tile = tileRefs.current[position];
            const direction = strip && tile && tile.offsetLeft + tile.clientWidth / 2 < strip.scrollLeft + strip.clientWidth / 2 ? -1 : 1;
            // Only the middle copy participates in keyboard/screen-reader navigation.
            tileRefs.current[count + tileIndex]?.focus({ preventScroll: true });
            onSelect(tileIndex, direction);
          }}
          onKeyDown={event => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            event.stopPropagation();
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const next = (tileIndex + direction + count) % count;
            tileRefs.current[count + next]?.focus({ preventScroll: true });
            onSelect(next, direction);
          }}
        ><span aria-hidden="true" /></button>;
      }))}
    </div>
  );
}
