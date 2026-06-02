"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "@/lib/projects";

const SPRING = { stiffness: 380, damping: 30, mass: 0.4 };
const CARD_W = 320;
const CARD_H = 400;

const STATUS_LABEL: Record<string, string> = {
  active: "ACTIVE",
  paused: "PAUSED",
  complete: "COMPLETE",
};

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mx = useMotionValue(600);
  const my = useMotionValue(300);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mx.set(e.clientX + 28);
      my.set(e.clientY - CARD_H / 2);
    },
    [mx, my]
  );

  const onRowEnter = useCallback((slug: string) => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    setHovered(slug);
    setCardVisible(true);
  }, []);

  const onRowLeave = useCallback(() => {
    setCardVisible(false);
    fadeTimer.current = setTimeout(() => setHovered(null), 420);
  }, []);

  return (
    <section
      className="container-page proj-index-section"
      onMouseMove={onMouseMove}
    >
      {/* Floating cover card — desktop pointer:fine only */}
      <motion.div
        className="proj-float-card"
        style={{
          position: "fixed",
          left: sx,
          top: sy,
          width: CARD_W,
          height: CARD_H,
          pointerEvents: "none",
          zIndex: 100,
          border: "0.5px solid var(--hairline-strong)",
          overflow: "hidden",
          opacity: cardVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {(() => {
          const p = projects.find((p) => p.slug === hovered);
          return p?.coverPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.coverPath}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : null;
        })()}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--graphite)",
            zIndex: -1,
          }}
        />
      </motion.div>

      {/* Desktop list — pointer:fine */}
      <ul className="proj-list">
        {projects.map((p) => (
          <li
            key={p.slug}
            className="proj-row-item"
            style={{
              opacity: hovered && hovered !== p.slug ? 0.35 : 1,
              transition: "opacity 600ms var(--ease-out)",
            }}
            onMouseEnter={() => onRowEnter(p.slug)}
            onMouseLeave={onRowLeave}
          >
            <Link href={p.href ?? `/projects/${p.slug}`} className="proj-row-link link-quiet">
              <span className="proj-col-idx t-mono" style={{ opacity: 0.55 }}>
                {p.index}
              </span>
              <span className="proj-col-name">{p.title}</span>
              <span className="proj-col-year t-mono" style={{ opacity: 0.55 }}>
                {p.year}
              </span>
              <span className="proj-col-disc t-label" style={{ opacity: 0.72 }}>
                {p.discipline.join(", ")}
              </span>
              <span className="proj-col-status t-label">
                {STATUS_LABEL[p.status] ?? p.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile card list — pointer:coarse or narrow viewport */}
      <ul className="proj-mobile-list">
        {projects.map((p) => (
          <li key={p.slug} className="proj-mobile-item">
            <Link
              href={p.href ?? `/projects/${p.slug}`}
              className="proj-mobile-link link-quiet"
            >
              <div className="proj-mobile-thumb">
                {p.thumbnailPath && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.thumbnailPath}
                    alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                )}
              </div>
              <div className="proj-mobile-meta">
                <span className="t-h3" style={{ letterSpacing: "-0.01em", display: "block", marginBottom: 8 }}>
                  {p.title}
                </span>
                <span className="t-mono" style={{ opacity: 0.55, display: "block", marginBottom: 12 }}>
                  {p.year}
                </span>
                <span className="proj-col-status t-label">
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <style>{`
        .proj-index-section {
          padding-top: 64px;
          padding-bottom: 120px;
        }

        /* ── Floating card ── */
        .proj-float-card { display: none; }
        @media (pointer: fine) {
          .proj-float-card { display: block; }
        }

        /* ── Desktop list ── */
        .proj-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: none;
        }
        @media (pointer: fine) {
          .proj-list { display: block; }
        }

        .proj-row-item { border-top: 0.5px solid var(--hairline); }
        .proj-row-item:last-child { border-bottom: 0.5px solid var(--hairline); }

        .proj-row-link {
          display: flex;
          align-items: center;
          gap: 24px;
          height: 96px;
          text-decoration: none;
          color: var(--ground);
        }
        .proj-col-idx  { width: 60px;  flex-shrink: 0; font-size: 11px; }
        .proj-col-name {
          flex: 1;
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .proj-col-year { width: 64px;  flex-shrink: 0; font-size: 11px; text-align: right; }
        .proj-col-disc { width: 200px; flex-shrink: 0; font-size: 10px; text-align: right; }
        .proj-col-status {
          flex-shrink: 0;
          border: 1px solid var(--hairline-strong);
          padding: 6px 12px;
          font-size: 10px;
          letter-spacing: 0.14em;
          white-space: nowrap;
        }

        /* ── Mobile list ── */
        .proj-mobile-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: none;
        }
        @media (pointer: coarse), (max-width: 767px) {
          .proj-list    { display: none !important; }
          .proj-float-card { display: none !important; }
          .proj-mobile-list { display: block; }
        }

        .proj-mobile-item { border-top: 0.5px solid var(--hairline); }
        .proj-mobile-item:last-child { border-bottom: 0.5px solid var(--hairline); }

        .proj-mobile-link {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding: 24px 0;
          text-decoration: none;
          color: var(--ground);
        }
        .proj-mobile-thumb {
          width: 88px;
          height: 88px;
          flex-shrink: 0;
          position: relative;
          background: var(--graphite);
          overflow: hidden;
        }
        .proj-mobile-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </section>
  );
}
