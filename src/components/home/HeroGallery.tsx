"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { Artwork } from "@/lib/artwork";
import { ArtworkTiles } from "./ArtworkTiles";
import styles from "./HeroGallery.module.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;

function GallerySlide({ artwork, direction, reducedMotion, active, priority, onHover }: {
  artwork: Artwork; direction: number; reducedMotion: boolean; active: boolean; priority: boolean; onHover: (value: boolean) => void;
}) {
  const present = useIsPresent();
  return (
    <motion.div
      className={styles.slide}
      custom={direction}
      variants={{
        enter: (value: number) => ({ x: reducedMotion ? 0 : `${-value * 100}%`, opacity: reducedMotion ? 0 : 1 }),
        center: { x: 0, opacity: 1 },
        exit: (value: number) => ({ x: reducedMotion ? 0 : `${value * 100}%`, opacity: reducedMotion ? 0 : 1 }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 0.61, 0.36, 1] }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${artwork.project}, ${artwork.title}`}
      aria-hidden={!present}
      inert={!present}
    >
      <Link href={artwork.href} className={styles.artwork} style={{ "--artwork-ratio": artwork.width / artwork.height } as CSSProperties} tabIndex={-1} draggable={false} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
        <Image
          src={(!active || reducedMotion) && artwork.stillSrc ? artwork.stillSrc : artwork.src}
          alt={artwork.alt}
          width={artwork.width}
          height={artwork.height}
          sizes="(max-width: 767px) 100vw, 90vw"
          priority={priority}
          unoptimized={artwork.src.endsWith(".gif") && active && !reducedMotion}
          draggable={false}
        />
      </Link>
      <div className={styles.caption} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
        <Link href={artwork.href}>{artwork.project}</Link>
        <span>{artwork.title}{artwork.year && `, ${artwork.year}`}</span>
      </div>
    </motion.div>
  );
}

export function HeroGallery({ artwork }: { artwork: Artwork[] }) {
  const [{ index, direction }, setSlide] = useState({ index: 0, direction: 1 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tilesHovered, setTilesHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, getServerMotion);
  const galleryRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const active = inView && pageVisible;
  const playing = active && !reducedMotion && !hovered && !focused && !tilesHovered;
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
    const timer = window.setTimeout(() => {
      setSlide(previous => ({ index: (previous.index + 1) % artwork.length, direction: 1 }));
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [playing, index, artwork.length]);

  function step(value: number) {
    setSlide(previous => ({ index: (previous.index + value + artwork.length) % artwork.length, direction: value }));
  }

  if (!current) return null;
  return (
    <section
      id="home-gallery"
      ref={galleryRef}
      className={styles.gallery}
      aria-label="Work from Studio Lab BH"
      aria-roledescription="carousel"
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
      <div className={styles.stage} onTouchStart={event => {
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
        <AnimatePresence initial={false} custom={direction}>
          <GallerySlide key={current.src} artwork={current} direction={direction} reducedMotion={reducedMotion} active={active} priority={index === 0} onHover={setHovered} />
        </AnimatePresence>
      </div>
      <ArtworkTiles artwork={artwork} index={index} reducedMotion={reducedMotion}
        onHover={setTilesHovered} onSelect={(index, direction) => setSlide({ index, direction })} />
    </section>
  );
}
