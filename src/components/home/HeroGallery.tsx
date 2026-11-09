"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { HeroDrawing } from "@/lib/homeDrawings";
import { getRandomArtworkIndex } from "@/lib/homeHero";
import { useHomeOpening } from "./HomeOpening";
import styles from "./HeroGallery.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;
const imageSizes = "(max-width: 767px) calc(100vw - 48px), 640px";

function GalleryDrawing({ artwork, priority, onHover, onReady }: {
  artwork: HeroDrawing; priority: boolean; onHover: (value: boolean) => void; onReady?: () => void;
}) {
  return (
    <div
      className={styles.slide}
      role="group"
      aria-roledescription="slide"
      aria-label={artwork.alt}
    >
      <Link href="/projects/tell-me-how-you-feel-pit-lab" className={styles.artwork} style={{ "--artwork-ratio": artwork.width / artwork.height } as CSSProperties} aria-label="View Tell Me How You Feel: PIT Lab" draggable={false} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
        <Image
          src={artwork.src}
          alt={artwork.alt}
          width={artwork.width}
          height={artwork.height}
          sizes={imageSizes}
          priority={priority}
          onLoad={onReady}
          onError={onReady}
          draggable={false}
        />
      </Link>
    </div>
  );
}

export function HeroGallery({ artwork }: { artwork: HeroDrawing[] }) {
  // HomeHero mounts this after hydration, so the opening
  // selection is made only on the client, before any image is displayed.
  const [initialIndex] = useState(() => {
    let previous = -1;
    try { previous = Number(sessionStorage.getItem("slbh-drawing-start") ?? -1); } catch { /* Storage is optional. */ }
    return getRandomArtworkIndex(artwork.length, previous);
  });
  const [index, setIndex] = useState(initialIndex);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const { complete, onReady } = useHomeOpening();
  const firstReady = useCallback(() => { setFirstLoaded(true); onReady(); }, [onReady]);

  useEffect(() => {
    try { sessionStorage.setItem("slbh-drawing-start", String(initialIndex)); } catch { /* Random selection works without storage. */ }
  }, [initialIndex]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, getServerMotion);
  const galleryRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const active = inView && pageVisible;
  const playing = complete && firstLoaded && active && !reducedMotion && !hovered && !focused;
  const current = artwork[index];

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(gallery);
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || artwork.length < 2) return;
    // Fetch only the next responsive image so the 1.5-second cut is immediate.
    const next = artwork[(index + 1) % artwork.length];
    const { props } = getImageProps({ ...next, alt: "", sizes: imageSizes });
    const image = new window.Image();
    if (props.sizes) image.sizes = props.sizes;
    if (props.srcSet) image.srcset = props.srcSet;
    image.src = props.src;
  }, [playing, index, artwork]);

  useEffect(() => {
    if (!playing || artwork.length < 2) return;
    const timer = window.setTimeout(() => {
      setIndex(previous => (previous + 1) % artwork.length);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [playing, index, artwork.length]);

  function step(value: number) {
    setIndex(previous => (previous + value + artwork.length) % artwork.length);
  }

  if (!current) return null;
  return (
    <section
      id="home-gallery"
      ref={galleryRef}
      className={`site-surface ${styles.gallery}`}
      aria-label="Participant drawings. Use left and right arrow keys to browse."
      aria-roledescription="carousel"
      tabIndex={0}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          step(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className={styles.stage} data-home-visual data-home-ready={firstLoaded} onTouchStart={event => {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={event => {
        if (!touchStart.current) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStart.current.x;
        const dy = touch.clientY - touchStart.current.y;
        touchStart.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx > 0 ? 1 : -1);
      }}>
        <GalleryDrawing key={current.src} artwork={current} priority={index === initialIndex} onHover={setHovered} onReady={index === initialIndex ? firstReady : undefined} />
      </div>
    </section>
  );
}
