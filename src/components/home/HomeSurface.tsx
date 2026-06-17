"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FieldSphere } from "@/components/home/FieldSphere";
import { revealVariants, EASE_OUT, DURATIONS } from "@/lib/motion";

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

      {/* ─── Legibility scrim: follows where the type sits (centre on desktop's left,
          top + bottom on mobile) so the shape stays vivid where the text isn't. ─── */}
      <div aria-hidden className="hero-scrim" />

      {/* ─── Editorial column. On desktop it's a left-aligned mass centred in the
          viewport; on mobile the headline pins to the top and the body + buttons
          drop to the bottom, leaving the shape clear in the middle. ─── */}
      <div
        className="hero-pad"
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
            WHAT DOES EMOTION LOOK LIKE?
          </motion.h1>

          <div className="hero-lower">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.5 }}
              className="t-body-lg hero-body"
            >
              Studio Lab BH is a systems research lab building computational
              models and instruments for affect.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.8 }}
            >
              <Link
                href="/research/emotion-as-system"
                className="t-nav link-quiet hero-pill hero-pill-solid"
              >
                Read the paper
              </Link>
              <Link
                href="https://globalemotions.studiolabbh.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="t-nav link-quiet hero-pill hero-pill-ghost"
              >
                See the work
              </Link>
            </motion.div>
          </div>
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

        .hero-pad {
          padding-inline: var(--pad-x-mobile);
        }
        @media (min-width: 768px) {
          .hero-pad { padding-inline: var(--pad-x); }
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

        /* Desktop: left-anchored wash for the left-aligned type; shape vivid on the right. */
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
        /* Mobile: type lives top + bottom, so wash those and keep the centre (shape) clear. */
        @media (max-width: 767px) {
          .hero-scrim {
            background: linear-gradient(
              180deg,
              rgba(243, 242, 242, 0.55) 0%,
              rgba(243, 242, 242, 0.30) 24%,
              rgba(243, 242, 242, 0) 44%,
              rgba(243, 242, 242, 0) 56%,
              rgba(243, 242, 242, 0.34) 76%,
              rgba(243, 242, 242, 0.66) 100%
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
          font-family: var(--font-orbitron), sans-serif;
          font-weight: 700;
          font-size: clamp(36px, 9vw, 104px);
          line-height: 1;
          letter-spacing: 0;
          text-shadow: 0 2px 36px rgba(243, 242, 242, 0.5);
        }

        .hero-lower {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
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

        .hero-pill {
          display: inline-block;
          padding: 16px 32px;
          border: 1px solid var(--ground);
          border-radius: 40px;
          text-decoration: none;
          font-size: 10.5px;
          letter-spacing: 0.18em;
          text-align: center;
          white-space: nowrap;
        }
        .hero-pill-solid {
          background: var(--ground);
          color: var(--signal);
        }
        .hero-pill-ghost {
          background: rgba(243, 242, 242, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: var(--ground);
        }

        @media (min-width: 768px) {
          .hero-body { margin-top: 34px; }
          .hero-cta { margin-top: 50px; }
        }

        /* Mobile: headline pinned top, body + side-by-side buttons pinned bottom. */
        @media (max-width: 767px) {
          .hero-section { align-items: stretch; }
          .hero-pad { display: flex; flex-direction: column; }
          .hero-col { flex: 1; justify-content: space-between; }
          .hero-body { margin-top: 0; }
          .hero-cta {
            width: 100%;
            flex-wrap: nowrap;
            gap: 10px;
            margin-top: 22px;
          }
          .hero-pill {
            flex: 1 1 0;
            min-width: 0;
            padding: 14px 10px;
            font-size: 10px;
            letter-spacing: 0.1em;
          }
        }
      `}</style>
    </section>
  );
}
