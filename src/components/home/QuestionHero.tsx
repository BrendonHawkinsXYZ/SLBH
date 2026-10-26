"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Artwork } from "@/lib/artwork";
import { homeQuestions, questionProjects } from "@/lib/homeQuestions";
import { layoutQuestion } from "@/lib/questionTypography";
import styles from "./QuestionHero.module.css";

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getMotion = () => window.matchMedia(reducedQuery).matches;
const serverMotion = () => true;
const interval = 8000;

export function QuestionHero({ artwork }: { artwork: Artwork[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(true);
  const [extent, setExtent] = useState({ width: 1440, height: 680 });
  const [preview, setPreview] = useState<{ questionId: number; image: Artwork } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const lastPreview = useRef<Record<string, string>>({});
  const touch = useRef<{ x: number; y: number } | null>(null);
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, serverMotion);
  const playing = !reduced && !hovered && !focused && active && visible;
  const question = homeQuestions[index ?? 0];
  const project = questionProjects[question.project];
  const { glyphs, bounds } = useMemo(() => layoutQuestion(question, extent.width, extent.height), [question, extent]);
  const images = useMemo(() => {
    // The paper's related visual work is the diagram collection.
    const matching = artwork.filter(image => image.href === project.href || question.project === "theory" && image.href === "/diagrams");
    return matching.filter((image, imageIndex) => matching.findIndex(candidate => (candidate.stillSrc ?? candidate.src) === (image.stillSrc ?? image.src)) === imageIndex);
  }, [artwork, project.href, question.project]);

  useEffect(() => {
    const storageKey = "slbh-question-start";
    let previous = -1;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null) previous = Number(stored);
    } catch { /* Random selection still works when browser storage is unavailable. */ }
    const choices = homeQuestions.map((_, questionIndex) => questionIndex).filter(questionIndex => questionIndex !== previous);
    const start = choices[Math.floor(Math.random() * choices.length)];
    try { sessionStorage.setItem(storageKey, String(start)); } catch { /* Storage is optional. */ }
    setIndex(start);
  }, []);

  function positionPreview(image: Artwork, x: number, y: number) {
    const element = previewRef.current;
    if (!element) return;
    const ratio = image.width / image.height;
    const width = Math.min(320, window.innerWidth - 44, Math.min(400, window.innerHeight - 44) * ratio);
    const height = width / ratio;
    const left = x + width + 28 < window.innerWidth ? x + 28 : x - width - 28;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.left = `${Math.max(22, Math.min(left, window.innerWidth - width - 22))}px`;
    element.style.top = `${Math.max(22, Math.min(y - height / 2, window.innerHeight - height - 22))}px`;
  }

  function showPreview(x: number, y: number) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || !images.length) return;
    let image = preview?.questionId === question.id ? preview.image : null;
    if (!image) {
      const alternatives = images.filter(candidate => (candidate.stillSrc ?? candidate.src) !== lastPreview.current[question.project]);
      const pool = alternatives.length ? alternatives : images;
      image = pool[Math.floor(Math.random() * pool.length)];
      lastPreview.current[question.project] = image.stillSrc ?? image.src;
      setPreview({ questionId: question.id, image });
    }
    positionPreview(image, x, y);
  }

  function leavePreview() {
    setHovered(false);
    setPreview(null);
  }

  useEffect(() => {
    const stage = stageRef.current;
    const hero = heroRef.current;
    if (!stage || !hero) return;
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setExtent(previous => Math.abs(previous.width - width) < 1 && Math.abs(previous.height - height) < 1 ? previous : { width, height });
    });
    resize.observe(stage);
    const intersection = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    intersection.observe(hero);
    const visibility = () => setVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { resize.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!playing || index === null) return;
    const timer = window.setTimeout(() => setIndex(previous => ((previous ?? 0) + 1) % homeQuestions.length), interval);
    return () => window.clearTimeout(timer);
  }, [playing, index]);

  function step(direction: number) {
    setPreview(null);
    setHovered(false);
    setFocused(false);
    setIndex(previous => ((previous ?? 0) + direction + homeQuestions.length) % homeQuestions.length);
  }

  return (
    <section id="home-gallery" ref={heroRef} className={`site-surface ${styles.hero}`} aria-label="Questions from Studio Lab BH"
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
      <div ref={stageRef} className={styles.stage}
        onTouchStart={event => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY }; }}
        onTouchEnd={event => {
          if (!touch.current) return;
          const point = event.changedTouches[0];
          const dx = point.clientX - touch.current.x, dy = point.clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { event.preventDefault(); step(dx < 0 ? 1 : -1); }
        }}>
        <AnimatePresence mode="wait" initial={false}>
          {index !== null && <motion.svg key={question.id} className={styles.artwork} viewBox={`0 0 ${extent.width} ${extent.height}`}
            role="group" aria-label={`Question ${question.id} of ${homeQuestions.length}`} data-question={question.id} data-treatment={question.treatment}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .16 }}>
            <a href={project.href} className={styles.questionLink} aria-label={`${question.text} — ${project.title}`} data-question-link="true"
              onPointerEnter={event => { setHovered(true); if (event.pointerType === "mouse") showPreview(event.clientX, event.clientY); }}
              onPointerMove={event => { if (preview?.questionId === question.id) positionPreview(preview.image, event.clientX, event.clientY); }}
              onPointerLeave={leavePreview}
              onFocus={event => {
                setFocused(true);
                if (event.currentTarget.matches(":focus-visible")) {
                  const rect = event.currentTarget.getBoundingClientRect();
                  showPreview(rect.right, rect.top + rect.height / 2);
                }
              }}
              onBlur={() => { setFocused(false); setPreview(null); }} onClick={() => setPreview(null)}>
              <g aria-hidden="true">
                <rect className={styles.hitArea} {...bounds} data-question-hit-area="true" />
                {glyphs.map((glyph, glyphIndex) => (
                  <path key={glyphIndex} className={styles.letter} d={glyph.path} transform={glyph.transform}
                    fill={glyph.outline ? "none" : glyph.color} stroke={glyph.outline ? glyph.color : "none"}
                    strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            </a>
          </motion.svg>}
        </AnimatePresence>
      </div>
      <aside ref={previewRef} className={styles.preview} aria-hidden="true" data-question-preview={preview && active && visible && preview.questionId === question.id ? "visible" : "hidden"}>
        {preview && active && visible && preview.questionId === question.id && <Image
          key={preview.image.stillSrc ?? preview.image.src}
          src={preview.image.stillSrc ?? preview.image.src} alt="" width={preview.image.width} height={preview.image.height}
          sizes="320px" draggable={false} />}
      </aside>
    </section>
  );
}
