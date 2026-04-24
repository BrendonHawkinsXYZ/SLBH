"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { FieldMark } from "@/components/FieldMark";
import { revealVariants, revealTransition, EASE_OUT, DURATIONS } from "@/lib/motion";

const BASE_RADIUS = 520;

function randomGradient(): string {
  const base = Math.random() * 360;
  const stops = Array.from({ length: 6 }, (_, i) => {
    const h = (base + i * 50 + (Math.random() - 0.5) * 22) % 360;
    const s = 38 + Math.random() * 28;
    const l = 63 + Math.random() * 17;
    const pct = Math.round(i * (96 / 5));
    return `hsl(${Math.round((h + 360) % 360)},${Math.round(s)}%,${Math.round(l)}%) ${pct}%`;
  });
  const cx = 18 + Math.random() * 56;
  const cy = 10 + Math.random() * 56;
  return `radial-gradient(circle at ${Math.round(cx)}% ${Math.round(cy)}%, ${stops.join(", ")})`;
}

export function HomeSurface() {
  const [gradient] = useState(randomGradient);
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
      {/* ─── Field ─── */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATIONS.slow, ease: EASE_OUT, delay: 0.8 }}
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
        <div
          className="field-pulse"
          style={{
            width: "min(520px, 92vw)",
            height: "min(520px, 92vw)",
            borderRadius: "50%",
            background: gradient,
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* ─── Origin mark ─── */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: DURATIONS.slow, ease: EASE_OUT, delay: 1.0 }}
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
        <FieldMark size="xl" />
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
        .hero-col {
          width: 100%;
          max-width: 560px;
        }
        @media (min-width: 640px) {
          .hero-col { width: min(48%, 560px); }
        }
      `}</style>
    </section>
  );
}
