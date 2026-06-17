"use client";

import Link from "next/link";
import { motion } from "motion/react";
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

      {/* ─── Legibility scrim: a soft paper wash so the statement + sub-text read over the field ─── */}
      <div aria-hidden className="hero-scrim" />

      {/* ─── Editorial column — a left-aligned mass that owns the screen ─── */}
      <div
        className="container-page"
        style={{ position: "relative", zIndex: 2, width: "100%" }}
      >
        <div className="hero-col">
          <motion.h1
            className="hero-headline"
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.0 }}
          >
            Every feeling is a coordinate.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.5 }}
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
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.8 }}
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
                background: "rgba(243, 242, 242, 0.55)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
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

        /* Desktop: lift the left column where the (left-aligned) type lives,
           so the centred shape still reads vividly on the right. */
        .hero-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            rgba(243, 242, 242, 0.92) 0%,
            rgba(243, 242, 242, 0.80) 24%,
            rgba(243, 242, 242, 0.42) 48%,
            rgba(243, 242, 242, 0) 70%
          );
        }
        /* Mobile: the type is full-width, so wash a vertical band through the
           centre (where the text sits) and let the shape show top + bottom. */
        @media (max-width: 767px) {
          .hero-scrim {
            background: linear-gradient(
              180deg,
              rgba(243, 242, 242, 0) 0%,
              rgba(243, 242, 242, 0.72) 20%,
              rgba(243, 242, 242, 0.90) 50%,
              rgba(243, 242, 242, 0.72) 80%,
              rgba(243, 242, 242, 0) 100%
            );
          }
        }

        .hero-col {
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-headline {
          margin: 0;
          max-width: 12ch;
          font-family: var(--font-inter), sans-serif;
          font-weight: 700;
          font-size: clamp(46px, 10.5vw, 116px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          text-wrap: balance;
          text-shadow: 0 2px 36px rgba(243, 242, 242, 0.5);
        }

        .hero-body {
          margin: 28px 0 0;
          max-width: 460px;
          font-weight: 500;
          color: var(--ground);
          text-shadow:
            0 0 2px rgba(243, 242, 242, 0.95),
            0 0 14px rgba(243, 242, 242, 0.92),
            0 1px 2px rgba(243, 242, 242, 0.95);
        }

        .hero-cta {
          margin-top: 40px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 14px;
        }

        @media (min-width: 768px) {
          .hero-body { margin-top: 34px; }
          .hero-cta { margin-top: 50px; }
        }
      `}</style>
    </section>
  );
}
