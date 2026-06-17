"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FieldMark } from "@/components/FieldMark";
import { FieldSphere } from "@/components/home/FieldSphere";
import { revealVariants, revealTransition, EASE_OUT, DURATIONS } from "@/lib/motion";

export function HomeSurface() {
  return (
    <section
      className="hero-section"
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ─── Field — the shape-morphing affect mosaic, centred + full-bleed behind the type.
          Motion behind the statement: the background is the thesis, not decoration. ─── */}
      <motion.div
        aria-hidden
        className="field-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATIONS.slow, ease: EASE_OUT, delay: 0.6 }}
      >
        <FieldSphere />
      </motion.div>

      {/* ─── Legibility scrim: a soft paper glow so the statement reads over the field ─── */}
      <div aria-hidden className="hero-scrim" />

      {/* ─── Editorial column — a centred mass that owns the screen ─── */}
      <div
        className="container-page"
        style={{ position: "relative", zIndex: 2, width: "100%" }}
      >
        <div className="hero-col">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.0 }}
            className="t-mono-label hero-eyebrow"
          >
            <FieldMark size="xs" /> SYSTEMS RESEARCH LAB / EST. 2024
          </motion.p>

          <motion.h1
            className="hero-headline"
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            transition={{ ...revealTransition("editorial"), delay: 1.4 }}
          >
            Every feeling is a coordinate.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.82, y: 0 }}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.9 }}
            className="t-body-lg hero-body"
          >
            Studio Lab BH is a systems research lab building computational
            models, instruments, and environments for affect — the invisible
            architecture of human experience.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 2.2 }}
          >
            <Link
              href="/research/emotion-as-system"
              className="t-nav link-quiet"
              style={{
                background: "var(--ground)",
                color: "var(--signal)",
                border: "1px solid var(--ground)",
                padding: "16px 32px",
                borderRadius: 40,
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "0.18em",
                fontSize: 10.5,
              }}
            >
              Read the paper
            </Link>
            <Link
              href="https://globalemotions.studiolabbh.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="t-nav link-quiet"
              style={{
                background: "transparent",
                color: "var(--ground)",
                border: "1px solid var(--ground)",
                padding: "16px 32px",
                borderRadius: 40,
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "0.18em",
                fontSize: 10.5,
              }}
            >
              See the work
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        .hero-section {
          min-height: calc(100vh - 64px);
          min-height: calc(100svh - 64px);
          padding-top: 32px;
          padding-bottom: 32px;
        }
        @media (min-width: 768px) {
          .hero-section {
            min-height: calc(100vh - 72px);
            min-height: calc(100svh - 72px);
          }
        }

        .field-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .hero-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(
            ellipse 78% 62% at 50% 47%,
            rgba(243, 242, 242, 0.80) 0%,
            rgba(243, 242, 242, 0.46) 42%,
            rgba(243, 242, 242, 0) 72%
          );
        }

        .hero-col {
          width: 100%;
          max-width: 820px;
          margin-inline: auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-eyebrow {
          letter-spacing: 0.12em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 28px;
        }

        .hero-headline {
          margin: 0;
          max-width: 11ch;
          font-family: var(--font-inter), sans-serif;
          font-weight: 500;
          font-size: clamp(46px, 10.5vw, 116px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-wrap: balance;
        }

        .hero-body {
          margin: 28px 0 0;
          max-width: 460px;
        }

        .hero-cta {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
        }

        @media (min-width: 768px) {
          .hero-eyebrow { margin-bottom: 34px; }
          .hero-body { margin-top: 34px; }
          .hero-cta { margin-top: 50px; }
        }
      `}</style>
    </section>
  );
}
