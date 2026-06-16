"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FieldMark } from "@/components/FieldMark";
import { FieldSphere } from "@/components/home/FieldSphere";
import { revealVariants, revealTransition, EASE_OUT, DURATIONS } from "@/lib/motion";

export function HomeSurface() {
  return (
    <section
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* ─── Field (dithered sphere + origin mark) ───
          Centered on mobile; shifted into the empty right column on desktop. */}
      <motion.div
        aria-hidden
        className="field-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATIONS.slow, ease: EASE_OUT, delay: 0.8 }}
      >
        <div className="field-holder">
          <FieldSphere />
        </div>
      </motion.div>

      {/* ─── Editorial column ─── */}
      <div
        className="container-page"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          paddingTop: 48,
          paddingBottom: 48,
        }}
      >
        <div className="hero-col">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.0 }}
            className="t-mono-label"
            style={{
              letterSpacing: "0.12em",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 40,
            }}
          >
            <FieldMark size="xs" /> SYSTEMS RESEARCH LAB / EST. 2024
          </motion.p>

          <h1 className="t-display" style={{ margin: 0, maxWidth: 560 }}>
            <motion.span
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              transition={{ ...revealTransition("editorial"), delay: 1.4 }}
              style={{ display: "block" }}
            >
              Every feeling
            </motion.span>
            <motion.span
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              transition={{ ...revealTransition("editorial"), delay: 1.6 }}
              style={{ display: "block" }}
            >
              is a coordinate.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.82, y: 0 }}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 1.9 }}
            className="t-body-lg"
            style={{ marginTop: 36, maxWidth: 440 }}
          >
            Studio Lab BH is a systems research lab building computational
            models, instruments, and environments for affect — the invisible
            architecture of human experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATIONS.base, ease: EASE_OUT, delay: 2.2 }}
            style={{ marginTop: 52 }}
          >
            <Link
              href="/research/emotion-as-system"
              className="t-nav link-quiet"
              style={{
                background: "var(--ground)",
                color: "var(--signal)",
                padding: "16px 32px",
                borderRadius: 40,
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "0.18em",
                fontSize: 10.5,
              }}
            >
              Read the research
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        .field-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .field-holder {
          position: relative;
          width: min(520px, 92vw);
          height: min(520px, 92vw);
        }
        .hero-col {
          width: 100%;
          max-width: 560px;
        }
        @media (min-width: 640px) {
          .hero-col { width: min(48%, 560px); }
          .field-wrap {
            justify-content: flex-end;
            padding-right: clamp(16px, 7vw, 96px);
          }
        }
      `}</style>
    </section>
  );
}
