"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DURATIONS, EASE_IN_OUT, EASE_OUT, RESEARCH_SPECTRUM } from "@/lib/motion";

type Instrument = {
  title: string;
  description: string;
  href: string;
  vignette: "chroma" | "field-monitor" | "diagrams";
};

const INSTRUMENTS: Instrument[] = [
  {
    title: "Chroma",
    description:
      "A computational pipeline for mapping collective affect across public data sources. Field states, deltas, and divergences rendered as luminous coordinates.",
    href: "/projects/chroma",
    vignette: "chroma",
  },
  {
    title: "Field Monitor",
    description:
      "A real-time interface for reading affective field state. Valence, arousal, entropy, coherence, surfaced as measurement rather than interpretation.",
    href: "/research",
    vignette: "field-monitor",
  },
  {
    title: "Diagrams",
    description:
      "Research artifacts made as figures. Each diagram is citable, versioned, and built to be read alone or inside a paper.",
    href: "/diagrams",
    vignette: "diagrams",
  },
];

const REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Instruments() {
  return (
    <section
      className="container-page instr-section"
    >
      <motion.header
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={REVEAL_VARIANTS}
        transition={{ duration: DURATIONS.base, ease: EASE_OUT }}
        style={{ marginBottom: 64 }}
      >
        <p className="t-mono" style={{ opacity: 0.55, marginBottom: 12 }}>
          01 / INSTRUMENTS
        </p>
        <h2 className="t-h2" style={{ margin: 0, maxWidth: 720 }}>
          What the lab builds.
        </h2>
      </motion.header>

      <div className="instruments-grid">
        {INSTRUMENTS.map((item, i) => (
          <motion.article
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={REVEAL_VARIANTS}
            transition={{
              duration: DURATIONS.base,
              ease: EASE_OUT,
              delay: i * 0.1,
            }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <Vignette kind={item.vignette} />
            <h3 className="t-h3" style={{ margin: 0 }}>
              {item.title}
            </h3>
            <p
              className="t-body-sm"
              style={{ opacity: 0.75, margin: 0, maxWidth: 360 }}
            >
              {item.description}
            </p>
            <Link
              href={item.href}
              className="t-label link-quiet"
              style={{
                color: "var(--ground)",
                textDecoration: "underline",
                textUnderlineOffset: 4,
                letterSpacing: "0.18em",
              }}
            >
              Learn more ↗︎
            </Link>
          </motion.article>
        ))}
      </div>

      <style>{`
        .instr-section { padding-top: 72px; padding-bottom: 72px; }
        @media (min-width: 768px) { .instr-section { padding-top: 120px; padding-bottom: 120px; } }
        .instruments-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
        }
        @media (min-width: 600px) {
          .instruments-grid { grid-template-columns: repeat(2, 1fr); gap: 48px; }
        }
        @media (min-width: 900px) {
          .instruments-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .vignette-circle {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 280px;
        }
        @media (min-width: 900px) {
          .vignette-circle { max-width: none; }
        }
      `}</style>
    </section>
  );
}

function Vignette({ kind }: { kind: Instrument["vignette"] }) {
  return (
    <div
      className="vignette-circle"
      style={{
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        background:
          kind === "diagrams"
            ? "var(--paper)"
            : kind === "chroma"
            ? "var(--ground)"
            : "var(--graphite)",
        border: "1px solid var(--hairline-strong)",
      }}
    >
      {kind === "chroma" && <ChromaVignette />}
      {kind === "field-monitor" && <FieldMonitorVignette />}
      {kind === "diagrams" && <DiagramsVignette />}
    </div>
  );
}

const CHROMA_RINGS = [
  { r: 38, speed: 90, count: 5 },
  { r: 48, speed: 140, count: 7 },
  { r: 28, speed: 70, count: 3 },
];

function ChromaVignette() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    >
      <circle cx={50} cy={50} r={0.9} fill="var(--signal)" opacity={0.55} />
      {CHROMA_RINGS.map((ring, ringIdx) => (
        <motion.g
          key={ringIdx}
          style={{ transformOrigin: "50px 50px" }}
          animate={{ rotate: 360 }}
          transition={{
            duration: ring.speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <circle
            cx={50}
            cy={50}
            r={ring.r}
            fill="none"
            stroke="rgba(245,245,243,0.08)"
            strokeWidth={0.25}
          />
          {Array.from({ length: ring.count }).map((_, i) => {
            const angle = (i / ring.count) * Math.PI * 2;
            const cx = 50 + Math.cos(angle) * ring.r;
            const cy = 50 + Math.sin(angle) * ring.r;
            const color =
              RESEARCH_SPECTRUM[
                (ringIdx * 3 + i) % RESEARCH_SPECTRUM.length
              ];
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={1.1}
                fill={color}
                opacity={0.9}
              />
            );
          })}
        </motion.g>
      ))}
    </svg>
  );
}

const FM_DOTS = [
  { cx: 28, cy: 48, delay: 0 },
  { cx: 64, cy: 44, delay: 1.2 },
  { cx: 52, cy: 76, delay: 2.4 },
];

function FieldMonitorVignette() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    >
      <defs>
        <radialGradient id="fm-bg" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#2a2a30" />
          <stop offset="50%" stopColor="#1b1b1f" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={100} height={100} fill="url(#fm-bg)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={10}
          x2={90}
          y1={12 + i * 9}
          y2={12 + i * 9}
          stroke="rgba(245,245,243,0.05)"
          strokeWidth={0.2}
        />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={12 + i * 9}
          x2={12 + i * 9}
          y1={10}
          y2={90}
          stroke="rgba(245,245,243,0.05)"
          strokeWidth={0.2}
        />
      ))}
      <path
        d="M24,56 C28,38 46,32 58,40 C68,46 74,58 68,70 C62,80 42,78 32,70 C26,66 22,62 24,56 Z"
        fill="none"
        stroke="var(--signal)"
        strokeWidth={0.6}
        opacity={0.85}
      />
      {FM_DOTS.map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r={1.6}
          fill="var(--signal)"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: EASE_IN_OUT,
            delay: dot.delay,
          }}
        />
      ))}
    </svg>
  );
}

const DIAGRAM_RAY_COUNT = 24;
const DIAGRAM_RAYS = Array.from({ length: DIAGRAM_RAY_COUNT }).map((_, i) => {
  const angle = (i / DIAGRAM_RAY_COUNT) * Math.PI * 2;
  const r = 24 + ((i * 7919) % 14);
  const x = 50 + Math.cos(angle) * r;
  const y = 50 + Math.sin(angle) * r;
  const order = ((i * 5) % DIAGRAM_RAY_COUNT) / DIAGRAM_RAY_COUNT;
  return { x, y, delay: order * 8 };
});

function DiagramsVignette() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    >
      {DIAGRAM_RAYS.map((ray, i) => (
        <motion.g
          key={i}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: EASE_IN_OUT,
            delay: ray.delay,
          }}
        >
          <line
            x1={50}
            y1={50}
            x2={ray.x}
            y2={ray.y}
            stroke="var(--ground)"
            strokeWidth={0.3}
          />
          <circle cx={ray.x} cy={ray.y} r={1.1} fill="var(--ground)" />
        </motion.g>
      ))}
      <circle cx={50} cy={50} r={1.6} fill="var(--ground)" />
    </svg>
  );
}
