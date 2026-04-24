"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";
import { FieldMark } from "@/components/FieldMark";
import { TrunkLine } from "@/components/TrunkLine";
import {
  revealVariants,
  revealTransition,
  EASE_OUT,
  DURATIONS,
} from "@/lib/motion";

/* ═══ FIELD GRADIENTS ═══
   Three keyed states the field steps through on scroll: warm → magenta → plum.
   Authored by color, not interpolated; crossfaded between the three MotionValues. */

const GRADIENT_WARM =
  "radial-gradient(circle at 32% 30%, #F5E9A8 0%, #F0D4A0 12%, #E89BB8 28%, #B89CE0 48%, #7B8FE0 68%, #3E5FA8 88%)";

const GRADIENT_MAGENTA =
  "radial-gradient(circle at 36% 34%, #FFE0B8 0%, #FFA8C5 16%, #D678C5 36%, #A85FF7 58%, #5C3AA8 86%)";

const GRADIENT_PLUM =
  "radial-gradient(circle at 40% 40%, #D4B8FF 0%, #A85FF7 20%, #6B3AC7 44%, #3E2288 72%, #18143A 94%)";

const BASE_RADIUS = 420;
const MAX_RADIUS = 1800;
const MAX_SCALE = MAX_RADIUS / BASE_RADIUS;

export function HomeSurface() {
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, MAX_SCALE]);
  const radiusPx = useTransform(
    scrollYProgress,
    [0, 1],
    [BASE_RADIUS, MAX_RADIUS],
  );

  const opWarm = useTransform(scrollYProgress, [0, 0.4, 0.55], [1, 0.35, 0]);
  const opMagenta = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0, 1, 0.25],
  );
  const opPlum = useTransform(scrollYProgress, [0.55, 0.85, 1], [0, 0.6, 1]);

  const progressLabel = useTransform(scrollYProgress, (v) =>
    v.toFixed(2).padStart(4, "0"),
  );
  const radiusLabel = useTransform(radiusPx, (v) => `${Math.round(v)}`);
  const readoutLine = useMotionTemplate`Δ ${progressLabel} · RADIUS ${radiusLabel}px`;

  return (
    <>
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: 780,
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* ─── Field ─── */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DURATIONS.slow,
            ease: EASE_OUT,
            delay: 1.0,
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <motion.div
            style={{
              width: BASE_RADIUS,
              height: BASE_RADIUS,
              scale: fieldScale,
              willChange: "transform",
            }}
          >
            <div
              className="field-pulse"
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: GRADIENT_WARM,
                  opacity: opWarm,
                }}
              />
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: GRADIENT_MAGENTA,
                  opacity: opMagenta,
                }}
              />
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: GRADIENT_PLUM,
                  opacity: opPlum,
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Origin mark ─── */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{
            duration: DURATIONS.slow,
            ease: EASE_OUT,
            delay: 1.2,
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            mixBlendMode: "screen",
            color: "var(--signal)",
          }}
        >
          <FieldMark size="lg" />
        </motion.div>

        {/* ─── Editorial column ─── */}
        <div
          className="container-page"
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: 780,
            display: "flex",
            alignItems: "center",
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          <div className="hero-col">
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.55, y: 0 }}
              transition={{
                duration: DURATIONS.base,
                ease: EASE_OUT,
                delay: 1.2,
              }}
              className="t-mono-label"
              style={{
                letterSpacing: "0.12em",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 28,
              }}
            >
              <FieldMark size="xs" /> SYSTEMS RESEARCH LAB / EST. 2024
            </motion.p>

            <h1 className="t-display" style={{ margin: 0, maxWidth: 520 }}>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={revealVariants}
                transition={{ ...revealTransition("editorial"), delay: 1.7 }}
                style={{ display: "block" }}
              >
                Every feeling
              </motion.span>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={revealVariants}
                transition={{ ...revealTransition("editorial"), delay: 1.9 }}
                style={{ display: "block" }}
              >
                is a coordinate.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.82, y: 0 }}
              transition={{
                duration: DURATIONS.base,
                ease: EASE_OUT,
                delay: 2.1,
              }}
              className="t-body-lg"
              style={{ marginTop: 24, maxWidth: 420 }}
            >
              Studio Lab BH is a systems research lab building computational
              models, instruments, and environments for affect, the invisible
              architecture of human experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: DURATIONS.base,
                ease: EASE_OUT,
                delay: 2.4,
              }}
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/research/emotion-as-system"
                className="t-nav link-quiet"
                style={{
                  background: "var(--ground)",
                  color: "var(--signal)",
                  padding: "15px 30px",
                  borderRadius: 40,
                  textDecoration: "none",
                  display: "inline-block",
                  letterSpacing: "0.18em",
                  fontSize: 10.5,
                }}
              >
                Read the research ↗
              </Link>
              <Link
                href="/projects"
                className="t-nav link-quiet"
                style={{
                  color: "var(--ground)",
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                  fontSize: 10.5,
                  letterSpacing: "0.18em",
                }}
              >
                See projects
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ─── Trunk line anchor at bottom of hero ─── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATIONS.slow,
            ease: EASE_OUT,
            delay: 2.8,
          }}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <TrunkLine length={110} nodePosition="top" />
        </motion.div>
      </section>

      {/* ─── Section B — Mono readout strip ─── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: DURATIONS.base,
          ease: EASE_OUT,
          delay: 2.4,
        }}
        className="container-page readout-strip"
      >
        <span className="t-mono" style={{ opacity: 0.55 }}>
          SLBH / v2.0 / HOME
        </span>
        <span
          className="t-label readout-middle"
          style={{ opacity: 0.55, letterSpacing: "0.18em" }}
        >
          AFFECT · SYSTEMS · DATA · TIME
        </span>
        <motion.span
          className="t-mono"
          style={{
            opacity: 0.55,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {readoutLine}
        </motion.span>
      </motion.div>

      <style>{`
        .hero-col {
          width: 100%;
          max-width: 520px;
        }
        @media (min-width: 640px) {
          .hero-col { width: min(44%, 520px); }
        }
        .readout-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 20px;
          padding-bottom: 20px;
        }
        .readout-middle {
          display: none;
        }
        @media (min-width: 768px) {
          .readout-middle { display: block; }
          .readout-strip { padding-top: 28px; padding-bottom: 28px; }
        }
      `}</style>
    </>
  );
}
