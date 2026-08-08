"use client";

import { useEffect, useRef, useState } from "react";
import {
  archLayout,
  gridLayout,
  makeBloomSprite,
  solveFrame,
  type BloomInstance,
} from "@/lib/bloomAtlas";

type Scene = {
  atlas: Array<HTMLCanvasElement | null>;
  spriteSize: number;
  instances: BloomInstance[];
  phoneW: number;
  phoneH: number;
  phoneY: number;
};

// Preserve generated sprites across client-side visits. Each breakpoint has a
// stable atlas, so returning home does not repeat the expensive shape render.
let atlasCache: {
  key: string;
  sprites: Array<HTMLCanvasElement | null>;
} | null = null;

function cachedAtlas(count: number, size: number) {
  const key = `${count}:${size}`;
  if (atlasCache?.key === key) return atlasCache.sprites;
  const sprites = Array.from<HTMLCanvasElement | null>({ length: count }).fill(null);
  atlasCache = { key, sprites };
  return sprites;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const ease = (t: number) => {
  const n = clamp01(t);
  return n * n * (3 - 2 * n);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function buildScene(w: number, h: number, mobile: boolean): Scene {
  const maxPhoneWForHeight = Math.max(180, (h - 28) * (415 / 843));
  const phoneW = mobile
    ? Math.min(330, w * 0.78, maxPhoneWForHeight)
    : Math.min(390, w * 0.285, maxPhoneWForHeight);
  const phoneH = phoneW * (843 / 415);
  const phoneY = Math.max(14, (h - phoneH) / 2 - (mobile ? 2 : 16));
  // Mobile needs its own overloaded field: a narrow viewport otherwise causes
  // the phone-clearance region to consume both side rails.
  const count = w >= 1600 ? 600 : mobile ? 320 : 390;
  // Reserve one independent sprite per bloom without rendering all of them in
  // one blocking burst. Drawing lazily fills this cached atlas as blooms enter.
  const spriteSize = mobile ? 160 : 260;
  const atlas = cachedAtlas(count, spriteSize);
  const gapWidth = phoneW * 1.35;
  const gap = {
    x: (w - gapWidth) / 2,
    y: h * 0.48,
    width: gapWidth,
    height: h * 0.58,
  };
  const screen = {
    x: (w - phoneW) / 2 + phoneW * 0.095,
    y: phoneY + phoneH * 0.075,
    width: phoneW * 0.81,
    height: phoneH * 0.85,
  };
  const instances = archLayout(w, h, count, gap, atlas.length);
  const targets = gridLayout(screen, 3, 3);
  const collapseX = screen.x + screen.width / 2;
  const collapseY = screen.y + screen.height * 0.47;
  const clusterRadius = phoneW * (mobile ? 0.13 : 0.15);

  instances.forEach((item, index) => {
    // Golden-angle packing keeps every independent sprite in the bouquet while
    // distributing its depth around one tight centre instead of flattening the
    // scene into a precomposed image.
    const angle = index * 2.399963229728653;
    const radius = Math.sqrt(index / instances.length) * clusterRadius;
    item.collapseX = collapseX + Math.cos(angle) * radius;
    item.collapseY = collapseY + Math.sin(angle) * radius * 0.86;
    item.collapseScale = Math.max(mobile ? 20 : 24, item.scale * 0.38);
    if (index < targets.length) item.grid = targets[index];
  });

  return { atlas, spriteSize, instances, phoneW, phoneH, phoneY };
}

export function ChromaHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const rafRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const phone = phoneRef.current;
    if (!section || !canvas || !phone) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollRoot = section.closest<HTMLElement>("[data-site-scroll]");
    const scrollTarget: Window | HTMLElement = scrollRoot ?? window;
    const overflowTarget = scrollRoot ?? document.body;
    const previousOverflow = overflowTarget.style.overflowY;
    let introProgress = reducedQuery.matches ? 1 : 0;
    let introRaf: number | null = null;

    const rebuild = () => {
      const box = section.querySelector<HTMLElement>(".chroma-hero-sticky");
      if (!box) return;
      const w = Math.max(1, box.clientWidth);
      const h = Math.max(1, box.clientHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      sceneRef.current = buildScene(w, h, w < 640);
      section.dataset.atlasBuilt = "true";
      draw();
    };

    const progress = () => {
      if (reducedQuery.matches) return 1;
      const rect = section.getBoundingClientRect();
      const sticky = section.querySelector<HTMLElement>(".chroma-hero-sticky");
      const stickyHeight = sticky?.clientHeight ?? window.innerHeight;
      const scrollportTop = scrollRoot?.getBoundingClientRect().top ?? 0;
      return clamp01(
        (scrollportTop - rect.top) / Math.max(1, rect.height - stickyHeight),
      );
    };

    const draw = () => {
      rafRef.current = null;
      const scene = sceneRef.current;
      if (!scene) return;
      const p = progress();
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const frames = solveFrame(scene.instances, p);
      const introduced = introProgress * (frames.length + 8);
      for (let index = 0; index < frames.length; index++) {
        const frame = frames[index];
        const reveal = p < 0.25 ? ease((introduced - index) / 8) : 1;
        if (reveal <= 0 || frame.alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = frame.alpha * reveal;
        ctx.translate(frame.x, frame.y);
        const spriteIndex = frame.spriteIndex % scene.atlas.length;
        let sprite = scene.atlas[spriteIndex];
        if (!sprite) {
          sprite = makeBloomSprite(scene.spriteSize);
          scene.atlas[spriteIndex] = sprite;
        }
        ctx.rotate((frame.rotation * Math.PI) / 180);
        const scale = frame.scale * (0.2 + reveal * 0.8);
        ctx.drawImage(sprite, -scale / 2, -scale / 2, scale, scale);
        ctx.restore();
      }

      const phoneT = ease(p / 0.42);
      const y = lerp(h + 28, scene.phoneY, phoneT);
      phone.style.width = `${scene.phoneW}px`;
      phone.style.height = `${scene.phoneH}px`;
      phone.style.transform = `translate3d(-50%, ${y}px, 0)`;

      // The verbal turn belongs to the bouquet, not the finished grid. Change
      // the message as soon as every independent bloom has finished stacking.
      const nextResolved = p >= 0.42;
      if (nextResolved !== resolvedRef.current) {
        resolvedRef.current = nextResolved;
        setResolved(nextResolved);
      }
    };

    const requestDraw = () => {
      if (rafRef.current === null) rafRef.current = window.requestAnimationFrame(draw);
    };

    const finishIntro = () => {
      introProgress = 1;
      overflowTarget.style.overflowY = previousOverflow;
      draw();
    };

    const startIntro = () => {
      if (reducedQuery.matches) {
        finishIntro();
        return;
      }
      overflowTarget.style.overflowY = "hidden";
      const started = performance.now();
      const duration = 2800;
      const tick = (now: number) => {
        if (reducedQuery.matches) {
          finishIntro();
          return;
        }
        introProgress = ease((now - started) / duration);
        draw();
        if (introProgress < 1) introRaf = window.requestAnimationFrame(tick);
        else finishIntro();
      };
      introRaf = window.requestAnimationFrame(tick);
    };

    rebuild();
    startIntro();
    scrollTarget.addEventListener("scroll", requestDraw, { passive: true });
    window.addEventListener("resize", rebuild);
    reducedQuery.addEventListener("change", rebuild);

    return () => {
      scrollTarget.removeEventListener("scroll", requestDraw);
      window.removeEventListener("resize", rebuild);
      reducedQuery.removeEventListener("change", rebuild);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      if (introRaf !== null) window.cancelAnimationFrame(introRaf);
      overflowTarget.style.overflowY = previousOverflow;
    };
  }, []);

  return (
    <section id="chroma" ref={sectionRef} className="chroma-hero" aria-labelledby="chroma-hero-title">
      <div className="chroma-hero-sticky">
        <canvas ref={canvasRef} className="chroma-hero-canvas" aria-hidden />

        <div ref={phoneRef} className="chroma-phone chroma-phone-frame-wrap" aria-hidden>
          <div className="chroma-phone-frame" />
        </div>

        <h1
          id="chroma-hero-title"
          className={`chroma-hero-copy ${resolved ? "is-resolved" : ""}`}
          aria-live="polite"
        >
          <span className="chroma-copy-mess">EMOTIONS CAN BE MESSY.</span>
          <span className="chroma-copy-pattern">CHROMA HELPS YOU SEE THE PATTERN.</span>
        </h1>

        <div className="chroma-hero-meta" aria-hidden>
          <span>CHROMA / 2026</span>
          <span>SCROLL TO RESOLVE</span>
        </div>
      </div>

      <style>{`
        .chroma-hero {
          position: relative;
          height: 440svh;
          min-height: 2200px;
          background: #1c1c1e;
          color: var(--signal);
        }
        .chroma-hero-sticky {
          position: sticky;
          top: 0;
          height: calc(100dvh - 64px);
          min-height: 0;
          overflow: hidden;
          background: #1c1c1e;
          isolation: isolate;
        }
        .chroma-hero-canvas {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: block;
        }
        .chroma-phone {
          position: absolute;
          top: 0;
          left: 50%;
          will-change: transform;
          opacity: 0;
        }
        .chroma-hero[data-atlas-built="true"] .chroma-phone { opacity: 1; }
        .chroma-phone-frame-wrap { z-index: 0; pointer-events: none; }
        .chroma-phone-frame {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: url("/chroma/iphone-frame.svg") center / 100% 100% no-repeat;
          filter: drop-shadow(0 32px 80px rgba(0, 0, 0, 0.55));
        }
        .chroma-hero-copy {
          position: absolute;
          z-index: 3;
          top: 72%;
          left: 50%;
          width: calc(100% - 48px);
          transform: translate(-50%, -50%);
          margin: 0;
          color: var(--signal);
          font-family: var(--font-orbitron), sans-serif;
          font-size: clamp(28px, 3.55vw, 64px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.012em;
          text-align: center;
          white-space: nowrap;
          text-shadow: 0 2px 28px rgba(0, 0, 0, 0.86);
        }
        .chroma-hero-copy > span {
          grid-area: 1 / 1;
          display: block;
          transition: opacity 360ms ease, transform 460ms cubic-bezier(.2,.8,.2,1);
        }
        .chroma-hero-copy {
          display: grid;
        }
        .chroma-copy-mess {
          opacity: 1;
          transform: translateY(0);
        }
        .chroma-copy-pattern {
          opacity: 0;
          transform: translateY(0.32em);
        }
        .chroma-hero-copy.is-resolved .chroma-copy-mess {
          opacity: 0;
          transform: translateY(-0.32em);
        }
        .chroma-hero-copy.is-resolved .chroma-copy-pattern {
          opacity: 1;
          transform: translateY(0);
        }
        .chroma-hero-meta {
          position: absolute;
          z-index: 4;
          right: 24px;
          bottom: 18px;
          left: 24px;
          display: none;
          justify-content: space-between;
          gap: 16px;
          font-family: var(--font-plex-mono), monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: rgba(245, 245, 243, 0.5);
        }
        @media (min-width: 768px) {
          .chroma-hero-sticky {
            height: calc(100dvh - 72px);
          }
          .chroma-hero-meta { right: 40px; bottom: 24px; left: 40px; }
        }
        @media (max-width: 639px) {
          .chroma-hero { min-height: 2800px; }
          .chroma-hero-copy {
            width: calc(100% - 32px);
            top: 73%;
            font-size: clamp(21px, 6.5vw, 32px);
            white-space: normal;
            line-height: 1.02;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chroma-hero {
            height: calc(100dvh - 64px);
            min-height: 0;
          }
          .chroma-hero-meta span:last-child { display: none; }
          .chroma-hero-copy > span { transition: none; }
          .chroma-copy-mess { opacity: 0 !important; }
          .chroma-copy-pattern { opacity: 1 !important; transform: none !important; }
        }
        @media (prefers-reduced-motion: reduce) and (min-width: 768px) {
          .chroma-hero { height: calc(100dvh - 72px); }
        }
      `}</style>
    </section>
  );
}
