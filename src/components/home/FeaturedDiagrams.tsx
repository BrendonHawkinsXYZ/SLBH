"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DURATIONS, EASE_OUT } from "@/lib/motion";
import { AffectiveSystemsMatrix } from "@/components/diagrams/AffectiveSystemsMatrix";
import { ChromaDataModel } from "@/components/diagrams/ChromaDataModel";
import { EmotionalRenderingRelativity } from "@/components/diagrams/EmotionalRenderingRelativity";

type Feature = {
  fig: string;
  title: string;
  role: "Theory" | "Method" | "Output";
  source: string;
  poster: ReactNode;
};

const FEATURES: Feature[] = [
  {
    fig: "FIG. 01",
    title: "Affective Systems Matrix",
    role: "Theory",
    source: "AFFECTIVE COMPUTATIONAL GEOMETRY · v1.0",
    poster: <AffectiveSystemsMatrix />,
  },
  {
    fig: "FIG. 02",
    title: "Chroma Data Model",
    role: "Method",
    source: "AFFECTIVE COMPUTATIONAL GEOMETRY · v1.0",
    poster: <ChromaDataModel />,
  },
  {
    fig: "FIG. 03",
    title: "Emotional Rendering Relativity",
    role: "Output",
    source: "AFFECTIVE COMPUTATIONAL GEOMETRY · v1.0",
    poster: <EmotionalRenderingRelativity />,
  },
];

const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturedDiagrams() {
  return (
    <section
      style={{
        background: "var(--ground)",
        color: "var(--signal)",
        borderTop: "1px solid var(--hairline-strong)",
        borderBottom: "1px solid var(--hairline-strong)",
        paddingTop: 120,
        paddingBottom: 120,
      }}
    >
      <div className="container-page">
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={REVEAL_VARIANTS}
          transition={{ duration: DURATIONS.base, ease: EASE_OUT }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            marginBottom: 64,
          }}
        >
          <div>
            <p
              className="t-mono"
              style={{ opacity: 0.55, marginBottom: 12, color: "var(--signal)" }}
            >
              04 / DIAGRAMS
            </p>
            <h2
              className="t-h2"
              style={{ margin: 0, color: "var(--signal)", maxWidth: 760 }}
            >
              Figures, citable on their own.
            </h2>
          </div>
          <span
            className="t-label"
            style={{
              color: "var(--signal)",
              opacity: 0.55,
              letterSpacing: "0.18em",
            }}
          >
            ARCHIVE OPENS V2.1
          </span>
        </motion.header>

        <div className="fd-grid">
          {FEATURES.map((f, i) => (
            <motion.figure
              key={f.fig}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={REVEAL_VARIANTS}
              transition={{
                duration: DURATIONS.base,
                ease: EASE_OUT,
                delay: i * 0.1,
              }}
              className="fd-figure"
              style={{ margin: 0 }}
            >
              <div
                className="fd-surface"
                style={{
                  width: "100%",
                  aspectRatio: "4 / 5",
                  background: "var(--ground)",
                  border: "0.5px solid rgba(245,245,243,0.16)",
                  overflow: "hidden",
                  transition:
                    "transform var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out)",
                }}
              >
                {f.poster}
              </div>
              <figcaption
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  className="t-mono"
                  style={{ color: "var(--signal)", opacity: 0.55 }}
                >
                  {f.fig}
                </span>
                <span
                  className="t-h3"
                  style={{ color: "var(--signal)", fontSize: 14 }}
                >
                  {f.title}
                </span>
                <span
                  className="t-body-sm"
                  style={{ color: "var(--signal)", opacity: 0.72 }}
                >
                  {f.role}
                </span>
                <span
                  className="t-mono"
                  style={{ color: "var(--signal)", opacity: 0.55 }}
                >
                  {f.source}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p
          className="t-mono"
          style={{
            color: "var(--signal)",
            opacity: 0.55,
            textAlign: "center",
            marginTop: 48,
          }}
        >
          Diagrams are versioned, dated, and citable. Archive coming in v2.1.
        </p>
      </div>

      <style>{`
        .fd-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 900px) {
          .fd-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .fd-figure:hover .fd-surface {
          transform: translateY(-4px);
          border-color: rgba(245,245,243,0.32);
        }
        .fd-grid:has(.fd-figure:hover) .fd-figure:not(:hover) {
          opacity: 0.55;
          transition: opacity var(--d-fast) var(--ease-out);
        }
      `}</style>
    </section>
  );
}
